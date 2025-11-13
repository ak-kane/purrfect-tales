interface StoryPanelProps {
  title: string;
  panels: Array<{ text: string; image?: string }>;
}

export const StoryPanel = ({ title, panels }: StoryPanelProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-comic text-primary mb-2 drop-shadow-lg">
          {title}
        </h2>
        <div className="h-1 w-32 bg-gradient-hero mx-auto rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {panels.map((panel, index) => (
          <div
            key={index}
            className="bg-comic-panel border-4 border-comic-border rounded-2xl overflow-hidden shadow-comic hover:shadow-comic-hover transition-all transform hover:-translate-y-1"
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            <div className="space-y-0">
              <div className="relative aspect-square">
                {panel.image ? (
                  <img 
                    src={panel.image} 
                    alt={`Panel ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-card flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center shadow-comic">
                      <span className="text-3xl font-comic text-primary-foreground">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-comic border-2 border-comic-border">
                  <span className="text-xl font-comic text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gradient-card">
                <p className="text-center font-body text-base text-foreground leading-relaxed">
                  {panel.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-3 pt-4">
        {panels.map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full bg-primary shadow-comic"
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};