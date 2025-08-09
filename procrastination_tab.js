document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showProcrastinationTabContent") {
      const content = request.content;
      const container = document.getElementById('tab-content-container');

      if (content.type === 'message') {
        container.innerHTML = `<h1>${content.content}</h1>`;
      } else {
        container.innerHTML = `
          <h1>${content.content.title}</h1>
          <a href="${content.content.url}" target="_blank" rel="noopener noreferrer">Click here to waste some time!</a>
        `;
      }
    }
  });
});