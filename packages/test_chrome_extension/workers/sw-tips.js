console.log('load sw-tips.js');

// Fetch tip & save in storage
const updateTip = async () => {
  console.log('> updateTip');

  const response = await fetch('https://extension-tips.glitch.me/tips.json');
  const tips = await response.json();
  const randomIndex = Math.floor(Math.random() * tips.length);
  return chrome.storage.local.set({ tip: tips[randomIndex] });
};

const ALARM_NAME = 'tip';

// Check if alarm exists to avoid resetting the timer.
// The alarm might be removed when the browser session restarts.
async function createAlarm() {
  console.log('chrome.alarms', chrome.alarms);
  await chrome.alarms.clear(ALARM_NAME);
  console.log('chrome.alarms', chrome.alarms);
  const alarm = await chrome.alarms.get(ALARM_NAME);
  console.log('> alarm', alarm);
  if (typeof alarm === 'undefined') {
    chrome.alarms.create(ALARM_NAME, {
      delayInMinutes: 1,
      periodInMinutes: 24 * 60, // 24hr 为周期
      // delayInMinutes: 0,
      // periodInMinutes: 0.5,
    });
    updateTip();
  }

  const storage = await chrome.storage.local.get();
  console.log('> storage', storage);
}

createAlarm();

// Update tip once a day
chrome.alarms.onAlarm.addListener(updateTip);
