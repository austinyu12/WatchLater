function getTitle() {
    let title = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata');
    console.log(title.textContent);
    return title.textContent;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("this runs");
    if (message.action === 'getTitle') {
        const title = getTitle();
        sendResponse({ title: title });
    }
    return true;
});