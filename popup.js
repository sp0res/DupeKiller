document.getElementById('close-duplicates').addEventListener('click', function() {
  document.getElementById('loading').style.display = 'block';
  document.getElementById('log').innerHTML = '';

  chrome.runtime.sendMessage({ type: 'closeDuplicateTabs' });
});

// Load and display stored log data when the popup is opened
chrome.storage.local.get(['closedTabsLog', 'theme'], function(result) {
  const logContainer = document.getElementById('log');
  const loadingMessage = document.getElementById('loading');

  // Apply the saved theme
  if (result.theme) {
      document.body.classList.toggle('dark-theme', result.theme === 'dark');
  }

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

// Theme toggle button logic
document.getElementById('theme-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark-theme');
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  // Save the theme preference
  chrome.storage.local.set({ theme: isDarkTheme ? 'dark' : 'light' });
});

// Info button logic
document.getElementById('info-btn').addEventListener('click', function() {
  alert("This extension closes duplicate tabs across all open windows in Opera GX. Use the 'Close Duplicate Tabs' button to remove duplicates. The theme toggle switches between light and dark mode.");
});
