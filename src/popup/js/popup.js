/* global templates */

const contentScriptFiles = [
  { file: 'js/contentscripts/ouapi.js' },
  { file: 'js/contentscripts/assets.js' },
  { file: 'js/contentscripts/documentation.js' },
];

contentScriptFiles.forEach(file => chrome.tabs.executeScript(file));

const appUI = document.getElementById('app-ui');

function getSites() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', evt => {
    console.log(evt);
  });
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    tabs => {
      const tab = tabs[0];
      const { url } = tab;
      console.log(url);

      chrome.cookies.getAll(
        {
          url,
        },
        cookies => {
          console.log(cookies);
        },
      );

      chrome.tabs.executeScript(tab.id, {
        code: 'getSites("clpccd");',
      });
    },
  );
}

function outputUI(action) {
  let output = '';
  switch (action) {
    case 'newUser':
      output = templates.dev.newUser;
      break;
    default:
      console.log('unknown action');
  }

  appUI.innerHTML = output;
}
