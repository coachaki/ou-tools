// None of them really work yet.
function getSites(account) {
  ouapi
    .get('/sites/list')
    .then(response => response.json())
    .then((data) => {
      console.log(data);
    });
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
