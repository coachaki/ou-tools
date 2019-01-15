/* global ouapi */

if (typeof ouapi === 'object') {
  const getTemplatePath = (url) => {
    const regex = /([&?]|(&amp;))path=(\/.*)\/[^/]*$/;
    const path = regex.exec(url)[3];
    return path;
  };

  const formatTemplateMDDefault = (data) => {
    const { templates, snippets } = data;
    let output = '';

    let templateMarkdown = '';
    Object.keys(templates).forEach((tmpl) => {
      const template = templates[tmpl];
      templateMarkdown += `### ${template.title}\n\n`;

      const { parameters } = template.properties;

      if (parameters) {
        templateMarkdown += '#### Page Properties\n\n';

        parameters.forEach((param, index) => {
          if (param.section || index === 0) {
            templateMarkdown += `- **${param.section || 'Custom Settings'}**\n`;
          }
          templateMarkdown += `\t- **${param.prompt}** — ${param.alt}\n`;
        });
        templateMarkdown += '\n\n';
      }
    });

    let snippetMarkdown = `
|     Name     | Description |
| ------------ | ----------- |`;
    snippets.forEach((snippet) => {
      snippetMarkdown += `
| ${snippet.name} | ${snippet.description} |`;
    });

    output = templateMarkdown + snippetMarkdown;

    return output;
  };

  ouapi.documentation = {
    skeleton: {},
    templates: {},
    tcf: {},
    snippets: [],
    components: {},
    assets: {},
    init() {
      if (typeof ouapi.config.site !== 'string') {
        ouapi
          .getSite()
          .then(() => {
            this.getTemplates();
            this.getSnippets();
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        this.getTemplates();
        this.getSnippets();
      }
    },
    getTemplates() {
      // const tmplPath = ouapi.site.use_local_templates ? ouapi.site.local_template_path : ouapi.site.remote_template_path;
      const tmplPath = ouapi.site.local_template_path; // no support for remote yet; not sure if remote templates can be accessed
      ouapi
        .get('/templates/list')
        .then(response => response.json())
        .then((templateList) => {
          this.tcf = templateList.templates;
          this.tcf.forEach((template) => {
            const tcf = template.name;
            const tcfTitle = template.alt;
            this.getTemplateDetails(tcf)
              .then(response => response.json())
              .then((templateDetails) => {
                let tmpl = null;
                templateDetails.fields.forEach((tcfField) => {
                  if (!tmpl && typeof tcfField.template === 'string') {
                    const tmplName = tcfField.template;
                    if (tmplName.indexOf('.tmpl') > 0) {
                      tmpl = tmplName;
                    }
                  }
                });

                if (tmpl) {
                  const path = template.default_img_url
                    ? getTemplatePath(template.default_img_url)
                    : tmplPath;
                  let templateData = {};
                  if (
                    typeof this.templates[tmpl] === 'object'
                    && typeof this.templates[tmpl].path === 'string'
                  ) {
                    templateData = this.templates[tmpl];
                    templateData.title += `, ${tcfTitle}`;
                  } else {
                    templateData = { path: `${path}/${tmpl}`, title: tcfTitle };
                    this.templates[tmpl] = templateData;
                  }
                  this.getProperties(templateData.path)
                    .then(response => response.json())
                    .then((properties) => {
                      templateData.properties = properties;
                    });
                }
              });
          });
        });
    },
    getTemplateDetails(template, path = '/') {
      return ouapi.get('/templates/view', { template, path });
    },
    getProperties(path) {
      return ouapi.get('/files/properties', { path });
    },
    getSnippets(site = ouapi.config.site) {
      // '/rs/snippets'
      ouapi
        .get('/rs/snippets', { site })
        .then(response => response.json())
        .then((snippetList) => {
          this.snippets = snippetList.entries;
        });
    },
    getComponents(site) {
      // '/rs/components'
      ouapi
        .get('/rs/components', { site })
        .then(response => response.json())
        .then((snippetList) => {
          this.snippets = snippetList.entries;
        });
    },
    getMarkdown(templateFunction = formatTemplateMDDefault) {
      return templateFunction({ templates: this.templates, snippets: this.snippets });
    },
  };
}
