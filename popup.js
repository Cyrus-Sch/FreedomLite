const blockOnOffbtn = document.getElementById("toggleBtn");

async function refresh() {
  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  blockOnOffbtn.textContent = blockingEnabled ? "Blocking: ON" : "Blocking: OFF";
}

blockOnOffbtn.addEventListener("click", async () => {
  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  await chrome.storage.sync.set({ blockingEnabled: !blockingEnabled });
  refresh();
});

refresh();

