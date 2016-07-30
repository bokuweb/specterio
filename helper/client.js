const log = require('./log');

exports.initialize = (client, url) => (
  new Promise((resolve) => {
    client
      .url(url)
      .waitForExist('body', 60000)
      .then(resolve)
      .catch(err => log.error(err));
  })
);

exports.capture = (client, name) => (
  new Promise((resolve) => {
    client
      .saveScreenshot(name)
      .then(resolve)
      .catch(err => log.error(err));
  })
);

exports.getLinks = (client) => (
  new Promise((resolve) => {
    client
      .getAttribute('a', 'href')
      .then(resolve)
      .catch(err => log.error(err));
  })
);
