import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CatUploaderProps {
  onImageSelect: (base64: string) => void;
  isGenerating: boolean;
}

export const CatUploader = ({ onImageSelect, isGenerating }: CatUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="file"
          id="cat-photo"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isGenerating}
        />
        <label htmlFor="cat-photo">
          <div className="border-4 border-dashed border-comic-border rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-primary hover:bg-secondary/50 bg-card shadow-comic hover:shadow-comic-hover">
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Cat preview"
                  className="w-full h-64 object-cover rounded-xl border-4 border-comic-border"
                />
                <p className="text-sm text-muted-foreground font-body">
                  Click to change photo
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center shadow-comic">
                  <Upload className="w-12 h-12 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-comic text-foreground">
                    Upload Your Cat's Photo!
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Click here or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    JPG, PNG or WEBP (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
      
      {preview && (
        <Button
          onClick={() => {/* Will be handled by parent */}}
          disabled={isGenerating}
          className="w-full mt-6 h-14 text-lg font-comic shadow-comic hover:shadow-comic-hover transition-all"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Story...
            </>
          ) : (
            "Generate Cat Story! 🐱"
          )}
        </Button>
      )}
    </div>
  );
};