/* eslint-disable-next-line no-unused-vars */
const ouapi = {
  config: {
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

    return fetch(endpoint, qInit);
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
          this.config = {
            account: whoamiData.account,
            skin: whoamiData.skin,
          };
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
    const { hash } = window.location;
    const pattern = new RegExp('^#([^/]*)/([^/]*)/([^/]*)'); // skin, account, site
    const site = _site || pattern.exec(hash)[3];
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

export default ouapi;
