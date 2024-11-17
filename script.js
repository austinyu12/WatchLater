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

function addToWatchLater() {
    getLastActiveTabUrl()
    .catch(error => {
        console.error(error);
        return;
    })
    .then(url => {
        //add to playlist, lets just have 1 playlist for the time being
        const playlist = document.querySelector('.playlist');
        const newDiv = document.createElement('div');
        newDiv.textContent = `${url}`;
        playlist.appendChild(newDiv);

        //
    })
}


function main() {
    const addButton = document.getElementById('add');
    addButton.addEventListener('click', addToWatchLater);
}

document.addEventListener('DOMContentLoaded', main());