import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

// Helper function to get the model
const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const aiService = {
  async clarify(text: string): Promise<string> {
    const model = getModel();
    const prompt = `Please improve the clarity of the following text while maintaining its original meaning and style. Make it more readable and easier to understand:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },

  async enrich(text: string): Promise<string> {
    const model = getModel();
    const prompt = `Please enhance the following text by adding more vivid imagery, sensory details, and descriptive language while maintaining the original story and tone:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },

  async polish(text: string): Promise<string> {
    const model = getModel();
    const prompt = `Please polish the following text by fixing any grammar, spelling, or punctuation errors, and improve the overall writing quality while maintaining the original style and meaning:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },

  async generateChapter(prompt: string): Promise<string> {
    const model = getModel();
    const fullPrompt = `Write a chapter of approximately 300 words based on the following prompt. Make it engaging and well-written:\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  },

  async generateAdvancedChapter(
    detailsPrompt: string,
    language: string = "English"
  ): Promise<{ title: string; content: string }> {
    const model = getModel();
    const fullPrompt = `Create a detailed chapter outline and content based on the following details. The chapter should be approximately 500 words and include all the specified elements. Write in ${language}:

${detailsPrompt}

First, suggest a title for this chapter, then provide the chapter content. Format your response exactly like this:

TITLE: [Your suggested title here]

CONTENT:
[The actual chapter content here]

Do not include any outline or other sections in the response.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response to extract title and content
    const titleMatch = text.match(/TITLE:\s*(.+?)(?:\n|$)/);
    const contentMatch = text.match(/CONTENT:\s*([\s\S]*)/);

    return {
      title: titleMatch ? titleMatch[1].trim() : "Untitled Chapter",
      content: contentMatch ? contentMatch[1].trim() : text,
    };
  },
};
