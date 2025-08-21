const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function extractPDF() {
  // List files first to get exact name
  const rawDataDir = path.join(__dirname, '../raw-data');
  const files = fs.readdirSync(rawDataDir);
  console.log('Files in raw-data:', files);
  
  // Find the exam file
  const examFile = files.find(f => f.includes('v12'));
  if (!examFile) {
    console.error('Could not find exam file');
    return;
  }
  
  const pdfPath = path.join(rawDataDir, examFile);
  console.log('Reading PDF from:', pdfPath);
  const dataBuffer = fs.readFileSync(pdfPath);
  
  try {
    const data = await pdf(dataBuffer);
    
    console.log('PDF Info:');
    console.log('Pages:', data.numpages);
    console.log('Text length:', data.text.length);
    console.log('\n=== PDF Content ===\n');
    console.log(data.text);
    
    // Save extracted text to file
    const outputPath = path.join(__dirname, '../src/data/exam-questions.txt');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, data.text);
    console.log('\nText saved to:', outputPath);
    
  } catch (error) {
    console.error('Error extracting PDF:', error);
  }
}

extractPDF();