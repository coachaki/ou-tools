console.log(browser);
console.log(browser.tabs);

const ports = {};

browser.runtime.onConnect.addListener((port) => {
  ports[port.name] = { port };
  console.log(ports);

  if (port.name.indexOf('paneljs') === 0) {
    addDevPanelHandler(port);
  }
});

function addDevPanelHandler(port) {
  port.onMessage.addListener((message) => {
    const { api, method, argv } = message;
    const apiCall = browser[api][method](...argv);
    apiCall.then((response) => {
      console.log(response);
      port.postMessage({ method: `${api}.${method}`, response });
    });
  });

  port.onDisconnect.addListener((port) => {
    console.log('disconnecting');
    console.log(port);
    delete ports[port.name];
    console.log(ports);
  });
}
