/* global browser */

console.log('background script');
console.log(browser);

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
});
