const hooks = require('../spector.conf');

exports.beforeEach = client => (
  new Promise((resolve, reject) => {
    const hook = hooks.beforeEach;
    if (hook) return hook(client, resolve, reject);
    return resolve();
  })
);

exports.before = (client, path) => (
  new Promise((resolve, reject) => {
    const hook = hooks.before && hooks.before(client, resolve, reject)[path];
    if (hook) return hook();
    return resolve();
  })
);
