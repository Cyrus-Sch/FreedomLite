function updateTimer() {
  chrome.storage.sync.get(["lockStartTime", "lockAmount"], function(items) {
    const start = items.lockStartTime || 0;
    const amount = items.lockAmount || 0;

    const endTime = start + amount * 60 * 1000;
    const now = Date.now();
    const remaining = endTime - now;

    const timerElement = document.getElementById("remainingTime");

    if (remaining <= 0) {
      timerElement.textContent = "The block has ended. Please refresh.";
      location.reload();
    } else {
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      timerElement.textContent = `${minutes} minute(s) and ${seconds} second(s)`;
    }
  });
}

updateTimer();
setInterval(updateTimer, 1000);
