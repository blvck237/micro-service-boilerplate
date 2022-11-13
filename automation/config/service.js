/* eslint-disable no-undef */
const serviceConfig = {
  description: 'Creates a new service',
  prompts: [
    {
      type: 'input',
      name: 'serviceName',
      message: 'Service Name',
      filter: function (val) {
        return val.toLowerCase();
      },
    },
    {
      type: 'list',
      name: 'database',
      message: 'Select your Database',
      choices: ['MongoDB', 'MySQL'],
      filter: function (val) {
        return val.toLowerCase();
      },
    },
    {
      type: 'confirm',
      name: 'setupTest',
      message: 'Will you need to write tests?',
      default: true,
    },
  ],
  actions: [{ type: 'serviceCreation', speed: 'slow' }],
};

module.exports = serviceConfig;
