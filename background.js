let closedTabs = [];
let windowMap = {};
let windowCount = 0;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'closeDuplicateTabs') {
    closeDuplicateTabs();
  }
});

function closeDuplicateTabs() {
  chrome.windows.getAll({ populate: true }, function(windows) {
    let urls = {};
    let tabsToClose = [];

    windows.forEach(window => {
      if (!windowMap[window.id]) {
        windowCount += 1;
        windowMap[window.id] = `Window ${windowCount}`;
      }

      window.tabs.forEach(tab => {
        let url = tab.url;
        if (urls[url]) {
          tabsToClose.push(tab.id);
          closedTabs.push({ 
            url: url, 
            title: tab.title, 
            windowId: windowMap[window.id] 
          });
        } else {
          urls[url] = tab.id;
        }
      });
    });

    chrome.tabs.remove(tabsToClose, function() {
      // Send the log data back to the popup
      chrome.runtime.sendMessage({ type: 'updateLog', data: closedTabs });
      closedTabs = [];
    });
  });
}
