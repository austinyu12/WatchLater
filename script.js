/*
Gets data from Youtube video.
*/
async function getVideoInfo() {
    // Gets last active tab's url
    let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    let [lastActiveTab] = tabs;
    let url;
    if (lastActiveTab && lastActiveTab.url) {
        url = lastActiveTab.url;
    } else {
        throw new Error("No active tab found");
    }

    // Gets video title
    let title = await new Promise ((resolve, reject) => {
        chrome.tabs.sendMessage(lastActiveTab.id, { action: 'getTitle' }, (response) => {
            if (response && response.title) {
                resolve(response.title);
            } else {
                reject('No title found');
            }
        });
    });

    // Gets time
    const time = Date.now();

    return {
        url: url,
        title: title,
        timestamp: time
    }
}

/*
Removes video by timestamp since it's unique.
*/
function removeVideo(videoDiv, time) {
    const parent = videoDiv.parentElement;
    const child = parent.querySelector(`[data-timestamp="${time}"]`)
    parent.removeChild(child);
}

/*
Input is the video div itself. Will fill out the contents of the video div.
*/
function populateVideoObject(videoDiv) {
    const url = videoDiv.getAttribute('href');

    const visibleTitle = document.createElement('a');
    visibleTitle.innerText = videoDiv.title;
    visibleTitle.setAttribute('href', url);
    visibleTitle.setAttribute('target', '_blank');
    videoDiv.appendChild(visibleTitle);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'removeVideo');
    deleteButton.setAttribute('type', 'button');
    deleteButton.addEventListener('click', () => removeVideo(videoDiv, videoDiv.getAttribute('data-timestamp')));
    videoDiv.appendChild(deleteButton);
}

/*
Determines whether the url is a Youtube link.
*/
function isYoutubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v\=).+$/;
    return pattern.test(url);
}

function createVideoObject(url, title, timestamp) {
    const playlist = document.querySelector('.playlist');
    const video = document.createElement('div');
    video.className = "video";
    video.setAttribute('href',`${url}`);
    video.setAttribute('title',`${title}`);
    video.setAttribute('data-timestamp', `${timestamp}`);
    playlist.appendChild(video);
    return video;
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

function clearPlaylist() {
    const playlist = document.querySelector('.playlist');
    playlist.innerHTML = "";
    savePlaylistToLocal();
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
    getVideoInfo()
    .then(info => {
        if (isYoutubeUrl(info.url)) {
            const video = createVideoObject(info.url, info.title, info.timestamp);
            populateVideoObject(video);
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
    const clearAllButton = document.getElementById('clear-all');
    clearAllButton.addEventListener('click', clearPlaylist);
    // load on open
    loadPlaylistFromLocal();
}

document.addEventListener('DOMContentLoaded', main());