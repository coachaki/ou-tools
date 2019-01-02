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
 **/
(function () {
    var properties_data = {};
    var site = 'catalog';
    var account = 'mvcc';
    
    $.ajax({
        method: 'get',
        url: '/sites/view',
        data: {
            account: account,
            site: site
        }
    }).then(function (response) {
        console.log({
            response
        });
        var tmpl_dir = response.local_template_path;
        
        $.ajax({
            method: 'get',
            url: '/files/list',
            data: {
                site: site,
                path: '/current'
            }
        }).then(function (response) {
            var files = response.entries;
            files.forEach(function (file) {
                $.ajax({
                    method: 'get',
                    url: '/files/properties',
                    data: {
                        site: site,
                        path: file.staging_path
                    }
                }).then(function (response) {
                    console.log({
                        file,
                        response
                    });
                });
            });
        });
        $.ajax({
            method: 'get',
            url: '/templates/list',
            data: {
                site: site
            }
        }).then(function (response) {
            var templates = response.templates;
            templates.forEach(function (template) {
                var tcf = template.name;
                $.ajax({
                    method: 'get',
                    url: '/templates/view',
                    data: {
                        site: site,
                        path: '/', // ability to set path, so we only see specific templates if template groups are used
                        template: tcf
                    }
                }).then(function (response) {
                    var tmpl = (response.fields[response.fields.length - 1].template.indexOf('.tmpl') > 0) ? response.fields[response.fields.length - 1].template : undefined
                    if (tmpl) {
                        $.ajax({
                            method: 'get',
                            url: '/files/properties',
                            data: {
                                site: site,
                                path: tmpl_dir + '/' + tmpl
                            }
                        }).then(function(response) {
                            console.log({template, response});
                        });
                    }
                    
                    var data = {
                        title: template.alt,
                        properties: {
                            title: response.title,
                            meta: response.meta_tags,
                            parameters: response.parameters
                        }
                    };
                    
                    properties_data[template.name] = data;
                });
            });
        });
    });
}) ();


/*
 * Thought Process
 *
 * 1. Require input data to contain formatting information
 * 2. Create generic output functionality that properly reflects the formatting information in the input
 */
function format_md(data) {
    var output = '';
    
    for (var key in data) {
        var block = data[key];
        console.log(block);
        output += '## ' + block.title + '\n\n';
        
        var parameters = block.properties.parameters;
        
        for(let key in parameters) {
            var field = parameters[key];
            
            if (field.section) {
                output += '- **' + field.section + '**\n';
            }
            
            output += '\t- **' + field.prompt + '** — ' + field.alt + '\n';
        }
        output += '\n\n';
    }
    
    return output;
}