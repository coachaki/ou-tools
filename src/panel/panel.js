const { inspectedWindow, panels, network } = browser.devtools;
const browserData = {};
const ouc = {};
const bgScript = browser.runtime.connect({ name: `paneljs${inspectedWindow.tabId}` });

const panel = {
  async getTabInfo() {
    bgScript.postMessage({ api: 'tabs', method: 'get', argv: [1] });
  },
  getMeList() {
    const dl = document.createElement('dl');
    dl.classList = ['horizontal'];
    const outputList = ['skin', 'account', 'site', 'username'];
    outputList.forEach((value) => {
      const dt = document.createElement('dt');
      dt.innerText = value;
      const dd = document.createElement('dd');
      dd.innerText = ouc.me[value];
      dl.append(dt, dd);
    });
    return dl;
  },
  getSite(url) {
    return url.substr(url.indexOf('#')).split('/')[2];
  },
  async whoami() {
    return fetch(`${ouc.me.apihost}/authentication/whoami`)
      .then(res => res.json())
      .then((json) => {
        const site = panel.getSite(browserData.tab.url);
        Object.assign(ouc.me, json, { username: json.user.username, site });
      });
  },
};

function addListeners() {
  bgScript.onMessage.addListener((m) => {
    if (m.method === 'tabs.get') {
      browserData.tab = m.response;
      const url = new URL(browserData.tab.url);
      ouc.me = {
        apihost: url.origin,
      };
      panel.whoami().then(() => {
        const meList = panel.getMeList();
        const info = document.getElementById('tabInfo');
        info.removeChild(...info.children);
        info.append(meList);
      });
    }
  });
  window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('whoami').addEventListener('click', (ev) => {
      panel.getTabInfo();
    });
    document.addEventListener('submit', (ev) => {
      ev.preventDefault();
      console.log(ev);
    });
  });
}

addListeners();
panel.getTabInfo();
