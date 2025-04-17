
// Local processing service for document Q&A
// No external API key required

let openaiApiKey = ''; // Keeping this for backward compatibility

export const setApiKey = (key: string) => {
  openaiApiKey = key;
};

export const getApiKey = () => openaiApiKey;

/**
 * Simple document question answering using local text processing
 */
export const askQuestionAboutDocument = async (
  documentContent: string,
  question: string
): Promise<string> => {
  // Add a small delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Validate inputs
    if (!documentContent || !question) {
      console.error("Missing document content or question");
      return "I need both a document and a question to provide an answer.";
    }

    // Convert question and content to lowercase for case-insensitive matching
    const lowercaseQuestion = question.toLowerCase();
    const lowercaseContent = documentContent.toLowerCase();
    
    // Get relevant keywords from the question (basic NLP)
    const questionWords = lowercaseQuestion
      .replace(/[.,?!;:(){}[\]"']/g, '')
      .split(/\s+/)
      .filter(word => 
        !['what', 'who', 'where', 'when', 'why', 'how', 'is', 'are', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for'].includes(word)
      );
    
    // If no meaningful keywords were found, provide a generic response
    if (questionWords.length === 0) {
      return "I need more specific keywords in your question to search the document effectively.";
    }
    
    // Find paragraphs that contain question keywords
    const paragraphs = documentContent.split(/\n\s*\n/); // Split by paragraph breaks
    
    // Score paragraphs based on keyword matches
    const scoredParagraphs = paragraphs.map(paragraph => {
      const lowercaseParagraph = paragraph.toLowerCase();
      let score = 0;
      
      // Count keyword matches
      questionWords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowercaseParagraph.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      
      return { paragraph, score };
    });
    
    // Sort paragraphs by relevance score (highest to lowest)
    scoredParagraphs.sort((a, b) => b.score - a.score);
    
    // Take the top 3 most relevant paragraphs
    const relevantParagraphs = scoredParagraphs
      .filter(item => item.score > 0)
      .slice(0, 3)
      .map(item => item.paragraph);
    
    if (relevantParagraphs.length === 0) {
      // If no direct matches, use a fallback response with document summary
      return `Based on the document content, I don't find a direct answer to your question. 
      Here's a brief summary of what the document contains:
      
      ${documentContent.slice(0, 200)}... (content truncated)
      
      Try asking a question more directly related to the document content.`;
    }
    
    // Format the answer
    let answer = `Based on the document content, I found the following relevant information:\n\n`;
    
    // Add each relevant paragraph as a separate section
    relevantParagraphs.forEach((paragraph, i) => {
      // Trim and clean up the paragraph
      const cleanParagraph = paragraph.trim().replace(/\s+/g, ' ');
      
      // Only include non-empty paragraphs
      if (cleanParagraph.length > 0) {
        answer += `${cleanParagraph}\n\n`;
      }
    });
    
    return answer.trim();
  } catch (error) {
    console.error("Error processing document question:", error);
    return "An error occurred when processing your question. Please try again.";
  }
};
