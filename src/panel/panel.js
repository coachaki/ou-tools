const { inspectedWindow, panels, network } = browser.devtools;
const browserData = {};
const ouc = {};

const bgScript = browser.runtime.connect({ name: `paneljs${inspectedWindow.tabId}` });
bgScript.postMessage({ api: 'tabs', method: 'get', argv: [1] });
bgScript.onMessage.addListener((m) => {
  if (m.method === 'tabs.get') {
    browserData.tab = m.response;
    const url = new URL(browserData.tab.url);
    ouc.info.apihost = url.origin;

    fetch(`${ouc.info.apihost}/authentication/whoami`)
      .then(res => res.json())
      .then(json => console.log('whoami', json));
  }
  console.log(data);
});
