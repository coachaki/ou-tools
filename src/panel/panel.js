/* global browser */

const { inspectedWindow, panels, network } = browser.devtools;

console.log(browser, window);

fetch('https://a.cms.omniupdate.com/authentication/whoami')
  .then(res => res.json())
  .then(json => console.log('whoami', json));
