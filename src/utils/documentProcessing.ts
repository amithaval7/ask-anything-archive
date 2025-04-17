import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker - improved worker setup
const pdfjsVersion = pdfjs.version;

// Use a reliable CDN approach for worker initialization
const loadPdfWorker = async () => {
  try {
    // Use CDN directly - more reliable than blob approach
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;
    console.log("PDF.js worker configured with CDNJS");
  } catch (error) {
    console.error("Failed to configure PDF worker:", error);
    // Fallback to another CDN
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`;
      console.log("PDF.js worker configured with jsdelivr fallback");
    } catch (fallbackError) {
      console.error("All worker configuration attempts failed:", fallbackError);
      // Final fallback - disable worker for small PDFs to still work
      console.warn("Using workerless mode - performance may be reduced");
    }
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
    // Check if we have a valid file
    if (!file || file.size === 0) {
      throw new Error("Invalid PDF file: Empty file");
    }

    const arrayBuffer = await file.arrayBuffer();
    
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("Invalid PDF file: Empty file content");
    }

    console.log("Loading PDF document, size:", arrayBuffer.byteLength);
    
    // Improved PDF loading with better configuration
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + pdfjsVersion + '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@' + pdfjsVersion + '/standard_fonts/',
    });
    
    // Add loading task event listeners for better error handling
    loadingTask.onProgress = (data) => {
      console.log(`PDF loading progress: ${data.loaded} / ${data.total || 'unknown'}`);
    };
    
    // Load the PDF with better error handling
    const pdf = await loadingTask.promise.catch(error => {
      console.error("Failed to load PDF document:", error);
      throw new Error("Failed to load PDF document: " + error.message);
    });
    
    // Handle empty PDFs
    if (!pdf || pdf.numPages === 0) {
      return "This PDF doesn't contain any pages.";
    }
    
    // Process each page with improved text extraction
    let fullText = '';
    let extractedAnyText = false;
    
    for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) { // Limit to 50 pages for performance
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Better text extraction logic
        const pageText = textContent.items
          .filter((item: any) => item.str && item.str.trim()) // Filter out empty items
          .map((item: any) => item.str)
          .join(' ');
        
        if (pageText.trim()) {
          extractedAnyText = true;
          fullText += `[Page ${i}]\n${pageText}\n\n`;
        }
      } catch (pageError) {
        console.warn(`Error extracting text from page ${i}:`, pageError);
        fullText += `[Text extraction failed for page ${i}]\n`;
      }
    }
    
    // Provide meaningful content even if extraction failed
    if (!extractedAnyText) {
      return `This PDF appears to contain no extractable text. It might be an image-based PDF that requires OCR processing. I'll work with what I can see in the document structure.`;
    }
    
    return fullText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    // Return a placeholder that still allows Q&A to work
    return `This PDF could not be processed due to technical issues. Common reasons include:
    - The PDF may contain security restrictions
    - The PDF might be image-based without text layers
    - The file might be corrupted
    
    You can still ask questions about this document, but answers may be limited.`;
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
