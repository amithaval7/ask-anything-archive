
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Fix the PDF.js worker initialization
const pdfjsVersion = pdfjs.version;
const pdfWorkerPath = `/pdf.worker.min.js`;

// First try to load local worker, fall back to CDN with version
const loadPdfWorker = async () => {
  try {
    // Try to load the worker locally first
    const workerBlob = new Blob(
      [`importScripts('/pdf.worker.min.js');`],
      { type: 'application/javascript' }
    );
    const workerBlobUrl = URL.createObjectURL(workerBlob);
    pdfjs.GlobalWorkerOptions.workerSrc = workerBlobUrl;
    console.log("Using local PDF worker");
  } catch (error) {
    console.warn("Couldn't load local PDF worker, using CDN fallback", error);
    // Fallback to CDN
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;
  }
};

// Initialize worker
loadPdfWorker();

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
    // Add better error handling for PDF processing
    const arrayBuffer = await file.arrayBuffer();
    
    // Check if we have a valid array buffer
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("Invalid PDF file: Empty file content");
    }

    console.log("Loading PDF document, size:", arrayBuffer.byteLength);
    
    // Load the PDF document with better error handling
    const pdf = await pdfjs.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + pdfjs.version + '/cmaps/',
      cMapPacked: true
    }).promise.catch(error => {
      console.error("Failed to load PDF document:", error);
      throw new Error("Failed to load PDF document: " + error.message);
    });
    
    let fullText = '';
    
    // Extract text from each page with improved error handling
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      } catch (pageError) {
        console.warn(`Error extracting text from page ${i}:`, pageError);
        fullText += `[Text extraction failed for page ${i}]\n`;
      }
    }
    
    // If no text was extracted, provide fallback content
    if (!fullText.trim()) {
      return `This PDF appears to contain no extractable text. It might be an image-based PDF that requires OCR processing.`;
    }
    
    return fullText;
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
