const ouapi = {
  config: {},
  site: {},
  sites: [],
  user: {},
  permissions: {},
  get(endpoint, params = {}) {
    const urlParams = new URLSearchParams();
    const allParams = Object.assign({}, this.config, params);
    Object.keys(allParams).forEach(key => urlParams.set(key, allParams[key]));

    return this.query(`${endpoint}?${urlParams.toString()}`);
  },
  post(endpoint, params) {
    const allParams = Object.assign({}, this.config, params);

    return this.query(endpoint, 'post', { body: allParams });
  },
  query(endpoint, method = 'get', init = {}) {
    const defaultInit = { method, credentials: 'same-origin' };
    const qInit = Object.assign({}, defaultInit, init);

    return fetch(endpoint, qInit);
  },
  whoami(_site) {
    return new Promise(() => {
      this.get('/authentication/whoami')
        .then(response => response.json())
        .then((data) => {
          this.config = {
            account: data.account,
            skin: data.skin,
          };
          this.getSite(_site);
          this.user = data.user;
          this.permissions = data.permissions;
        })
        .then(() => {
          this.get('/sites/list', this.config)
            .then(response => response.json())
            .then((data) => {
              this.sites = data;
              Promise.resolve();
            });
        });
    });
  },
  getSite(_site) {
    if (typeof this.config.account !== 'string') {
      return this.whoami(_site);
    }
    const { hash } = window.location;
    const pattern = new RegExp('^#([^/]*)/([^/]*)/([^/]*)/'); // skin, account, site
    const site = _site || pattern.exec(hash)[3];
    return new Promise(() => {
      this.get('/sites/view', { site }).then((response) => {
        if (response.ok !== true) {
          this.site = null;
          this.config.site = null;
          Promise.reject(new Error('error'));
        } else {
          response.json().then((siteData) => {
            this.site = siteData;
            this.config.site = site;
            Promise.resolve();
          });
        }
      });
    });
  },
};
