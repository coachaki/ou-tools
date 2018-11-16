// None of them really work yet.

var query = function(endpoint, params, method = 'get') {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function (evt) {
        console.log(JSON.parse(this.response));
        console.log(evt);
    });

    xhr.open(method, endpoint);
    // xhr.send(params); // TODO: need to make sure this gets sent in the proper format
};

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

var getProperties = function(path) {
    let endpoint = '/files/properties';
    let method = 'get';

    query(endpoint, path, method);
};

var getParams = function(params) {
    var output = '';
    params.parameters.forEach(function (field) {
        if (field.section) {
            output += '- ' + field.section + '\n';
        }
        output += '\t- **' + field.prompt + '**: ' + field.alt + '\n';
    })
    console.log(output);
    return output;
};