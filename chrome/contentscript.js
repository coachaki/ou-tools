var getSites = function(account) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function(evt) {
        console.log(JSON.parse(this.response));
        console.log(evt);
    });

    let api = '/sites/list';
    // let params = { "account" : "TERRY" };

    xhr.open('get', api);
    xhr.send('account=' + account);
};