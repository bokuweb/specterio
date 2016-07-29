'use strict';

const webdriverio = require('webdriverio');
const co = require('co');
const selenium = require('selenium-standalone');
const log = require('./helper/log');
const cli = require('./helper/cli');
const client = webdriverio.remote({ desiredCapabilities: { browserName: 'firefox' } });
const { initialize, capture, getLinks } = require('./helper/client');
const hooks = require('./spector.conf');

const beforeEach = client => (
  new Promise((resolve, reject) => {
    hooks.beforeEach(client, resolve, reject);
  })
);

const before = (client, path) => (
  new Promise((resolve, reject) => {
    const hook = hooks.before && hooks.before(client, resolve, reject)[path];
    if (hook) return hook();
    resolve();
  })
);

const isValidPath = (href, i, self, capturedPath) => (
  new RegExp(`^${cli.flags.url}|^(?!http)`).test(href) &&
  new RegExp('^(?!mailto)').test(href) &&
  self.indexOf(href) === i &&
  capturedPath.indexOf(href) === -1
);

selenium.start(() => {
  const capturedPath = [];
  const run = co.wrap(function * (url, depth, index) {
    if (depth >= 1) return;
    log.debug(`depth = ${depth}`);
    yield initialize(client, url);
    yield beforeEach(client);
    yield before(client, url);
    yield capture(client);
    const hrefs = yield getLinks(client);
    capturedPath.push(url);
    log.debug(cli.flags.url);
    const validHrefs = hrefs.filter((href, i, self) => (
      isValidPath(href, i, self, capturedPath)
    ));
    log.info('===== deteced path ======');
    log.info(validHrefs);
    for (const [i, href] of validHrefs.entries()) {
      yield run(href, depth + 1, i);
    }
  });
  client.init()
    .then(() => {
      run(cli.flags.url, 0, 0)
        .then(() => {
          log.info('complete');
          client.end().then(() => process.exit());
        });
    });
});
