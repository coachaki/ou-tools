/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

const { inspectedWindow } = browser.devtools;
const browserData = {};
const bgScript = browser.runtime.connect({ name: `paneljs${inspectedWindow.tabId}` });

const ouapi = {
  config: {
    url: '',
    apihost: '',
    account: '',
    skin: '',
  },
  site: {},
  sites: [],
  user: {},
  permissions: {},
  me: {},
  get(endpoint, params = {}) {
    const urlParams = new URLSearchParams();
    const allParams = Object.assign({}, this.config, params);
    Object.keys(allParams).forEach(key => urlParams.set(key, allParams[key]));

    return this.query(`${endpoint}?${urlParams.toString()}`);
  },
  post(endpoint, params) {
    const urlParams = new URLSearchParams();
    const allParams = Object.assign({}, this.config, params);
    Object.keys(allParams).forEach((key) => {
      if (Array.isArray(allParams[key])) {
        urlParams.set(key, JSON.stringify(allParams[key]));
      } else {
        urlParams.set(key, allParams[key]);
      }
    });

    return this.query(endpoint, 'post', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: urlParams.toString(),
    });
  },
  query(endpoint, method = 'get', init = {}) {
    const defaultInit = { method, credentials: 'same-origin' };
    const qInit = Object.assign({}, defaultInit, init);

    return fetch(this.config.apihost + endpoint, qInit);
  },
  whoami(_site) {
    return new Promise((resolve, reject) => {
      this.get('/authentication/whoami')
        .then((response) => {
          if (!response.ok) {
            reject(new Error('whoami call failed.'));
          }
          return response.json();
        })
        .then((whoamiData) => {
          this.config.account = whoamiData.account;
          this.config.skin = whoamiData.skin;
          this.user = whoamiData.user;
          this.permissions = whoamiData.permissions;
          this.me = whoamiData;
        })
        .then(() => this.getSite(_site))
        .then(() => {
          this.get('/sites/list', this.config)
            .then(response => response.json())
            .then((siteList) => {
              this.sites = siteList;
              resolve(siteList);
            });
        });
    });
  },
  getSite(_site) {
    if (typeof this.config.account !== 'string') {
      return this.whoami(_site);
    }
    const { url } = this.config;
    const site = _site || url.substr(url.indexOf('#')).split('/')[2];
    return new Promise((resolve, reject) => {
      this.get('/sites/view', { site }).then((response) => {
        if (response.ok !== true) {
          this.site = null;
          this.config.site = null;
          reject(new Error('Site parsing from the URL failed.'));
        } else {
          response.json().then((siteData) => {
            this.site = siteData;
            this.config.site = site;
            resolve(siteData);
          });
        }
      });
    });
  },
};

const panel = {
  async getTabInfo() {
    bgScript.postMessage({ api: 'tabs', method: 'get', argv: [1] });
  },
  generatePassword(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678901234567890123456789!$/%@#!$/%@#!$/%@#';
    let password = '';
    for (let i = 0; i < length; i++) {
      const r = Math.floor(Math.random() * chars.length);
      password += chars.charAt(r);
    }
    return password;
  },
  outputError(error, custom = '') {
    const responseDiv = document.getElementById('response');
    const message = document.createElement('p');
    message.innerText = `Error: ${error}`;
    responseDiv.append(message);

    if (custom.length > 0) {
      const customP = document.createElement('p');
      customP.innerText = custom;
      responseDiv.append(customP);
    }
  },
  outputResponse(messages) {
    const responseDiv = document.getElementById('response');
    const lines = messages.map((message) => {
      const p = document.createElement('p');
      p.innerText = message;
      return p;
    });
    responseDiv.append(...lines);
  },
  makeInfoList() {
    const dl = document.createElement('dl');
    dl.classList = ['horizontal'];
    const outputData = {
      Skin: ouapi.config.skin,
      Account: ouapi.config.account,
      Site: ouapi.config.site,
      Username: ouapi.user.username,
    };
    Object.keys(outputData).forEach((key) => {
      const dt = document.createElement('dt');
      dt.innerText = key;
      const dd = document.createElement('dd');
      dd.innerText = outputData[key];
      dl.append(dt, dd);
    });
    return dl;
  },
  getSite(url) {
    return url.substr(url.indexOf('#')).split('/')[2];
  },
  async createUser(formData) {
    const randomPassword = this.generatePassword(20);
    const data = {
      privilege: Number(formData.get('privilege')),
      webdav: formData.get('webdav') === 'true',
      username: formData.get('username'),
      password: formData.get('password') || randomPassword,
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
    };
    const newUser = ouapi.post('/users/new', data);
    newUser
      .then(res => res.json())
      .then((createResponse) => {
        if (createResponse.error) {
          this.outputError(createResponse.error, `>> The provided username: ${data.username}`);
          return;
        }

        ouapi
          .get('/users/view', { user: data.username })
          .then(res => res.json())
          .then((newUserData) => {
            const messages = [
              'Success: User created.',
              `>> Login credentials: ${data.username}:${data.password}`,
              `>> WebDav URL: ${newUserData.webdav_url}`,
            ];
            this.outputResponse(messages);
          });
      });
  },
  async newFormEmail(formData) {
    const fromEmail = formData.get('fromEmail') || 'from@omniupdate.com';
    const apiCall = ouapi.assets.newFormEmail(fromEmail);
    apiCall
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          this.outputError(json.error, '>> Not sure why it failed.');
          return;
        }

        ouapi.assets
          .get(json.asset)
          .then(res => res.json())
          .then((newAssetData) => {
            const messages = [
              'Success: Asset created.',
              `>> Asset name: ${newAssetData.name}`,
              `>> From email: ${fromEmail}`,
            ];
            this.outputResponse(messages);
          });
      });
  },
  async newFormAll() {
    const apiCall = ouapi.assets.newFormAll();
    apiCall
      .then(res => res.json())
      .then((json) => {
        if (json.error) {
          this.outputError(json.error, '>> Not sure why it failed.');
          return;
        }

        ouapi.assets
          .get(json.asset)
          .then(res => res.json())
          .then((newAssetData) => {
            const messages = ['Success: Asset created.', `>> Asset name: ${newAssetData.name}`];
            this.outputResponse(messages);
          });
      });
  },
};

function makeTabs(doc) {
  const togglePanel = (ul, a) => {
    if (a.parentElement.classList.contains('active')) {
      return; // clicked on an active tab.
    }

    const activeTabs = ul.getElementsByClassName('active');
    Array.from(activeTabs).forEach((tab) => {
      const tabA = tab.getElementsByTagName('a')[0];
      const href = tabA.attributes.href.value;
      const id = href.substring(href.indexOf('#') + 1);
      tab.classList.remove('active');
      doc.getElementById(id).classList.remove('active');
    });

    const href = a.attributes.href.value;
    const tabId = href.substring(href.indexOf('#') + 1);
    a.parentElement.classList.add('active');
    doc.getElementById(tabId).classList.add('active');
  };

  Array.from(doc.getElementsByClassName('tabs')).forEach((ul) => {
    ul.addEventListener('click', (ev) => {
      ev.preventDefault();
      togglePanel(ul, ev.target);
    });
  });
}

function addListeners() {
  bgScript.onMessage.addListener((m) => {
    if (m.method === 'tabs.get') {
      browserData.tab = m.response;
      const url = new URL(browserData.tab.url);
      ouapi.config.url = browserData.tab.url;
      ouapi.config.apihost = url.origin;
      ouapi.whoami().then(() => {
        const infoList = panel.makeInfoList();
        const div = document.createElement('div');
        div.id = 'tabInfo';
        div.append(infoList);
        const infoDiv = document.getElementById('tabInfo');
        infoDiv.replaceWith(div);
      });
    }
  });
  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('whoami').addEventListener('click', () => {
      panel.getTabInfo();
    });
    document.addEventListener('submit', (ev) => {
      ev.preventDefault();
      console.log(ev);
      const data = new FormData(ev.target);
      const { action } = ev.target.dataset;

      panel[action](data);
    });
    makeTabs(document);
  });
}

addListeners();
panel.getTabInfo();
