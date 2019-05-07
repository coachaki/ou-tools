/*
global $
*/

/** Thought Process **
 *
 * Procedure
 * 1. Get site info to grab necessary properties
 * 2. Get all templates available (returns tcf)
 * 3. Get all properties available from each template
 * 4. Merge all collected data into 1 variable.
 * 5. Convert the merged data into whatever format we want (e.g., Markdown)
 * */
(function () {
  const properties_data = {};
  const site = 'catalog';
  const account = 'mvcc';

  $.ajax({
    method: 'get',
    url: '/sites/view',
    data: {
      account,
      site,
    },
  }).then((response) => {
    console.log({
      response,
    });
    const tmpl_dir = response.local_template_path;

    $.ajax({
      method: 'get',
      url: '/files/list',
      data: {
        site,
        path: '/current',
      },
    }).then((response) => {
      const files = response.entries;
      files.forEach((file) => {
        $.ajax({
          method: 'get',
          url: '/files/properties',
          data: {
            site,
            path: file.staging_path,
          },
        }).then((response) => {
          console.log({
            file,
            response,
          });
        });
      });
    });
    $.ajax({
      method: 'get',
      url: '/templates/list',
      data: {
        site,
      },
    }).then((response) => {
      const templates = response.templates;
      templates.forEach((template) => {
        const tcf = template.name;
        $.ajax({
          method: 'get',
          url: '/templates/view',
          data: {
            site,
            path: '/', // ability to set path, so we only see specific templates if template groups are used
            template: tcf,
          },
        }).then((response) => {
          const tmpl = response.fields[response.fields.length - 1].template.indexOf('.tmpl') > 0
            ? response.fields[response.fields.length - 1].template
            : undefined;
          if (tmpl) {
            $.ajax({
              method: 'get',
              url: '/files/properties',
              data: {
                site,
                path: `${tmpl_dir}/${tmpl}`,
              },
            }).then((response) => {
              console.log({ template, response });
            });
          }

          const data = {
            title: template.alt,
            properties: {
              title: response.title,
              meta: response.meta_tags,
              parameters: response.parameters,
            },
          };

          properties_data[template.name] = data;
        });
      });
    });
  });
}());

/*
 * Thought Process
 *
 * 1. Require input data to contain formatting information
 * 2. Create generic output functionality that properly reflects the formatting information in the input
 */
function format_md(data) {
  let output = '';

  for (const key in data) {
    const block = data[key];
    console.log(block);
    output += `## ${block.title}\n\n`;

    const parameters = block.properties.parameters;

    for (const key in parameters) {
      const field = parameters[key];

      if (field.section) {
        output += `- **${field.section}**\n`;
      }

      output += `\t- **${field.prompt}** — ${field.alt}\n`;
    }
    output += '\n\n';
  }

  return output;
}
