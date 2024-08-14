let closedTabs = [];
let windowMap = {}; // To map window IDs to simpler numbers
let windowCount = 0; // To count and assign window numbers

function closeDuplicateTabs() {
  chrome.windows.getAll({ populate: true }, function(windows) {
    let urls = {};
    let tabsToClose = [];

    // Collect all tabs and their URLs
    windows.forEach(window => {
      // Assign a simpler number to each window ID
      if (!windowMap[window.id]) {
        windowCount += 1;
        windowMap[window.id] = `Window ${windowCount}`;
      }

      window.tabs.forEach(tab => {
        let url = tab.url;
        if (urls[url]) {
          // If URL is already in the list, mark this tab for closing
          tabsToClose.push(tab.id);
          closedTabs.push({ 
            url: url, 
            title: tab.title, 
            windowId: windowMap[window.id] 
          });
        } else {
          // Otherwise, keep track of this URL
          urls[url] = tab.id;
        }
      });
    });

    // Close duplicate tabs
    chrome.tabs.remove(tabsToClose, function() {
      // Notify the popup with the closed tabs information
      chrome.runtime.sendMessage({ type: 'updateLog', data: closedTabs });
      closedTabs = []; // Clear log after sending
    });
  });
}

chrome.browserAction.onClicked.addListener(closeDuplicateTabs);
