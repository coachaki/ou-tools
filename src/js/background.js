chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#3aa757' }, () => {
    console.log('The color is green.');
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'a.cms.omniupdate.com' },
          }),
          new chrome.declarativeContent.PageStateMatcher({
            css: ['a#nav-help[href*=oucampus10]', 'a.brand[href*="/10/"]'], // check for a link to the support site and a link to v10 ou campus for non-sass instances
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
