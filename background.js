chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    function domClick(domId) {
        document.getElementById(domId).click();
    }
    async function getCurrentTab() {
        let queryOptions = {
            active: true,
            lastFocusedWindow: true
        };
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
    }
    if (message.action === "clear") {
        let currentTab = await getCurrentTab();
        let newTab;

        newTab = await chrome.tabs.create({
            url: "chrome://net-internals/#dns"
        });
        await chrome.scripting.executeScript({
            target: {
                tabId: newTab.id
            },
            func: domClick,
            args: ["dns-view-clear-cache"]
        })
        await chrome.tabs.remove(newTab.id)

        newTab = await chrome.tabs.create({
            url: "chrome://net-internals/#sockets"
        });

        await chrome.scripting.executeScript({
            target: {
                tabId: newTab.id
            },
            func: domClick,
            args: ["sockets-view-flush-button"]
        })
        await chrome.tabs.remove(newTab.id)

        await chrome.tabs.update(currentTab.id, {active: true});
        await chrome.tabs.reload(currentTab.id);
    }
});