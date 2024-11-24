function getTitle() {
    return document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata').textContent;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("this runs");
    if (message.action === 'getTitle') {
        const title = getTitle();
        sendResponse({ title: title });
    }
    return true;
});