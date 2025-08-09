// A list of work-based site domains to check against
const workSites = [
  "docs.google.com",
  "meet.google.com",
  "drive.google.com",
  "trello.com",
  "asana.com",
  "slack.com",
  "notion.so",
  "jira.com",
  "figma.com",
  "miro.com"
];

// List of fun, useless procrastination messages
const procrastinationMessages = [
  "Your spirit animal is a sloth. It's time to honor it.",
  "The universe is telling you to reconsider your life choices and get a snack.",
  "You've been working hard. Take a 15-minute break. Or an hour. Nobody's watching.",
  "Did you know that you can't hum while holding your nose? Try it.",
  "A little procrastination is a good thing. It's called 'strategic resting'."
];

// List of useless video recommendations with titles and URLs
const videoRecommendations = [
  {
    title: "Watch 10 Hours of Fireplace for Cats",
    url: "https://www.youtube.com/watch?v=DX-Y2K604q8"
  },
  {
    title: "The Best Sandwich of 2025",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    title: "Funny Cat Moments of 2025",
    url: "https://www.youtube.com/watch?v=hS_l6Q15B-c"
  },
  {
    title: "A 4-hour video of paint drying",
    url: "https://www.youtube.com/watch?v=1F_E31T5d6w"
  }
];

// The main function to set a new timer
function startProcrastinationTimer() {
  // Random timer between 1 and 10 seconds (in milliseconds) for testing
  const randomSeconds = Math.floor(Math.random() * 10) + 1;
  const delay = randomSeconds * 1000;

  setTimeout(() => {
    checkActiveTabAndAct();
  }, delay);
}

// Function to get a random procrastination content
function getRandomProcrastinationContent() {
  if (Math.random() > 0.5) {
    return {
      type: 'message',
      content: procrastinationMessages[Math.floor(Math.random() * procrastinationMessages.length)]
    };
  } else {
    return {
      type: 'video',
      content: videoRecommendations[Math.floor(Math.random() * videoRecommendations.length)]
    };
  }
}

// Function to check the active tab and decide what to do
async function checkActiveTabAndAct() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
    startProcrastinationTimer();
    return;
  }

  const isWorkSite = workSites.some(site => tab.url.includes(site));
  const content = getRandomProcrastinationContent();

  if (isWorkSite) {
    // --- UPDATED LOGIC HERE ---
    // Open a new tab with our dedicated HTML file
    const newTab = await chrome.tabs.create({ url: chrome.runtime.getURL('procrastination_tab.html') });

    // Wait for a moment to ensure the page is loaded before sending the message
    setTimeout(() => {
      chrome.tabs.sendMessage(newTab.id, {
        action: "showProcrastinationTabContent",
        content: content
      });
    }, 500);

    startProcrastinationTimer();

  } else {
    // Scenario B: User is on a normal site. Inject a modal popup.
    chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tab.id, {
        action: "showProcrastinationPopup",
        content: content
      });
      startProcrastinationTimer();
    });
  }
}

// Start the timer engine when the extension is installed or updated
startProcrastinationTimer();