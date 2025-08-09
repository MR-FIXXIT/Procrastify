document.getElementById("procrastinateBtn").addEventListener("click", async () => {
    const response = await fetch(chrome.runtime.getURL("distractions.json"));
    const links = await response.json();
    const randomLink = links[Math.floor(Math.random() * links.length)];

    chrome.tabs.create({ url: randomLink });
});
