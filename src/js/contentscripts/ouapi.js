const ouapi = {
  config: {},
  sites: [],
  user: {},
  permissions: {},
  get(endpoint, params = {}) {
    const urlParams = new URLSearchParams();
    const allParams = Object.assign({}, params, this.config);
    Object.keys(allParams).forEach(key => urlParams.set(key, allParams[key]));

    return this.query(`${endpoint}?${urlParams.toString()}`);
  },
  post(endpoint, params) {
    const allParams = Object.assign({}, params, this.config);

    return this.query(endpoint, 'post', { body: allParams });
  },
  query(endpoint, method = 'get', init = {}) {
    const defaultInit = { method, credentials: 'same-origin' };
    const qInit = Object.assign({}, defaultInit, init);

    return fetch(endpoint, qInit);
  },
  whoami() {
    this.get('/authentication/whoami')
      .then(response => response.json())
      .then((data) => {
        this.config = {
          account: data.account,
          skin: data.skin,
          site: this.getCurrentSite(),
        };
        this.user = data.user;
        this.permissions = data.permissions;
      })
      .then(() => {
        this.get('/sites/list', this.config)
          .then(response => response.json())
          .then((data) => {
            this.sites = data;
          });
      });
  },
  getCurrentSite() {
    const { hash } = window.location;
    const pattern = new RegExp('^#([^/]*)/([^/]*)/([^/]*)/'); // skin, account, site
    return pattern.exec(hash)[3];
  },
};
