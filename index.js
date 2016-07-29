'use strict';

const webdriverio = require('webdriverio');
const co = require('co');
const selenium = require('selenium-standalone');
const log = require('./helper/log');
const cli = require('./helper/cli');
const client = webdriverio.remote({ desiredCapabilities: { browserName: 'firefox' } });
const { initialize, capture, getLinks } = require('./helper/client');

selenium.start(() => {
  const capturedPath = [];
  const run = co.wrap(function * (url, depth, index) {
    if (depth >= 2) return;
    log.debug(`depth = ${depth}`);
    yield initialize(client, url);
    yield capture(client);
    const hrefs = yield getLinks(client);
    capturedPath.push(url);
    const filterdHrefs = hrefs
            .filter((href, i, self) => (
              new RegExp(`^${cli.flags.url}|^(?!http)`).test(href) &&
              new RegExp('^(?!mailto)').test(href) &&
              self.indexOf(href) === i &&
              capturedPath.indexOf(href) === -1
            ));
    log.debug(filterdHrefs);
    for (const [i, href] of filterdHrefs.entries()) {
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
