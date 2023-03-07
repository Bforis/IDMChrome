// Open popup for Chrome >= version 88
// atm, openPopup() doesnt work : https://bugs.chromium.org/p/chromium/issues/detail?id=1245093
/*
chrome.downloads.onCreated.addListener(function(downloadItem) {
    chrome.action.openPopup();
  });

  chrome.downloads.onCreated.addListener(function(downloadItem) {
    if (downloadItem.state && downloadItem.state.current === "in_progress") {
      chrome.action.openPopup();
    }
  });
*/