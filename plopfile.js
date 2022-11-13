const { serviceGeneration } = require('./automation');
const serviceConfig = require('./automation/config/service');

module.exports = function (plop) {
  plop.setWelcomeMessage('Welcome to your Backend CLI! What are you aiming to do?');

  plop.setActionType('serviceCreation', function (data) {
    return new Promise((resolve, reject) => {
      serviceGeneration(data, resolve, reject);
    });
  });

  plop.setGenerator('Create new Service', serviceConfig);
  plop.setGenerator('Kill Service', {});
};
