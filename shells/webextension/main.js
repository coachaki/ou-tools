/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

function handleShown() {
  console.log('panel is being shown');
}

function handleHidden() {
  console.log('panel is being hidden');
}

/**
Create a panel, and add listeners for panel show/hide events.
*/

browser.devtools.inspectedWindow.eval('typeof OU != "undefined"').then((result) => {
  if (result[0] !== undefined) {
    const isOU = result[0];
    if (!isOU) {
      console.log('isOU', isOU);
      return;
    }

    browser.devtools.panels
      .create('OU Campus', '/img/icons/ou-tools-48.png', '/panel/panel.html')
      .then((newPanel) => {
        newPanel.onShown.addListener(handleShown);
        newPanel.onHidden.addListener(handleHidden);
      });
  }
});
