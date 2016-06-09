'use strict';

const webdriverio = require('webdriverio');
const selenium = require('selenium-standalone');
const log = require('./lib/helper/log');
const meow = require('meow');

const cli = meow(`
	Usage
	  $ foo <input>

	Options
	  -r, --rainbow  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
`, {
  alias: {
    r: 'rainbow',
  },
});

console.log(cli.flags);

selenium.start((err, child) => {
  child.stderr.on('data', data => {
    log.error(data.toString());
  });

  webdriverio
    .remote({
      desiredCapabilities: {
        browserName: 'firefox',
      },
    })
    .init()
    .url('https://www.npmjs.com/')
    .waitForExist('body', 2000)
    .getAttribute('a', 'href')
    .then(attr => {
      log.debug(attr);
    })
    .saveScreenshot('./screenshot/snapshot.png');
});
