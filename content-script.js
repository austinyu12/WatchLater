chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getTitle') {
        console.log("working");
    }
    return true;
});