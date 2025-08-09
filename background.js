// Add these lines at the top of the file
import {
  classifyUrl,
  generateProcrastinationMessage
} from "./groq_api.js";

// Make sure to define these constants at the top of the file
const MAX_POPUP_COUNT = 3;
let procrastinationPopupCount = 0;

// Function to start the alarm
const startProcrastinationAlarm = () => {
  // Clear any existing alarm to prevent duplicates
  chrome.alarms.clear("procrastinationAlarm");

  // Create a new alarm that triggers every 30 seconds
  chrome.alarms.create("procrastinationAlarm", {
    delayInMinutes: 0.5,
    periodInMinutes: 0.5
  });
  console.log("Alarm started. Next check in 30 seconds.");
};

// Listen for the alarm to trigger
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "procrastinationAlarm") {
    checkActiveTabAndAct();
  }
});

// Start the alarm when the service worker is activated
startProcrastinationAlarm();

async function checkActiveTabAndAct() {
  console.log("-----------------------------------------");
  console.log("Ultimate Procrastinator is checking the active tab...");
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
    console.log("Invalid tab or URL, restarting alarm.");
    return;
  }
  console.log("Active tab URL:", tab.url);

  // Add the API key check here
  const {
    groqApiKey
  } = await chrome.storage.local.get('groqApiKey');
  if (!groqApiKey) {
    console.log("Groq API key not set. Skipping URL classification.");
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
      procrastinationPopupCount++;
      console.log(`Pop-up count is ${procrastinationPopupCount}. Showing a pop-up.`);

      // Use the new function to generate a dynamic message
      const message = await generateProcrastinationMessage(tab.url);
      const content = {
        type: 'message',
        content: message
      };

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
    }
  } else {
    // If the site is unproductive, do nothing
    console.log("Site is unproductive. Procrastination deferred.");
  }
  console.log("-----------------------------------------");
}