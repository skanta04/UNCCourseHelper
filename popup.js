document.getElementById('getPrerequisitesButton').addEventListener('click', async () => {
    const classId = document.getElementById('classIdInput').value;
    const courseNumber = document.getElementById('courseNumberInput').value;
  
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.tabs.sendMessage(tab.id, { classId, courseNumber }, (response) => {
      if (response && response.prerequisites) {
        const prerequisitesDiv = document.getElementById('prerequisites');
        prerequisitesDiv.textContent = `Prerequisites: ${response.prerequisites.join(', ')}`;
      }
    });
  });
  