const btn = document.getElementById("toggleBtn");

async function refresh() {
  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  btn.textContent = blockingEnabled ? "Blocking: ON" : "Blocking: OFF";
}

btn.addEventListener("click", async () => {
  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  await chrome.storage.sync.set({ blockingEnabled: !blockingEnabled });
  refresh();
});

refresh();

