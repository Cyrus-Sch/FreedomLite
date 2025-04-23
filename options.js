const listEl  = document.getElementById("list");
const inputEl = document.getElementById("domainInput");
const formEl  = document.getElementById("addForm");
const addFromCurrentDomain = document.getElementById("addFromCurrentDomainBtn");
const lockInput = document.querySelector('#num');
const blockBtn = document.getElementById("blockBtn");

async function render() {
  const { blockedDomains = [] } = await chrome.storage.sync.get("blockedDomains");
  listEl.innerHTML = "";                       // clear list
  blockedDomains.forEach((d, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="domain">${d}</span>
      <button data-i="${i}">✕</button>
    `;
    listEl.appendChild(li);
  });
}

blockBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const minutes = num.valueAsNumber;
  if (!Number.isFinite(minutes) || minutes <= 0) {
    alert("Enter a positive number of minutes");   // guard-rail
    return;
  }
  const { blockedDomains = [] } =
    await chrome.storage.sync.get(["blockedDomains"]);


  const { blockingEnabled = true } = await chrome.storage.sync.get("blockingEnabled");
  if (blockingEnabled == false){
    alert("Please enable blocking!");
    return
  }
  // use .length, not .Count
  if (blockedDomains.length === 0) {
    alert("Please add domains you want to block!")
    await chrome.storage.sync.set({ lockStartTime: 0, lockAmount: -1 });
    return;
  }

  // store both keys in one call
  await chrome.storage.sync.set({
    lockStartTime: Date.now(),
    lockAmount: minutes,
  });

  location.reload();            // reload after everything is stored
});

// Add new domain
formEl.addEventListener("submit", async e => {
  e.preventDefault();
  const domain = inputEl.value.trim().replace(/^https?:\/\/|\/.*$/g, ""); // strip scheme / path
  if (!domain) return;
  const { blockedDomains = [] } = await chrome.storage.sync.get("blockedDomains");
  if (!blockedDomains.includes(domain)) {
    blockedDomains.push(domain);
    await chrome.storage.sync.set({ blockedDomains });
  }
  inputEl.value = "";
  render();
});

addFromCurrentDomainBtn.addEventListener("click", async e => {
  e.preventDefault();

  (async () => {
    // see the note below on how to choose currentWindow or lastFocusedWindow
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    if (tab.url == undefined) return;
    console.log(tab.url);
    const domain = tab.url.trim().replace(/^https?:\/\/|\/.*$/g, ""); // strip scheme / path
    if (!domain) return;
    const { blockedDomains = [] } = await chrome.storage.sync.get("blockedDomains");
    if (!blockedDomains.includes(domain)) {
      blockedDomains.push(domain);
      await chrome.storage.sync.set({ blockedDomains });
    }
    inputEl.value = "";
    render();
    })();
});

// Remove domain
listEl.addEventListener("click", async e => {
  if (e.target.tagName !== "BUTTON") return;
  const i = Number(e.target.dataset.i);
  const { blockedDomains = [] } = await chrome.storage.sync.get("blockedDomains");
  blockedDomains.splice(i, 1);
  await chrome.storage.sync.set({ blockedDomains });
  render();
});

render();
