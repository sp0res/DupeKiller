document.getElementById('close-duplicates').addEventListener('click', function() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('log').innerHTML = '';

  chrome.runtime.sendMessage({ type: 'closeDuplicateTabs' });
});

// Load and display stored log data when the popup is opened
chrome.storage.local.get(['closedTabsLog'], function(result) {
  const logContainer = document.getElementById('log');
  const loadingMessage = document.getElementById('loading');

  // If there's stored log data, display it
  if (result.closedTabsLog && result.closedTabsLog.length > 0) {
    loadingMessage.style.display = 'none';

    result.closedTabsLog.forEach(tab => {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.innerHTML = `Closed: ${tab.title} (${tab.url}) <div class="window-info">${tab.windowId}</div>`;
      logContainer.appendChild(logEntry);
    });
  }
});

chrome.runtime.onMessage.addListener(function(message) {
  if (message.type === 'updateLog') {
    const logContainer = document.getElementById('log');
    const loadingMessage = document.getElementById('loading');

    loadingMessage.style.display = 'none';
    logContainer.innerHTML = '';

    message.data.forEach(tab => {
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      logEntry.innerHTML = `Closed: ${tab.title} (${tab.url}) <div class="window-info">${tab.windowId}</div>`;
      logContainer.appendChild(logEntry);
    });
  }
});
