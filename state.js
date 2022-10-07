const newState = (tabId) => ({
  tabId,
  pId: undefined,
  speed: 1,
})

async function fetchState(tabId) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([tabId], async (data) => {
      resolve(data[tabId] || newState(tabId))
    });
  })
}

export async function saveState(state) {
  if(state.speed === 1) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove([state.tabId])
      resolve()
    })
  }

  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [state.tabId]: state }, async () => resolve())
  })
}

export async function getLocalState(tabId) {
  tabId  = `${tabId}`

  return fetchState(tabId)
}
