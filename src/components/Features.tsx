import { FileText, Brain, MessageSquare, BarChart3, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Multi-Format Support",
    description: "Upload PDF, Excel, images, and text files seamlessly"
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Get instant summaries and key insights using advanced AI"
  },
  {
    icon: MessageSquare,
    title: "Interactive Q&A",
    description: "Ask questions and get contextual answers about your documents"
  },
  {
    icon: BarChart3,
    title: "Data Extraction",
    description: "Automatically extract tables and structured data"
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Your documents are processed securely and privately"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in seconds, not minutes"
  }
];

export function Features() {
  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-display mb-3">
          Powerful Document Analysis
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform your documents into actionable insights with our AI-powered features
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative p-6 rounded-xl border border-border/50 bg-card/30 backdrop-blur transition-all duration-300 hover:shadow-lg hover:border-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-radial opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            
            <div className="relative">
              <div className="p-3 rounded-lg bg-gradient-primary text-primary-foreground w-fit mb-4 group-hover:shadow-glow-sm transition-shadow">
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}