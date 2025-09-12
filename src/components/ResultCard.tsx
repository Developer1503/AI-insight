import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function ResultCard({ 
  title, 
  icon, 
  children, 
  defaultExpanded = true 
}: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 bg-card/50 backdrop-blur">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className={cn(
          "transition-transform duration-300",
          isExpanded && "rotate-180"
        )}>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      
      <div className={cn(
        "transition-all duration-300 overflow-hidden",
        isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </Card>
  );
}