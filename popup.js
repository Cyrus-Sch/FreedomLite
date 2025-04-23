const blockOnOffbtn = document.getElementById("toggleBtn");
const optionsBtn = document.getElementById("optionsBtn");

async function refresh() {
  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  BlockOnOffbtn.textContent = blockingEnabled ? "Blocking: ON" : "Blocking: OFF";
}

blockOnOffbtn.addEventListener("click", async () => {
  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  await chrome.storage.sync.set({ blockingEnabled: !blockingEnabled });
  refresh();
});

optionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();   // opens options.html in a new tab
  });

refresh();

