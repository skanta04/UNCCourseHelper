const axios = require('axios');
const cheerio = require('cheerio');

// URL of the webpage to scrape
const url = 'https://catalog.unc.edu/courses/anth/';

// Function to extract course information from the webpage
async function extractCourseInfo() {
  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into cheerio for parsing
    const $ = cheerio.load(html);

    // Find course blocks (each block has class "courseblock")
    const courseBlocks = $('.courseblock');

    // Initialize an array to store course information
    const courseInfo = [];

    // Loop through each course block and extract course information
    courseBlocks.each((courseIndex, courseElement) => {
      // Find the course number
      const courseNumber = $(courseElement).find('.text.detail-code.margin--tiny.text--semibold.text--big strong').text().match(/ANTH (\d+)/)?.[1];
      
      // Find the prerequisites element
      const prerequisitesElement = $(courseElement).find('.text.detail-requisites.margin--default');
      
      // Extract the prerequisites text from the prerequisites element
      const prerequisitesLinks = prerequisitesElement.find('a.bubblelink');
      const prerequisitesLabels = prerequisitesLinks.map((index, linkElement) => {
        return $(linkElement).text().trim();
      }).get();

      // Store the course information
      courseInfo.push({
        courseNumber,
        prerequisites: prerequisitesLabels
      });
    });

    return courseInfo;
  } catch (error) {
    console.error('Error extracting course info:', error);
    throw error;
  }
}

// Run the extraction function and log the results
extractCourseInfo()
  .then(courseInfo => {
    console.log('Extracted Course Information:');
    console.log(courseInfo);
  })
  .catch(error => {
    console.error('Error:', error);
  });