
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
) => {
  // No API key check needed for local processing
  try {
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
      return "I couldn't find information related to your question in the document. Please try rephrasing your question or checking if the document contains this information.";
    }
    
    // Format the answer
    const answer = `Based on the document content, here's what I found:

${relevantParagraphs.map((p, i) => `Relevant excerpt ${i+1}: ${p.trim()}`).join('\n\n')}`;
    
    return answer;
  } catch (error) {
    console.error("Error processing document question:", error);
    return "An error occurred when processing your question. Please try again.";
  }
};
