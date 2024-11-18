async function getLastActiveTabUrl() {
    let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    //console.log("Tabs array returned: ", tabs);
    let [lastActiveTab] = tabs;
    if (lastActiveTab && lastActiveTab.url) {
        return lastActiveTab.url;
    } else {
        throw new Error("No active tab found");
    }
}

function createVideoObject(url) {
    const playlist = document.querySelector('.playlist');
    const video = document.createElement('div');
    video.className = "video";
    video.setAttribute('url',`${url}`);
    playlist.appendChild(video);
}

function addToWatchLater() {
    getLastActiveTabUrl()
    .catch(error => {
        console.error(error);
        return;
    })
    .then(url => {
        createVideoObject(url);
    })
}


function main() {
    const addButton = document.getElementById('add');
    addButton.addEventListener('click', addToWatchLater);
}

document.addEventListener('DOMContentLoaded', main());