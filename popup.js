document.getElementById('close-duplicates').addEventListener('click', function() {
  // Show loading message and hide the log initially
  document.getElementById('loading').style.display = 'block';
  document.getElementById('log').innerHTML = '';

  chrome.runtime.getBackgroundPage(function(backgroundPage) {
    backgroundPage.closeDuplicateTabs();
  });
});

chrome.runtime.onMessage.addListener(function(message) {
  if (message.type === 'updateLog') {
    const logContainer = document.getElementById('log');
    const loadingMessage = document.getElementById('loading');

    // Hide loading message and show log
    loadingMessage.style.display = 'none';
    logContainer.innerHTML = ''; // Clear existing log

    // Display the closed tabs log with window information
    message.data.forEach(tab => {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.innerHTML = `Closed: ${tab.title} (${tab.url}) <div class="window-info">Window ID: ${tab.windowId}</div>`;
      logContainer.appendChild(logEntry);
    });
  }
});
