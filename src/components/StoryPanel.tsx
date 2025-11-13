interface StoryPanelProps {
  title: string;
  panels: Array<{ text: string }>;
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
            className="bg-comic-panel border-4 border-comic-border rounded-2xl p-6 shadow-comic hover:shadow-comic-hover transition-all transform hover:-translate-y-1 bg-gradient-card"
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center shadow-comic mx-auto">
                <span className="text-2xl font-comic text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <p className="text-center font-body text-lg text-foreground leading-relaxed min-h-[100px] flex items-center justify-center">
                {panel.text}
              </p>
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