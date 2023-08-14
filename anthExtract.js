const axios = require('axios');
const cheerio = require('cheerio');

// URL of the webpage to scrape
const url = 'https://catalog.unc.edu/courses/anth/';

// Function to extract course numbers from the webpage
async function extractCourseNumbers() {
  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into cheerio for parsing
    const $ = cheerio.load(html);

    // Find course numbers based on the specific structure of the webpage
    const courseNumbers = [];
    $('.text.detail-code.margin--tiny.text--semibold.text--big strong').each((index, element) => {
      const text = $(element).text();
      // Extract the number after the subject ID (assuming the format is "ANTH XXX")
      const matches = text.match(/ANTH (\d+)/);
      if (matches && matches[1]) {
        const courseNumber = matches[1];
        courseNumbers.push(courseNumber);
      }
    });

    return courseNumbers;
  } catch (error) {
    console.error('Error extracting course numbers:', error);
    throw error;
  }
}

// Run the extraction function and log the results
extractCourseNumbers()
  .then(courseNumbers => {
    console.log('Extracted Course Numbers:');
    console.log(courseNumbers);
  })
  .catch(error => {
    console.error('Error:', error);
  });

