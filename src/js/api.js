const api = {
  config: {},
  user: {},
  permissions: {},
  get: (endpoint, params) => {
    this.query(endpoint, params, 'get');
  },
  post(endpoint, params) {
    this.query(endpoint, params, 'post');
  },
  query(endpoint, params, method = 'get') {
    const myInit = {
      method,
      credentials: 'same-origin',
      body: Object.assign(params, this.config),
    };

    return fetch(endpoint, myInit);
  },
  keepalive() {},
  whoami() {
    this.get('/authentication/whoami', {})
      .then(response => response.json())
      .then((data) => {
        this.config = {
          account: data.account,
          skin: data.skin,
          site: data.site,
        };
        this.user = data.user;
        this.permissions = data.permissions;
      });
  },
};
