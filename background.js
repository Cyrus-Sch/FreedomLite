// Build a blocking rule for every domain the user saved
function makeRules(domains) {
  return domains.map((domain, i) => ({
    id: i + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {          // show our own page
        extensionPath: "/blocked.html"
      }
    },
    condition: {
      urlFilter: `||${domain}^`,   // match domain *and* any sub-domains
      resourceTypes: ["main_frame"]// only full-page navigations
    }
  }));
}

chrome.sidePanel
          .setPanelBehavior({ openPanelOnActionClick: true })
          .catch((error) => console.error(error));

// to find the windowId of the active tab
let windowId;
chrome.tabs.onActivated.addListener(function (activeInfo) {
  windowId = activeInfo.windowId;
});

// to receive messages from popup script
chrome.runtime.onMessage.addListener((message, sender) => {
  (async () => {
    if (message.action === 'open_side_panel') {
      chrome.sidePanel.open({ windowId: windowId });
    }
  })();
});
  
  async function syncRules() {
    const { blockedDomains = [], blockingEnabled = true } =
      await chrome.storage.sync.get(["blockedDomains", "blockingEnabled"]);
  
    // Remove **all** old dynamic rules first
    const current = await chrome.declarativeNetRequest.getDynamicRules();
    const idsToRemove = current.map(r => r.id);
    if (idsToRemove.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: idsToRemove });
    }
  
    // Add fresh rules only if blocking is ON
    if (blockingEnabled && blockedDomains.length) {
      const newRules = makeRules(blockedDomains);
      await chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });
    }
  }
  
  // Run once at install / update
  chrome.runtime.onInstalled.addListener(syncRules);
  
  // Re-run whenever user edits the list or toggles blocking
  chrome.storage.onChanged.addListener((changes, area) => {
    if (
      area === "sync" &&
      (changes.blockedDomains !== undefined || changes.blockingEnabled !== undefined)
    ) {
      syncRules();
    }
  });
  
