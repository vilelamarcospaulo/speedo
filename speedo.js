import { getLocalState, saveState } from './state.js'

const input = document.getElementById('speed')

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
}

function clearIntervalTab(pid) {
  // console.log(`> removing interval ${pid}`)
  clearInterval(pid);
  return undefined;
}

function continuousSpeedPlayers(speed) {
  [...document.querySelectorAll('video')].forEach(player => player.playbackRate = speed);
  const pid = setInterval(function () {
    // console.log(`> running interval to speedUp ${speed}x ${pid}`);
    [...document.querySelectorAll('video')].forEach(player => player.playbackRate = speed);
  }, 500);

  // console.log(`> created interval to speedUp ${speed}x ${pid}`);
  return pid;
}

function resetPlayers() {
  // console.log(`> reset speed to 1x`);
  [...document.querySelectorAll('video')].forEach(player => player.playbackRate = 1);
}

async function tabExecPromise(tabId, func, args) {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func,
        args,
      },
      (executionReturn) => { 
        if(executionReturn && executionReturn[0]) {
          resolve(executionReturn[0].result) 
        }
        resolve()
      }
    );
  })
}

async function updateSpeedRate(newSpeed) {
  const tabId = await getCurrentTab()
  const state = await getLocalState(tabId)
  
  if(newSpeed === state.speed) return;
  
  state.speed = newSpeed
  
  if(state.pid) {
    state.pid = await tabExecPromise(tabId, clearIntervalTab, [state.pid])
  }

  if(newSpeed === 1) {
    state.pid = await tabExecPromise(tabId, resetPlayers, [])
  } else {
    state.pid = await tabExecPromise(tabId, continuousSpeedPlayers, [state.speed])
  }

  chrome.action.setBadgeText({text: `${newSpeed}x`});

  await saveState(state)
}

(async function () {
  const tabId = await getCurrentTab()
  const { speed } = await getLocalState(tabId)

  input.value = String(speed)
})()

input.addEventListener('change', (event) => updateSpeedRate(Number(event.target.value)))