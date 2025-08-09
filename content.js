// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showProcrastinationPopup") {
    // Create and display the modal popup
    createProcrastinationModal(request.content);
  }
});

function createProcrastinationModal(content) {
  // Check if a modal already exists to prevent duplicates
  if (document.getElementById('procrastination-modal-overlay')) {
    return;
  }

  // Create the main overlay element
  const overlay = document.createElement('div');
  overlay.id = 'procrastination-modal-overlay';

  // Create the modal content box
  const modal = document.createElement('div');
  modal.id = 'procrastination-modal';

  // Create the content element
  const contentElement = document.createElement('div');
  contentElement.className = 'procrastination-content';

  // Set the content based on the type
  if (content.type === 'message') {
    contentElement.innerHTML = `<h1>${content.content}</h1>`;
  } else {
    // It's a video recommendation
    contentElement.innerHTML = `
      <h1>${content.content.title}</h1>
      <a href="${content.content.url}" target="_blank" rel="noopener noreferrer">Click here to waste some time!</a>
    `;
  }

  // Create a close button
  const closeButton = document.createElement('button');
  closeButton.className = 'procrastination-close';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = () => overlay.remove();

  // Append elements to the modal and then to the overlay
  modal.appendChild(contentElement);
  modal.appendChild(closeButton);
  overlay.appendChild(modal);

  // Load the styles from the CSS file
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.type = 'text/css';
  styleLink.href = chrome.runtime.getURL('style.css');
  document.head.appendChild(styleLink);

  // Add the overlay to the body
  document.body.appendChild(overlay);
}