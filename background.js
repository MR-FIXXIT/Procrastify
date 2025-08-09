// Add these lines at the top of the file
import {
  classifyUrl
} from "./groq_api.js";

// Make sure to define these constants at the top of the file
const MAX_POPUP_COUNT = 3;
let procrastinationPopupCount = 0;

// This will be a new function to get a random procrastination message
const getRandomProcrastinationContent = () => {
  const messages = [{
    type: 'message',
    content: "Don't you have something better to do? Like... anything?"
  }, {
    type: 'message',
    content: "A quick break never hurt anyone. Just a quick one."
  }, {
    type: 'message',
    content: "Look, I'm just here to help you achieve your true procrastination potential."
  }, ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// This function starts the timer again
const startProcrastinationTimer = () => {
  clearTimeout(procrastinationTimer);
  procrastinationTimer = setTimeout(checkActiveTabAndAct, 30000); // 30-second timer
  console.log("Timer restarted. Next check in 30 seconds.");
};

let procrastinationTimer;
startProcrastinationTimer();

async function checkActiveTabAndAct() {
  console.log("-----------------------------------------");
  console.log("Ultimate Procrastinator is checking the active tab...");
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
    console.log("Invalid tab or URL, restarting timer.");
    startProcrastinationTimer();
    return;
  }
  console.log("Active tab URL:", tab.url);

  // Add the API key check here
  const {
    groqApiKey
  } = await chrome.storage.local.get('groqApiKey');
  if (!groqApiKey) {
    console.log("Groq API key not set. Skipping URL classification.");
    startProcrastinationTimer();
    return;
  }
  console.log("Groq API key found. Proceeding with classification.");

  // Use the Groq API to classify the current site
  const classification = await classifyUrl(tab.url);
  console.log("Classification result:", classification);

  if (classification === 'productive') {
    console.log("Site is productive. Considering a distraction.");
    // If we've reached the pop-up limit
    if (procrastinationPopupCount < MAX_POPUP_COUNT) {
      // Show a modal pop-up message
      procrastinationPopupCount++;
      console.log(`Pop-up count is ${procrastinationPopupCount}. Showing a pop-up.`);
      const content = getRandomProcrastinationContent();

      // Fix for script injection timing: use a callback
      chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        files: ['content.js']
      }, () => {
        // Now that the script is injected, send the message
        console.log("Content script injected. Sending message to show popup.");
        chrome.tabs.sendMessage(tab.id, {
          action: "showProcrastinationPopup",
          content: content
        });
        startProcrastinationTimer();
      });
    } else {
      console.log("Pop-up limit reached. Opening a new tab with a video.");
      // Open a new YouTube video tab
      const videosUrl = chrome.runtime.getURL('procrastination_videos.json');
      const response = await fetch(videosUrl);
      const videoRecommendations = await response.json();

      const randomVideo = videoRecommendations[Math.floor(Math.random() * videoRecommendations.length)];

      // Directly open the YouTube video URL in a new tab
      chrome.tabs.create({
        url: randomVideo.url
      });

      procrastinationPopupCount = 0;
      startProcrastinationTimer();
    }
  } else {
    // If the site is unproductive, do nothing and restart the timer
    console.log("Site is unproductive. Procrastination deferred.");
    startProcrastinationTimer();
  }
  console.log("-----------------------------------------");
}