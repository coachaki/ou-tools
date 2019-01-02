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

(function () {
    let markup = '';
    let site = 'catalog';
    $.ajax({
        method: 'get',
        url: '/files/list',
        data: {
            site: site,
            path: '/current'
        }
    }).done(function (response) {
        let files = response.entries;
        
        files.forEach(function (file) {
            $.ajax({
                method: 'get',
                url: '/files/properties',
                data: {
                    site: site,
                    path: file.staging_path
                }
            }).done(function (response) {
                console.log({file, response})
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
        let templates = response.templates;
        
        templates.forEach(function (template) {
            let tcf = template.name;
            $.ajax({
                method: 'get',
                url: '/templates/view',
                data: {
                    site: site,
                    path: '/', // ability to set path, so we only see specific templates if template groups are used
                    template: tcf
                }
            }).then(function (response) {
                // var tmpl = response.fields[response.fields.length-1].template
                let tmpl = response;
                
                console.log({tcf, tmpl});
            });
        });
    });
    
}) ();