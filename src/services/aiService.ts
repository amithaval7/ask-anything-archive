
import OpenAI from 'openai';

// In a production app, you'd store this in an environment variable or backend
// For this demo, we'll let users provide their own API key
let openaiApiKey = '';

export const setApiKey = (key: string) => {
  openaiApiKey = key;
};

export const getApiKey = () => openaiApiKey;

export const askQuestionAboutDocument = async (
  documentContent: string,
  question: string
): Promise<string> {
  if (!openaiApiKey) {
    return "Please provide an OpenAI API key to use this feature.";
  }

  try {
    const openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using a smaller model for cost efficiency
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that answers questions based on the provided document content. Only use information from the document to answer questions. If the answer is not in the document, say so."
        },
        {
          role: "user",
          content: `Document content: ${documentContent.slice(0, 15000)}... 
          
          Please answer this question about the document: ${question}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error querying OpenAI:", error);
    return "An error occurred when processing your question. Please try again.";
  }
}
