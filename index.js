'use strict';

const fs = require('fs');
const webdriverio = require('webdriverio');
const co = require('co');
const selenium = require('selenium-standalone');
const log = require('./helper/log');
const cli = require('./helper/cli');
const client = webdriverio.remote({ desiredCapabilities: { browserName: 'firefox' } });
const moment = require('moment');
const { initialize, capture, getLinks } = require('./helper/client');
const { beforeEach, before } = require('./helper/hooks');

const isValidPath = (href, i, self, capturedPath) => (
  new RegExp(`^${cli.flags.url}|^(?!http)`).test(href) &&
  new RegExp('^(?!mailto)').test(href) &&
  self.indexOf(href) === i &&
  capturedPath.indexOf(href) === -1
);

selenium.start(() => {
  const capturedPath = [];
  const date = moment().format('YYYYMMDDHHmmss');
  const name = `${cli.flags.url}`.replace(/https?:\/\//, '');
  try {
    fs.mkdirSync(`data/${name}`);
  } catch (e) {
    if (e.code === 'EEXIST') log.info('Project directory detected.');
  }
  fs.mkdirSync(`data/${name}/${date}`);
  const run = co.wrap(function * (url, depth) {
    if (depth && depth > cli.flags.depth) return;
    log.debug(`Current depth = ${depth}`);
    yield initialize(client, url);
    yield beforeEach(client);
    yield before(client, url);
    yield capture(client, `data/${name}/${date}/_${url.replace(cli.flags.url, '').replace(/\//g, '_')}.png`);
    const hrefs = yield getLinks(client);
    capturedPath.push(url);
    const validHrefs = hrefs.filter((href, i, self) => (
      isValidPath(href, i, self, capturedPath)
    ));
    log.debug('===== deteced path ======');
    log.debug(validHrefs);
    for (const [i, href] of validHrefs.entries()) {
      yield run(href, depth + 1, i);
    }
  });
  client.init()
    .then(() => {
      run(cli.flags.url, 0)
        .then(() => {
          log.info('complete');
          client.end().then(() => process.exit());
        });
    });
});
