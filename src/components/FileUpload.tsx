import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { 
  FileText, 
  Upload, 
  FileSpreadsheet, 
  Image, 
  File,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  progress: number;
}

const fileTypeIcons = {
  "application/pdf": FileText,
  "application/vnd.ms-excel": FileSpreadsheet,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileSpreadsheet,
  "image/jpeg": Image,
  "image/png": Image,
  "image/gif": Image,
  "text/plain": File,
};

export function FileUpload({ onFileSelect, isProcessing, progress }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: isProcessing
  });

  const clearFile = () => {
    setSelectedFile(null);
  };

  const Icon = selectedFile ? fileTypeIcons[selectedFile.type as keyof typeof fileTypeIcons] || File : Upload;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
          "bg-gradient-to-br from-background via-background to-primary/5",
          "hover:border-primary/50 hover:shadow-glow-sm",
          isDragActive && "border-primary bg-primary/10 shadow-glow",
          isProcessing && "opacity-50 cursor-not-allowed",
          !isProcessing && "cursor-pointer"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="relative p-12 text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-radial opacity-50" />
          
          <div className="relative space-y-4">
            <div className="flex justify-center">
              <div className={cn(
                "p-4 rounded-2xl transition-all duration-300",
                "bg-gradient-primary shadow-glow-sm",
                isDragActive && "scale-110 rotate-12"
              )}>
                <Icon className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>

            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="mt-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                  {isDragActive ? "Drop your file here" : "Upload your document"}
                </h3>
                <p className="text-muted-foreground">
                  Drag & drop or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, Excel, Images, or Text files (Max 10MB)
                </p>
              </>
            )}

            {isProcessing && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span className="text-sm font-medium">Analyzing with AI...</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" /> PDF
        </span>
        <span className="flex items-center gap-1">
          <FileSpreadsheet className="h-3 w-3" /> Excel
        </span>
        <span className="flex items-center gap-1">
          <Image className="h-3 w-3" /> Images
        </span>
        <span className="flex items-center gap-1">
          <File className="h-3 w-3" /> Text
        </span>
      </div>
    </div>
  );
}