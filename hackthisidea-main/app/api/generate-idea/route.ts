import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client with Nebius configuration
const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { category, complexity, customPrompt, techStack } = await request.json();

    // Build the prompt for the AI
    let prompt = "Generate a creative and detailed hackathon project idea";
    
    if (category && category !== "all") {
      prompt += ` in the category of ${category}`;
    }
    
    if (complexity) {
      const complexityLevel = complexity <= 30 ? "simple" : 
                             complexity <= 70 ? "moderate" : "complex";
      prompt += ` with ${complexityLevel} complexity`;
    }
    
    if (techStack) {
      prompt += ` using the following technologies: ${techStack}`;
    }
    
    if (customPrompt) {
      prompt += `. Additional requirements: ${customPrompt}`;
    }
    
    prompt += `. Format the response as JSON with the following fields:
      - title (string): A catchy name for the project
      - description (text): A detailed explanation of the project (at least 150 words)
      - category (string): The category of the project
      - tags (array of strings): Relevant tags for the project
      - techStack (array of strings): Specific technologies to use for implementation
      - implementation (object): With fields for 'frontend', 'backend', 'database', 'deployment' (each containing specific recommendations)
      - features (array of strings): Key features to implement
      - challenges (array of strings): Technical challenges and learning opportunities
      - timeline (string): Suggested implementation timeline for a hackathon
      
      Make the idea specific, practical, innovative, and technically detailed. For the implementation, suggest specific libraries, frameworks, and tools.`;

    // Call the Nebius API
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3-0324",
      max_tokens: 1024, // Increased token limit for more detailed responses
      temperature: 0.7,
      top_p: 0.95,
      messages: [
        {
          role: "system",
          content: "You are a specialized AI assistant for hackathon participants. You generate highly detailed, technically feasible, and innovative project ideas tailored to the user's requirements. Your suggestions include specific technologies, implementation strategies, and practical guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Extract the AI's response
    const content = response.choices[0]?.message?.content || "";
    
    // Try to parse the JSON response
    try {
      // The AI might return markdown-formatted JSON, so we need to extract just the JSON part
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '') : content;
      
      const ideaData = JSON.parse(jsonStr);
      
      // Add additional fields
      ideaData.id = Date.now().toString();
      ideaData.createdAt = new Date();
      ideaData.isSaved = false;
      ideaData.rating = 0;
      
      return NextResponse.json(ideaData);
    } catch (error) {
      // If parsing fails, return a formatted error response
      console.error("Failed to parse AI response:", error);
      console.error("Raw content:", content);
      return NextResponse.json(
        { error: "Failed to generate idea in the correct format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating idea:", error);
    return NextResponse.json(
      { error: "Failed to generate idea" },
      { status: 500 }
    );
  }
} 