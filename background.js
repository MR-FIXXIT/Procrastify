// How often to distract (in minutes)
const INTERVAL_MINUTES = 0.10; // change to whatever you want

// Load distractions list
async function getRandomDistraction() {
    const response = await fetch(chrome.runtime.getURL("distractions.json"));
    const links = await response.json();
    return links[Math.floor(Math.random() * links.length)];
}

// Open a random distraction tab
async function openDistraction() {
    const link = await getRandomDistraction();
    chrome.tabs.create({ url: link });
    console.log("Opened distraction:", link);
}

// Schedule repeating alarm
chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create("procrastifyAlarm", { periodInMinutes: INTERVAL_MINUTES });
});

// Listen for alarm and trigger distraction
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "procrastifyAlarm") {
        openDistraction();
    }
});
