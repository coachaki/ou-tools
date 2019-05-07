/* global ouapi */

if (typeof ouapi === 'object') {
  ouapi.assets = {
    entries: [],
    list(count = 10000) {
      return ouapi.get('/assets/list', { count }).then((response) => {
        this.entries = response.entries;
      });
    },
    get(asset) {
      return ouapi.get('/assets/view', { asset }).then(response => response);
    },
    new(params = { name: `New Asset ${Math.floor(Math.random() * 10000)}`, type: 0 }) {
      return ouapi.post('/assets/new', params).then(response => response);
    },
    newForm(params = {}) {
      const postData = Object.assign({}, params, { type: 4, site_locked: true });
      return ouapi.post('/assets/new', postData).then(response => response);
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
      return ouapi.post('/assets/new', postData).then(response => response);
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
      return ouapi.post('/assets/new', postData).then(response => response);
    },
  };
}
