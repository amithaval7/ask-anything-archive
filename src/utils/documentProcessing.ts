
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type.includes('pdf')) {
    return extractTextFromPdf(file);
  } else if (file.type.includes('word') || file.type.includes('doc')) {
    return extractTextFromWord(file);
  } else {
    // For text files or unknown types, just read as text
    return extractTextFromTxt(file);
  }
}

async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

async function extractTextFromWord(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from Word document:", error);
    throw new Error("Failed to extract text from Word document");
  }
}

async function extractTextFromTxt(file: File): Promise<string> {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error("Error reading text file:", error);
    throw new Error("Failed to read text file");
  }
}

export async function extractTextFromYouTube(videoId: string): Promise<string> {
  // In a real implementation, this would call a YouTube transcript API
  // For demonstration, we'll return a placeholder
  return `This is a transcript placeholder for YouTube video with ID: ${videoId}. 
  In a real application, you would integrate with YouTube's API or a third-party 
  transcript service to get the actual video transcript.`;
}
