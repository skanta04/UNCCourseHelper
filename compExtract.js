const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

// URL of the webpage to scrape
const url = 'https://catalog.unc.edu/courses/comp/';

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
      const courseNumber = $(courseElement).find('.text.detail-code.margin--tiny.text--semibold.text--big strong').text().match(/COMP (\d+)/)?.[1];
      
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

// Initialize an empty array to store course information
let courseInfo = [];

// Run the extraction function and populate the courseInfo array
extractCourseInfo()
  .then(data => {
    courseInfo = data;
    console.log('Course information extracted and stored.');
  })
  .catch(error => {
    console.error('Error extracting course information:', error);
  });

const port = 3000;

// Define an API route to get class IDs
app.get('/class-ids', (req, res) => {
  const classIDs = courseInfo.map(course => course.courseNumber);
  res.json(classIDs);
});

// Define an API route to get course information by course number
app.get('/class-info/:courseNumber', (req, res) => {
  const { courseNumber } = req.params;
  const course = courseInfo.find(course => course.courseNumber === courseNumber);
  if (course) {
    res.json(course);
  } else {
    res.status(404).send('Course not found');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
