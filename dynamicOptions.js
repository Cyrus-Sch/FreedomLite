function loadPage(htmlFile) {
  fetch(htmlFile)
    .then(r => r.text())
    .then(text => {
      const wrapper = document.getElementById('Content');
      wrapper.innerHTML = text;

      wrapper.querySelectorAll('script[src]').forEach(old => {
        const s = document.createElement('script');
        s.src = old.src;                         // same file
        [...old.attributes].forEach(a => {
          if (a.name !== 'src') s.setAttribute(a.name, a.value);
        });
        document.body.appendChild(s);
      });
    });
}

chrome.storage.sync.get(["lockStartTime", "lockAmount"], function(items) {
  const start = items.lockStartTime || 0;
  const amount = items.lockAmount || 0;

  const datenow = Date.now();
  const elapsedTime = (datenow - start);
  elapsedMinutes = elapsedTime / (1000 * 60);
  if (elapsedTime - datenow == 0){
    elapsedMinutes = 0;
  }
  const html = (elapsedMinutes < amount) ? 'settingBlocked.html' : 'options.html';

  loadPage(html);
});
