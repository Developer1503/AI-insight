// Mock API functions to simulate backend processing
// In production, these would connect to your actual backend

export async function processDocument(file: File): Promise<{
  summary: string;
  keyInsights: string[];
  extractedData?: any[];
  metadata: {
    pages?: number;
    wordCount?: number;
    fileType: string;
  };
}> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock response based on file type
  const fileType = file.type;
  
  const mockResponse = {
    summary: `This is a comprehensive document that covers various important topics related to ${file.name.split('.')[0]}. The document provides detailed analysis and insights into key areas, with supporting data and evidence throughout. Main themes include strategic planning, implementation guidelines, and performance metrics.`,
    
    keyInsights: [
      "The document emphasizes the importance of data-driven decision making",
      "Key performance indicators show a 25% improvement over the baseline",
      "Strategic recommendations align with industry best practices",
      "Implementation timeline suggests a phased approach over 6 months",
      "Risk mitigation strategies are well-defined and comprehensive"
    ],
    
    extractedData: fileType.includes('spreadsheet') ? [
      { Quarter: "Q1 2024", Revenue: "$1.2M", Growth: "15%", Target: "$1.1M" },
      { Quarter: "Q2 2024", Revenue: "$1.5M", Growth: "25%", Target: "$1.3M" },
      { Quarter: "Q3 2024", Revenue: "$1.8M", Growth: "20%", Target: "$1.6M" },
      { Quarter: "Q4 2024", Revenue: "$2.1M", Growth: "17%", Target: "$2.0M" },
    ] : undefined,
    
    metadata: {
      pages: Math.floor(Math.random() * 50) + 5,
      wordCount: Math.floor(Math.random() * 10000) + 1000,
      fileType: file.type
    }
  };

  return mockResponse;
}

export async function askQuestion(question: string, documentContext: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock responses based on common questions
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('summary') || lowerQuestion.includes('summarize')) {
    return "The document presents a comprehensive analysis of the subject matter, highlighting three main areas: 1) Current state assessment showing positive trends, 2) Strategic recommendations for improvement including process optimization and resource allocation, and 3) Implementation roadmap with clear milestones and success metrics. The overall tone is optimistic while acknowledging potential challenges.";
  }
  
  if (lowerQuestion.includes('key point') || lowerQuestion.includes('main')) {
    return "The key points from the document are:\n\n1. **Strategic Vision**: Clear alignment with organizational goals\n2. **Data Analysis**: Strong evidence supporting proposed changes\n3. **Implementation Plan**: Detailed timeline with measurable outcomes\n4. **Risk Management**: Comprehensive mitigation strategies\n5. **Expected ROI**: Projected 35% improvement in efficiency";
  }
  
  if (lowerQuestion.includes('recommendation')) {
    return "Based on the document analysis, I recommend:\n\n• Prioritize the implementation of Phase 1 initiatives\n• Allocate additional resources to high-impact areas\n• Establish weekly progress reviews\n• Create cross-functional teams for better collaboration\n• Set up KPI dashboards for real-time monitoring";
  }
  
  // Generic response for other questions
  return `Based on the document content, here's my analysis of "${question}":\n\nThe document provides relevant information suggesting that this topic is addressed through a systematic approach. Key considerations include stakeholder alignment, resource optimization, and continuous improvement mechanisms. The evidence presented supports a positive outlook while maintaining realistic expectations about implementation challenges.\n\nWould you like me to elaborate on any specific aspect?`;
}