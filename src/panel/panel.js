const { inspectedWindow, panels, network } = browser.devtools;

const bgScript = browser.runtime.connect({ name: `panel-js${inspectedWindow.tabId}` });

console.log(browser, window);

const url = () => {
  const tab = inspectedWindow.tabId;
  browser.runtime.sendMessage({ tabId: tab, action: 'get url' });
  return '';
};

url();

fetch('https://a.cms.omniupdate.com/authentication/whoami')
  .then(res => res.json())
  .then(json => console.log('whoami', json));

bgScript.onMessage.addListener((message) => {
  switch (message.type) {
    case 'get': {
      const data = window[message.callback]();
      bgScript.postMessage({ type: 'set', name: 'tabId', data });
      break;
    }
    default:
  }
});

function getInspectedTabId() {
  return inspectedWindow.tabId;
}
