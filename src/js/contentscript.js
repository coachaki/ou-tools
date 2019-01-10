// None of them really work yet.

function query(endpoint, params, method = 'get') {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function (evt) {
    console.log(JSON.parse(this.response));
    console.log(evt);
  });

  xhr.open(method, endpoint);
  // xhr.send(params); // TODO: need to make sure this gets sent in the proper format
}

function getSites(account) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (evt) => {
    console.log(JSON.parse(this.response));
    console.log(evt);
  });

  const api = '/sites/list';
  // let params = { "account" : "TERRY" };

  xhr.open('get', api);
  xhr.send(`account=${account}`);
}

function getProperties(path) {
  const endpoint = '/files/properties';
  const method = 'get';

  query(endpoint, path, method);
}

function getParams(params) {
  let output = '';
  params.parameters.forEach((field) => {
    if (field.section) {
      output += `- ${field.section}\n`;
    }
    output += `\t- **${field.prompt}**: ${field.alt}\n`;
  });
  console.log(output);
  return output;
}

function newAsset(params) {
  const endpoint = '/assets/new';
  const method = 'post';
}
