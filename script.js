async function getLastActiveTabUrl() {
    let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log("Tabs array returned: ", tabs);
    let [lastActiveTab] = tabs;
    if (lastActiveTab && lastActiveTab.url) {
        return lastActiveTab.url;
    } else {
        throw new Error("No active tab found");
    }
}

function addToWatchLater() {
    getLastActiveTabUrl()
    .then(url => console.log("Last active tab URL:", url))
    .catch(error => console.error(error));

    
}

function main() {
    const addButton = document.getElementById('add');
    addButton.addEventListener('click', addToWatchLater);
}

document.addEventListener('DOMContentLoaded', main());