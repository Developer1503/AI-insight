import { useState } from "react";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { ResultCard } from "@/components/ResultCard";
import { ChatInterface } from "@/components/ChatInterface";
import { DataTable } from "@/components/DataTable";
import { Features } from "@/components/Features";
import { processDocument, askQuestion } from "@/utils/mockApi";
import { FileText, Brain, Database, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documentData, setDocumentData] = useState<any>(null);
  const [documentContext, setDocumentContext] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 20, 90));
    }, 400);

    try {
      const result = await processDocument(file);
      setDocumentData(result);
      setDocumentContext(result.summary); // Store context for Q&A
      setProgress(100);
      
      toast({
        title: "Success!",
        description: "Document analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process document",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!documentContext) return "Please upload a document first.";
    return await askQuestion(message, documentContext);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      
      <Header />
      
      <main className="container py-8 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Document Analysis
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any document and get instant insights, summaries, and answers to your questions
          </p>
        </div>

        <FileUpload
          onFileSelect={handleFileSelect}
          isProcessing={isProcessing}
          progress={progress}
        />

        {documentData && (
          <div className="mt-12 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResultCard
                title="Summary"
                icon={<FileText className="h-5 w-5" />}
              >
                <p className="text-muted-foreground leading-relaxed">
                  {documentData.summary}
                </p>
              </ResultCard>

              <ResultCard
                title="Key Insights"
                icon={<Brain className="h-5 w-5" />}
              >
                <ul className="space-y-2">
                  {documentData.keyInsights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            </div>

            {documentData.extractedData && (
              <ResultCard
                title="Extracted Data"
                icon={<Database className="h-5 w-5" />}
                defaultExpanded={false}
              >
                <DataTable data={documentData.extractedData} />
              </ResultCard>
            )}

            <ResultCard
              title="Ask Questions"
              icon={<MessageSquare className="h-5 w-5" />}
            >
              <ChatInterface
                documentContext={documentContext}
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
              />
            </ResultCard>
          </div>
        )}

        {!documentData && <Features />}
      </main>
    </div>
  );
};

export default Index;
