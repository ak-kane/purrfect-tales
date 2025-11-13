import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const storyScenarios = [
  "Your cat is on an epic quest to hunt down the biggest, most dangerous fly in the house - their ultimate nemesis!",
  "Your cat is having an existential crisis about being an indoor cat and daydreaming about the wild outdoor life.",
  "Your cat is experiencing a mid-life career crisis, questioning if they should pursue their dreams of becoming a professional napper.",
  "Your cat has discovered a parallel universe in the laundry basket and must protect it from invaders (the vacuum cleaner).",
  "Your cat is running for mayor of the house and giving a passionate campaign speech to the houseplants.",
  "Your cat has started a detective agency to solve the mystery of the disappearing treats.",
  "Your cat is training for the Olympics in the sport of box-sitting.",
  "Your cat has become a food critic and is reviewing today's meal with brutal honesty.",
  "Your cat is having an intense philosophical debate with their reflection in the mirror.",
  "Your cat has founded a startup called 'Nap Time Inc.' and is pitching to venture capitalists (the dog).",
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Pick a random scenario
    const scenario = storyScenarios[Math.floor(Math.random() * storyScenarios.length)];

    console.log('Generating story with scenario:', scenario);

    // Generate story using Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a creative storyteller who writes funny, engaging 3-panel comic stories about cats. Each story should be humorous and relatable. Format your response as a JSON object with this structure:
{
  "title": "Story title (catchy and funny)",
  "panels": [
    {"text": "Panel 1 text - set up the scene"},
    {"text": "Panel 2 text - build the tension/comedy"},
    {"text": "Panel 3 text - deliver the punchline"}
  ]
}

Keep each panel text under 100 characters. Make it funny and engaging!`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Create a funny 3-panel comic story based on this scenario: ${scenario}\n\nLook at this cat photo and describe what the cat is doing in your story. Make it hilarious and relatable!`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated');
    }

    console.log('Generated content:', content);

    // Parse the JSON response
    let storyData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      storyData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content:', content);
      throw new Error('Failed to parse story data');
    }

    // Generate comic panel images for each scene
    console.log('Generating comic panel images...');
    const panelImages: string[] = [];
    
    for (let i = 0; i < storyData.panels.length; i++) {
      const panel = storyData.panels[i];
      console.log(`Generating image for panel ${i + 1}: ${panel.text}`);
      
      const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image',
          messages: [
            {
              role: 'user',
              content: `Create a comic book style illustration for this scene: "${panel.text}". 
              Style: Vibrant cartoon comic book art, bold outlines, expressive, fun and whimsical. 
              The scene should feature a cat as the main character. Make it look like a professional comic panel.
              Use bright colors and dynamic composition.`
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (!imageResponse.ok) {
        console.error(`Failed to generate image for panel ${i + 1}`);
        throw new Error(`Failed to generate panel image ${i + 1}`);
      }

      const imageData = await imageResponse.json();
      const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (!generatedImage) {
        throw new Error(`No image generated for panel ${i + 1}`);
      }
      
      panelImages.push(generatedImage);
      console.log(`Panel ${i + 1} image generated successfully`);
    }

    return new Response(
      JSON.stringify({ 
        story: {
          ...storyData,
          panels: storyData.panels.map((panel: any, index: number) => ({
            ...panel,
            image: panelImages[index]
          }))
        },
        scenario: scenario 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-cat-story:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});