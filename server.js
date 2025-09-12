const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Store processed documents in memory (in production, use a database)
const documentStore = new Map();

// Helper function to extract text from different file types
async function extractTextFromFile(file) {
  const { buffer, mimetype, originalname } = file;
  
  try {
    switch (mimetype) {
      case 'application/pdf':
        const pdfData = await pdfParse(buffer);
        return pdfData.text;
        
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        let excelText = '';
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_csv(sheet);
          excelText += `Sheet: ${sheetName}\n${sheetData}\n\n`;
        });
        return excelText;
        
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        // For images, we'll use Gemini's vision capabilities
        return buffer; // Return buffer for image processing
        
      case 'text/plain':
        return buffer.toString('utf-8');
        
      default:
        throw new Error(`Unsupported file type: ${mimetype}`);
    }
  } catch (error) {
    throw new Error(`Failed to extract text from ${originalname}: ${error.message}`);
  }
}

// Helper function to analyze content with Gemini
async function analyzeWithGemini(content, isImage = false, prompt = null) {
  try {
    let result;
    
    if (isImage) {
      // For image analysis
      const imagePart = {
        inlineData: {
          data: content.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };
      
      const defaultPrompt = prompt || `
        Analyze this image and provide:
        1. A detailed description of what you see
        2. Any text content if present (OCR)
        3. Key insights or important information
        4. Summary of the main points
        
        Format your response in a clear, structured way.
      `;
      
      result = await model.generateContent([defaultPrompt, imagePart]);
    } else {
      // For text analysis
      const defaultPrompt = prompt || `
        Analyze the following document content and provide:
        1. A comprehensive summary
        2. Key insights and important points
        3. Main themes or topics
        4. Any actionable items or recommendations
        
        Document content:
        ${content}
        
        Format your response in a clear, structured way with headings and bullet points.
      `;
      
      result = await model.generateContent(defaultPrompt);
    }
    
    return result.response.text();
  } catch (error) {
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'InsightCopilot Backend API',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/upload',
      analyze: 'POST /api/analyze/:sessionId',
      query: 'POST /api/query/:sessionId'
    }
  });
});

// Upload and process document
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const sessionId = Date.now().toString();
    const file = req.file;
    
    // Extract content from file
    const isImage = file.mimetype.startsWith('image/');
    const content = await extractTextFromFile(file);
    
    // Analyze with Gemini
    const analysis = await analyzeWithGemini(content, isImage);
    
    // Store in memory
    documentStore.set(sessionId, {
      filename: file.originalname,
      mimetype: file.mimetype,
      content: isImage ? null : content, // Don't store image buffer
      analysis: analysis,
      uploadedAt: new Date().toISOString()
    });
    
    res.json({
      sessionId,
      filename: file.originalname,
      analysis,
      message: 'Document processed successfully'
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process document',
      details: error.message 
    });
  }
});

// Query specific document
app.post('/api/query/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    const document = documentStore.get(sessionId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Create context-aware prompt
    const contextPrompt = `
      Based on the following document content, please answer this question: "${question}"
      
      Document: ${document.filename}
      Content: ${document.content || 'Image content (previously analyzed)'}
      Previous Analysis: ${document.analysis}
      
      Provide a detailed and accurate answer based on the document content.
    `;
    
    const answer = await analyzeWithGemini(contextPrompt, false);
    
    res.json({
      question,
      answer,
      sessionId,
      filename: document.filename
    });
    
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      details: error.message 
    });
  }
});

// Get document info
app.get('/api/document/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const document = documentStore.get(sessionId);
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.json({
    sessionId,
    filename: document.filename,
    mimetype: document.mimetype,
    uploadedAt: document.uploadedAt,
    hasAnalysis: !!document.analysis
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 InsightCopilot Backend running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
    console.log('⚠️  Warning: Please set your GEMINI_API_KEY in the .env file');
  }
});