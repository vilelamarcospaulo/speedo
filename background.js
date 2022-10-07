import { getLocalState } from './state.js'

chrome.tabs.onActivated.addListener((async ({tabId, windowsId}) => {
  const { speed, pId } = await getLocalState(tabId);
  chrome.action.setBadgeText({text: `${speed}x`});
}))

chrome.tabs.onRemoved.addListener(async (tabId) => {
  chrome.storage.sync.remove([String(tabId)]);
})
