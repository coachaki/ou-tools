/* global ouapi */

if (typeof ouapi === 'object') {
  ouapi.documentation = {
    skeleton: {},
    templates: {},
    snippets: {},
    components: {},
    assets: {},
    init() {
      if (typeof ouapi.config.site !== 'string') {
        ouapi
          .getSite()
          .then(() => {
            console.log('getSite resolved');
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
      const tmplPath = `${ouapi.site.local_template_path}/`; // no support for remote yet; not sure if remote templates can be accessed
      ouapi
        .get('/templates/list')
        .then(response => response.json())
        .then((templateList) => {
          this.templates = templateList.templates;
          this.templates.forEach((template) => {
            const tcf = template.name;
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

                if (tmpl && !this.templates[tmpl]) {
                  const templateData = { path: tmplPath + tmpl };
                  this.templates[tmpl] = templateData;
                  this.getProperties(templateData.path)
                    .then(response => response.json())
                    .then((properties) => {
                      console.log(properties);
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
    },
    getComponents() {
      // '/rs/components'
    },
  };
}
