// Whitelisted sites (productive)
const productiveSites = [
  "docs.google.com",
  "github.com",
  "stackoverflow.com",
  "developer.mozilla.org"
];

// Blacklisted sites (unproductive)
const unproductiveSites = [
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "reddit.com",
  "netflix.com"
];

// Function to classify a URL using the Groq LLM
async function classifyUrl(url) {
  console.log(`Starting classification for URL: ${url}`);
  // First, check the hardcoded lists
  const urlHostname = new URL(url).hostname;
  if (productiveSites.some(site => urlHostname.includes(site))) {
    console.log(`URL: ${url} -> Classification: productive (from whitelist)`);
    return "productive";
  }
  if (unproductiveSites.some(site => urlHostname.includes(site))) {
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
    model: "llama3-8b-8192", // You can change this to a different model if you prefer
    max_tokens: 10
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
    return "unknown"; // Default to "unknown" on error
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
  classifyUrl
};