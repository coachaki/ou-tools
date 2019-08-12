/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
/* global ouapi, panel */

if (typeof ouapi === 'object') {
  ouapi.assets = {
    entries: [],
    list(count = 10000) {
      return ouapi.get('/assets/list', { count }).then((response) => {
        this.entries = response.entries;
      });
    },
    get(asset) {
      return ouapi.get('/assets/view', { asset });
    },
    new(params = { name: `New Asset ${Math.floor(Math.random() * 10000)}`, type: 0 }) {
      return ouapi.post('/assets/new', params);
    },
    newForm(params = {}) {
      const postData = Object.assign({}, params, { type: 4, site_locked: true });
      return ouapi.post('/assets/new', postData);
    },
    newFormEmail(fromEmail = 'form@omniupdate.com') {
      const postData = {
        name: `(zz-dev) Form ${Math.floor(Math.random() * 10000)} - Email Test`,
        type: 4,
        description: 'A form to test email creation',
        site_locked: true,
        use_database: true,
        group: '',
        readers: '',
        pass_message: 'Success!',
        fail_message: 'Fail.',
        elements: [
          {
            name: 'email',
            type: 'input-text',
            required: true,
            label: 'Email',
            default_value: 'email@example.com',
            validation: 'email',
            validation_fail: 'An email is required for this field to work.',
            advanced: '',
            options: [],
            element_info: 'Enter an email address. The system will send you an email.',
          },
        ],
        emails: [
          {
            to: '{{email}}',
            from: fromEmail,
            subject: 'Email Test Form',
            body: 'Congratulations! The email feature is working!!',
            include_all: false,
          },
        ],
      };
      return ouapi.post('/assets/new', postData);
    },
    newFormAll() {
      const postData = {
        name: `(zz-dev) Form ${Math.floor(Math.random() * 10000)} - All Elements`,
        type: 4,
        description: 'A form to test email creation',
        site_locked: true,
        use_database: true,
        group: '',
        readers: '',
        pass_message: 'Success!',
        fail_message: 'Fail.',
        elements: [
          {
            name: 'singletext',
            type: 'input-text',
            required: false,
            label: 'Single Text',
            default_value: 'Single Text',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [],
            element_info: 'Single Line Text Field',
          },
          {
            name: 'multilinetext',
            type: 'textarea',
            required: false,
            label: 'Multiline Text',
            default_value: 'Multiline text default',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [],
            element_info: 'This is a multiline textfield',
          },
          {
            name: 'radiobuttons',
            type: 'input-radio',
            required: false,
            label: 'Radio Buttons',
            default_value: '',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [
              { value: 'A', selected: false, text: 'A' },
              { value: 'B', selected: false, text: 'B' },
              { value: 'C', selected: false, text: 'C' },
              { value: 'D', selected: false, text: 'D' },
            ],
            element_info: 'Choose 1 out of these options',
          },
          {
            name: 'checkboxes',
            type: 'input-checkbox',
            required: false,
            label: 'Checkboxes',
            default_value: '',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [
              { value: '1', selected: false, text: '1' },
              { value: '2', selected: false, text: '2' },
              { value: '3', selected: false, text: '3' },
              { value: '4', selected: false, text: '4' },
              { value: '5', selected: false, text: '5' },
            ],
            element_info: 'Choose as many as applicable',
          },
          {
            name: 'dropdown',
            type: 'select-single',
            required: false,
            label: 'Dropdown',
            default_value: '',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [
              { value: 'Dog', selected: false, text: 'Dog' },
              { value: 'Cat', selected: false, text: 'Cat' },
              { value: 'Fish', selected: false, text: 'Fish' },
              { value: 'Turtle', selected: false, text: 'Turtle' },
              { value: 'Snake', selected: false, text: 'Snake' },
            ],
            element_info: 'Choose 1 out of the dropdown',
          },
          {
            name: 'multiselect',
            type: 'select-multiple',
            required: false,
            label: 'Multi-Select',
            default_value: '',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [
              { value: 'One', selected: false, text: 'One' },
              { value: 'Two', selected: false, text: 'Two' },
              { value: 'Three', selected: false, text: 'Three' },
              { value: 'Four', selected: false, text: 'Four' },
              { value: 'Five', selected: false, text: 'Five' },
            ],
            element_info: 'Use ctrl   click to select multiple items',
          },
          {
            name: 'datetime',
            type: 'datetime',
            required: false,
            label: 'Date Time',
            default_value: '',
            validation: '',
            validation_fail: '',
            advanced: '',
            format: 'datetime',
            options: [],
            element_info: 'Choose a date/time',
          },
          {
            name: 'insttext8',
            type: 'insttext',
            required: false,
            label: 'This is an instructional text.',
            default_value: '',
            validation: '',
            validation_fail: '',
            advanced: '',
            options: [],
            element_info: '',
          },
        ],
        submit_text: 'Custom Submit',
      };
      return ouapi.post('/assets/new', postData);
    },
    newGallery(params = {}) {
      const postData = Object.assign({}, params, { type: 3, site_locked: true });
      return ouapi.post('/assets/new', postData);
    },
    newSampleGallery(imagePaths = []) {
      const postData = {
        name: `(zz-dev) Gallery ${Math.floor(Math.random() * 10000)} - Dev Sample`,
        description: 'A sample gallery to showcase gallery features',
        thumbnail_width: '100',
        thumbnail_height: '100',
        force_crop: 'false',
      };

      let assetData = {};
      const initializeGallery = this.newGallery(postData)
        .then(res => res.json())
        .then((json) => {
          if (json.error) {
            this.outputError(json.error);
            return Promise.reject(json.error);
          }
          return Promise.resolve(json.asset);
        })
        .then(assetID => this.get(assetID))
        .then(res => res.json())
        .then((json) => {
          assetData = json;
          panel.outputResponse([`Empty gallery asset created with ID ${json.asset}. Adding images.`]);
          const callStack = [];
          imagePaths.forEach((path) => {
            callStack.push(this.addImage({ filepath: path, assetData }));
          });

          return Promise.resolve(callStack);
        });

      initializeGallery.then((calls) => {
        Promise.all(calls).then((responses) => {
          const array = [];
          responses.forEach((response) => {
            array.push(response.json()
              .then(json => Promise.resolve(json.image)));
          });

          Promise.all(array).then((images) => {
            panel.outputResponse(['Proceeding to add text data to each image.']);

            const { gallery } = assetData;
            const saveData = {};
            const imageData = {};

            gallery.childNodes.forEach((child) => {
              // eslint-disable-next-line prefer-destructuring
              saveData[child.tagName] = child.childNodes[0];
            });
            images.forEach((name) => {
              imageData[name] = {
                title: `Title for ${name}`,
                description: `Description for ${name}`,
                caption: `Caption for ${name}`,
                link: '#link',
              };
            });

            saveData.images = JSON.stringify(imageData);
            saveData.asset = assetData.asset;
            saveData.type = assetData.type;
            const saveCall = ouapi.post('/assets/save', saveData);
            console.log(imageData);
            console.log(saveData);
            console.log(saveCall);
          });
        });
      });
    },
    async addImage(params = {}) {
      const { filepath, assetData } = params;
      const img = new Image();
      const dataURItoBlob = (dataURI) => {
        // convert base64/URLEncoded data component to raw binary data held in a string
        const regex = /^data:(\w+\/\w+);base64,([\w\W]+$)/;
        const matches = regex.exec(dataURI);
        if (matches !== null) {
          const mime = matches[1];
          const byteString = atob(matches[2]);

          // write the bytes of the string to a typed array
          const ia = new Uint8Array(byteString.length);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }

          return new Blob([ia], { type: mime });
        }
        return null;
      };

      // TODO: research
      // wrapping the img.onload event listener in a promise may not be ideal
      const promise = new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          context.drawImage(img, 0, 0);

          const filename = filepath.split('/').pop();
          const dataURL = canvas.toDataURL('image/jpeg');
          const blob = dataURItoBlob(dataURL);

          const urlParams = new URLSearchParams();
          urlParams.set('asset', assetData.asset);
          urlParams.set('image', filename);
          urlParams.set('site', assetData.site);
          urlParams.set('thumb_width', assetData.gallery.childNodes[1].childNodes[0]);
          urlParams.set('thumb_height', assetData.gallery.childNodes[2].childNodes[0]);
          const formData = new FormData();
          formData.set('name', filename);
          formData.set('file', blob, filename);

          resolve(fetch(`${ouapi.config.apihost}/assets/add_image?${urlParams.toString()}`, {
            method: 'post',
            body: formData,
          }).then((response) => {
            panel.outputResponse([`> Added ${filename} to the gallery.`]);
            return response;
          }));
        };
      });
      img.src = filepath;
      return promise;
    },
  };
}
