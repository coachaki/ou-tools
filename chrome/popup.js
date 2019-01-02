const changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', (data) => {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
changeColor.onclick = function (element) {
  const color = element.target.value;
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    // chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
    // chrome.tabs.reload();
  });

  getSites();
};

let getSites = function () {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (evt) => {
    console.log(evt);
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true,
  }, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    console.log(url);

    chrome.cookies.getAll({
      url,
    }, (cookies) => {
      console.log(cookies);
    });

    chrome.tabs.executeScript(tab.id, {
      code: 'getSites("ayamamoto");',
    });
  });
};
// $.get('/sites/list', { "account" : "TERRY" }).done(function(response) { console.log(response); })
