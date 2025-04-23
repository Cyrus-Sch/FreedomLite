const listEl  = document.getElementById("list");
const inputEl = document.getElementById("domainInput");
const formEl  = document.getElementById("addForm");
const addFromCurrentDomain = document.getElementById("addFromCurrentDomainBtn")

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
