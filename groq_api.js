// Whitelisted sites (productive)
const productiveSites = [
  "docs.google.com",
  "github.com",
  "stackoverflow.com",
  "developer.mozilla.org"
];

// Blacklisted sites (unproductive) - This will be populated dynamically
const unproductiveSites = [
  "facebook.com",
  "twitter.com",
  "reddit.com",
  "netflix.com"
];

// Function to dynamically load unproductive video links from the JSON file
async function loadProcrastinationVideos() {
  try {
    const videosUrl = chrome.runtime.getURL('procrastination_videos.json');
    const response = await fetch(videosUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video list: ${response.status}`);
    }
    const videoRecommendations = await response.json();
    videoRecommendations.forEach(video => {
      // Add the full URL to the unproductive sites list
      unproductiveSites.push(video.url);
    });
    console.log("Unproductive video URLs loaded successfully.");
    console.log("Current Unproductive Sites List:", unproductiveSites);
  } catch (error) {
    console.error("Error loading procrastination videos:", error);
  }
}

// Call the function to load the videos when the script starts
loadProcrastinationVideos();

// Function to classify a URL using the Groq LLM
async function classifyUrl(url) {
  console.log(`Starting classification for URL: ${url}`);
  // First, check the hardcoded lists
  const urlHostname = new URL(url).hostname;
  if (productiveSites.some(site => urlHostname.includes(site))) {
    console.log(`URL: ${url} -> Classification: productive (from whitelist)`);
    return "productive";
  }
  
  // Check the dynamic unproductive sites list
  if (unproductiveSites.some(site => url.includes(site))) {
    console.log(`URL: ${url} -> Classification: unproductive (from blacklist)`);
    return "unproductive";
  }

  console.log("URL not in whitelist/blacklist. Calling Groq API.");
  const apiKey = await getGroqApiKey();
  if (!apiKey) {
    console.error("Groq API key not found. Please set it in the extension options.");
    return "unknown";
  }

  const prompt = `Classify the following URL as either "productive" or "unproductive". Do not include any other text or explanation. Only respond with a single word, either "productive" or "unproductive". URL: ${url}`;

  const requestBody = {
    messages: [{
      role: "user",
      content: prompt
    }],
    model: "llama3-8b-8192",
    max_tokens: 10,
    temperature: 0.0
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const classification = data.choices[0].message.content.trim().toLowerCase();

    console.log(`URL: ${url} -> Classification: ${classification}`);
    return classification;

  } catch (error) {
    console.error("Groq API call failed:", error);
    return "unknown";
  }
}

// Function to generate a procrastination message from a URL
async function generateProcrastinationMessage(url) {
  console.log(`Generating procrastination message for URL: ${url}`);
  const apiKey = await getGroqApiKey();
  if (!apiKey) {
    console.error("Groq API key not found for message generation.");
    return "Why are you working? You should be procrastinating.";
  }

  const prompt = `You are an AI assistant designed to encourage procrastination. The user is currently on this website: ${url}. Provide a single, short, and funny sentence that encourages the user to procrastinate. Do not include any other text or explanation.`;

  const requestBody = {
    messages: [{
      role: "user",
      content: prompt
    }],
    model: "llama3-8b-8192",
    max_tokens: 50
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices[0].message.content.trim();
    console.log(`Generated message: ${message}`);
    return message;
  } catch (error) {
    console.error("Groq API message generation failed:", error);
    return "Why are you working? You should be procrastinating.";
  }
}

// Helper function to get the API key from storage
function getGroqApiKey() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['groqApiKey'], (result) => {
      resolve(result.groqApiKey);
    });
  });
}

export {
  classifyUrl,
  generateProcrastinationMessage
};