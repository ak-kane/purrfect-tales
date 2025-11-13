import { useState } from "react";
import { CatUploader } from "@/components/CatUploader";
import { StoryPanel } from "@/components/StoryPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface Story {
  title: string;
  panels: Array<{ text: string; image?: string }>;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateStory = async () => {
    if (!selectedImage) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-cat-story', {
        body: { imageBase64: selectedImage }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setStory(data.story);
      toast({
        title: "Story Generated! 🎉",
        description: "Your cat's adventure is ready!",
      });
    } catch (error) {
      console.error('Error generating story:', error);
      toast({
        title: "Oops!",
        description: error instanceof Error ? error.message : "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewStory = () => {
    setStory(null);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-block">
            <h1 className="text-5xl md:text-7xl font-comic text-primary drop-shadow-lg inline-flex items-center gap-3">
              <Sparkles className="w-12 h-12 text-accent" />
              Cat Tales
              <Sparkles className="w-12 h-12 text-accent" />
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-body text-muted-foreground max-w-2xl mx-auto">
            Upload your cat's photo and watch their daily adventures come to life in hilarious comic stories!
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-12">
          {!story ? (
            <div className="space-y-8">
              <CatUploader 
                onImageSelect={setSelectedImage} 
                isGenerating={isGenerating}
              />
              {selectedImage && (
                <div className="flex justify-center">
                  <Button
                    onClick={generateStory}
                    disabled={isGenerating}
                    size="lg"
                    className="h-16 px-8 text-xl font-comic shadow-comic hover:shadow-comic-hover transition-all"
                  >
                    {isGenerating ? "Creating Magic... ✨" : "Generate Cat Story! 🐱"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <StoryPanel title={story.title} panels={story.panels} />
              <div className="flex justify-center">
                <Button
                  onClick={handleNewStory}
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-comic border-4 border-comic-border shadow-comic hover:shadow-comic-hover transition-all"
                >
                  Create Another Story! 🎨
                </Button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 text-sm text-muted-foreground font-body">
          <p>Every cat deserves their moment in the spotlight! 🌟</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;