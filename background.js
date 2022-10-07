import { getLocalState } from './state.js'

chrome.tabs.onActivated.addListener((async ({tabId, windowsId}) => {
  const { speed, pId } = await getLocalState(tabId);
  chrome.action.setBadgeText({text: `${speed}x`});

  // const foo = await fetchAll()
  // chrome.storage.sync.remove(Object.keys(foo));
  // console.log('removing', Object.keys(foo))
}))


async function fetchAll() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, async (data) => {
      resolve(data)
    });
  })
}