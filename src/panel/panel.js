/* global browser */

const call1 = 'let whoamiResult = ""; fetch("/authentication/whoami").then(res => res.json()).then(json => whoamiResult = json)';
const { inspectedWindow, panels, network } = browser.devtools;
const theme = panels.themeName;

console.log(browser, window);

// fetch('/authentication/whoami')
//   .then(res => res.json())
//   .then(json => console.log(json));

inspectedWindow.eval(call1)
  .then((result) => {
    console.log(result);
  });
