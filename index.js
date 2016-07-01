'use strict';

const webdriverio = require('webdriverio');
const co = require('co');
const selenium = require('selenium-standalone');
const log = require('./helper/log');
const clinet = webdriverio.remote({ desiredCapabilities: { browserName: 'firefox' } });

selenium.start(() => {
  const run = co.wrap(function * (url, depth, index) {
    return new Promise((resolve, reject) => {
      clinet
        .init()
        .url(url)
        .waitForExist('body', 60000)
        .getAttribute('a', 'href')
        .then(attr => log.debug(attr))
        .saveScreenshot('./screenshot/snapshot.png')
        .then(resolve)
        .catch(reject);
    });
  });

  run('https://www.npmjs.com/', 0, 0).then(() => {
    log.info('comlete');
  });
});


/*
const log = require('./helper/log');
const Nightmare = require('nightmare');
 const co = require('co');
const cli = require('./helper/cli');
const {
  initialize,
  getDimmensions,
  getHrefs,
  capture,
} = require('./helper/client');

const options = {
  show: false,
  width: 1280,
  height: 768,
};
const nightmare = new Nightmare(options);
const path = 'temp';
const capturedPath = [];

const run = co.wrap(function * (url, depth, index) {
  if (depth >= 2) return;
  log.debug(`depth = ${depth}`);
  yield initialize(nightmare, url);
  const dimensions = yield getDimmensions(nightmare);
  const hrefs = yield getHrefs(nightmare);
  yield capture(nightmare, dimensions, `${path}/${depth}-${index}.png`);
  capturedPath.push(url);
  const filterdHrefs = hrefs
          .filter((href, i, self) => (
            new RegExp(`^${cli.flags.url}|^(?!http)`).test(href) ||
            self.indexOf(href) === i ||
            capturedPath.indexOf(href) === -1
          ));
  for (const [i, href] of filterdHrefs.entries()) {
    yield run(href, depth + 1, i);
  }
  if (depth === 0) yield nightmare.end();
});

run(cli.flags.url, 0, 0).then(() => {
  log.info('comlete');
});
*/
