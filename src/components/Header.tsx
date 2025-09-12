import { Brain, Github, FileSearch } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground shadow-glow-sm">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display bg-gradient-primary bg-clip-text text-transparent">
              InsightCopilot
            </h1>
            <p className="text-xs text-muted-foreground">AI Document Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}