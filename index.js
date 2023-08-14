const axios = require('axios');
const pdfjsLib = require('pdfjs-dist');

async function extractSubjectIDs(pdfUrl) {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const subjectIDs = {};

  // Iterate through each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Extract subject IDs using a regular expression
    const subjectIdRegex = /\b[A-Z]{4}\b/g;
    const pageText = textContent.items.map(item => item.str).join(' ');
    const matches = pageText.match(subjectIdRegex);

    if (matches) {
        matches.forEach(match => {
            subjectIDs[match.toUpperCase()] = true;

        }) 
    }
  }

  return Object.keys(subjectIDs);
}

// URL of the PDF file to parse
const pdfUrl = 'https://registrar.unc.edu/wp-content/uploads/sites/9/2023/08/2239-Fall-SSB-8-7-23.pdf';

// Run the script and log the extracted subject IDs
extractSubjectIDs(pdfUrl)
  .then((subjectIDs) => {
    console.log('Extracted Subject IDs:');
    console.log(subjectIDs);
  })
  .catch((error) => {
    console.error('Error extracting subject IDs:', error);
  });

  // Fetch the webpage content

