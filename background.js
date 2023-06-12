chrome.action.onClicked.addListener(async () => {
    try {
        // Get the current tab id
        let currentTab = await getCurrentTab();
        let currentTabId = currentTab.id;

        // Create a new tab and open chrome://net-internals/#dns
        let dnsTab = await createTab("chrome://net-internals/#dns");

        // Click the button with id dns-view-clear-cache
        await clickButton(dnsTab.id, "dns-view-clear-cache");

        // Close the tab
        await closeTab(dnsTab.id);

        // Create a new tab and open chrome://net-internals/#sockets
        let socketsTab = await createTab("chrome://net-internals/#sockets");

        // Click the button with id sockets-view-flush-button
        await clickButton(socketsTab.id, "sockets-view-flush-button");

        // Close the tab
        await closeTab(socketsTab.id);

        // Switch back to the original tab
        await switchToTab(currentTabId);
        await chrome.tabs.reload(currentTabId);
    } catch (error) {
        console.error(error);
    }
});

// Helper functions

// Get the current active tab
async function getCurrentTab() {
    let tabs = await chrome.tabs.query({ active: true });
    if (tabs.length > 0) {
        return tabs[0];
    } else {
        throw new Error("No active tab found");
    }
}

// Create a new tab with a given url
async function createTab(url) {
    let tab = await chrome.tabs.create({ url: url });
    if (tab) {
        return tab;
    } else {
        throw new Error("Failed to create tab");
    }
}

// Click a button with a given id in a tab
async function clickButton(tabId, buttonId) {
    await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (buttonId) => {
            let button = document.getElementById(buttonId);
            if (button) {
                button.click();
            } else {
                throw new Error("Button not found");
            }
        },
        args: [buttonId],
    });
}

// Close a tab with a given id
async function closeTab(tabId) {
    await chrome.tabs.remove(tabId);
}

// Switch to a tab with a given id
async function switchToTab(tabId) {
    let tab = await chrome.tabs.update(tabId, { active: true });
    if (tab) {
        return tab;
    } else {
        throw new Error("Failed to switch to tab");
    }
}
