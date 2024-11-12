// function getLastActiveTabUrl() {
//     return new Promise((resolve, reject) => {
//         chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
//             if (tabs.length > 0) {
//                 resolve(tabs[0].url); // Resolve with the URL
//             } else {
//                 reject("No active tab found.");
//             }
//         });
//     });
// }

async function getLastActiveTabUrl() {
    // Use `chrome.tabs.query` to get the active tab in the current window
    let tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log("Tabs array returned: ", tabs);
    let [lastActiveTab] = tabs;
    // If there is a result, return the URL
    if (lastActiveTab && lastActiveTab.url) {
        return lastActiveTab.url;
    } else {
        throw new Error("No active tab found");
    }
}

function addToWatchLater() {
    console.log("button was clicked");

    // (async function() {
    //     try {
    //         const url = await getLastActiveTabUrl();
    //         console.log("Last active tab URL:", url);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // })();

    getLastActiveTabUrl()
    .then(url => console.log("Last active tab URL:", url))
    .catch(error => console.error(error));
}

function main() {
    const addButton = document.getElementById('add');
    addButton.addEventListener('click', addToWatchLater);
}

document.addEventListener('DOMContentLoaded', main());