console.log(browser);
console.log(browser.tabs);

const ports = {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const rule1 = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: 'a.cms.omniupdate.com' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          css: ['a#nav-help[href*=oucampus10]', 'a.brand[href*="/10/"]'], // check for a link to the support site and a link to v10 ou campus for non-sass instances
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()],
    };
    chrome.declarativeContent.onPageChanged.addRules([rule1]);
  });

  console.log('background script');
});

browser.runtime.onMessage.addListener((message) => {
  console.log(message);

  const action = browser.tabs.get(message.tabId);

  action.then(tabInfo => console.log(tabInfo), error => console.log(error));
});

browser.runtime.onConnect.addListener((port) => {
  console.log(port);
  port.postMessage({ type: 'get', callback: 'getInspectedTabId' });

  port.onMessage.addListener((message) => {
    switch (message.type) {
      case 'set': {
        console.log(message);
        if (message.name === 'tabId') {
          ports[message.data] = port;
          console.log(ports);
        }
        break;
      }
      default:
        break;
    }
  });
});
