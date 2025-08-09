document.addEventListener('DOMContentLoaded', () => {
    console.log("Options page loaded.");
    const apiKeyInput = document.getElementById('apiKey');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // Load the saved key when the page opens
    chrome.storage.local.get(['groqApiKey'], (result) => {
        if (result.groqApiKey) {
            apiKeyInput.value = result.groqApiKey;
            console.log("Existing API key loaded from storage.");
        } else {
            console.log("No API key found in storage.");
        }
    });

    // Save the key when the button is clicked
    saveButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.local.set({ groqApiKey: apiKey }, () => {
                statusDiv.textContent = 'Key saved successfully!';
                statusDiv.style.color = 'green';
                console.log("New API key saved successfully.");
            });
        } else {
            statusDiv.textContent = 'Please enter a valid key.';
            statusDiv.style.color = 'red';
            console.log("Attempted to save an empty key.");
        }
    });
});