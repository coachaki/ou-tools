if (typeof config === 'object') {
  config.actions = {
    name: 'actions.js',
    version: '0.1',
    actions: [
      {
        name: 'dev-setup',
        text: 'Development Setup',
        type: 'list',
        list: [
          {
            name: 'make-user',
            text: 'Make User',
            type: 'action',
            action: ['makeUser'],
          },
        ],
      },
    ],
  };
}
