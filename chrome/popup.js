let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function (data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});
changeColor.onclick = function (element) {
  let color = element.target.value;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
    // chrome.tabs.reload();
  });

  getSites();
};

let getSites = function () {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function (evt) {
    console.log(evt);
  });
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    let tab = tabs[0];
    let url = tab.url;
    console.log(url);

    chrome.cookies.getAll({
      url: url
    }, function (cookies) {
      console.log(cookies);
    });

    chrome.tabs.executeScript(tab.id, {
      code: 'getSites("ayamamoto");'
    });
  });

};
// $.get('/sites/list', { "account" : "TERRY" }).done(function(response) { console.log(response); })
