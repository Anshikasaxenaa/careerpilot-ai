const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Extract text from PDF buffer or file path
const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Clean extracted text
const cleanText = (text) => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim();
};

module.exports = { extractTextFromPDF, cleanText };