async function getLastActiveTabUrl() {
    let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    let [lastActiveTab] = tabs;
    if (lastActiveTab && lastActiveTab.url) {
        return lastActiveTab.url;
    } else {
        throw new Error("No active tab found");
    }
}

/*
Determines whether the url is a Youtube link.
*/
function isYoutubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v\=).+$/;
    return pattern.test(url);
}

function createVideoObject(url) {
    const playlist = document.querySelector('.playlist');
    const video = document.createElement('div');
    video.className = "video";
    video.setAttribute('url',`${url}`);
    playlist.appendChild(video);
}

/*
When popup is unloaded, takes the playlist div and saves it to local storage.
For some reason, Chrome Extensions does not diplay in Application Local Storage
when the key:value pair is saved, so if no error messages return, it's a success.
 */
function savePlaylistToLocal() {
    const playlist = document.querySelector('.playlist');
    const playlistContent = playlist.innerHTML;
    console.log(playlistContent);
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ "playlistContent": playlistContent }, function () {
            if (chrome.runtime.lastError) { 
                console.error("Failed to save playlist:", chrome.runtime.lastError.message); 
            } else { 
                console.log("Playlist saved!");
            }
        });
    } else {
        console.error("Chrome storage could not be accessed.");
    }
    
}

function loadPlaylistFromLocal() {
    chrome.storage.local.get("playlistContent", function (result) {
        if (result && result.playlistContent) {
            console.log("Successfully loaded playlist");
            console.log(result.playlistContent);
            const playlistContent = document.querySelector('.playlist');
            playlistContent.innerHTML = result.playlistContent;
        }
        else {
            console.error("result or result.playlistContent not found");
        }
    });
}

function addToWatchLater() {
    getLastActiveTabUrl()
    .then(url => {
        if (isYoutubeUrl(url)) {
            createVideoObject(url);
            savePlaylistToLocal();
        }
        else {
            console.error("invalid url");
        }
    })
    .catch(error => {
        console.error(error);
    })
}

function main() {
    const addButton = document.getElementById('add');
    addButton.addEventListener('click', addToWatchLater);
    // load on open
    loadPlaylistFromLocal();
}

document.addEventListener('DOMContentLoaded', main());