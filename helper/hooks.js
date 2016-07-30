const hooks = require('../spector.conf');

exports.beforeEach = client => (
  new Promise((resolve, reject) => {
    hooks.beforeEach(client, resolve, reject);
  })
);

exports.before = (client, path) => (
  new Promise((resolve, reject) => {
    const hook = hooks.before && hooks.before(client, resolve, reject)[path];
    if (hook) return hook();
    return resolve();
  })
);
