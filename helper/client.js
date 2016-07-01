const log = require('./log');

exports.initialize = (client, url) => (
  new Promise((resolve) => {
    client
      .goto(url)
      .inject('css', 'init.css')
      .viewport(1280, 768)
      .wait('body')
      .scrollTo(999999, 0)
      .scrollTo(0, 0)
      .then(res => {
        log.debug('initialized');
        log.debug(`url = ${url}`);
        resolve(res);
      })
      .catch(err => log.error(err));
  })
);

exports.getDimmensions = client => (
  new Promise((resolve) => {
    client
      .evaluate(() => {
        const body = document.querySelector('body');
        return {
          height: body.scrollHeight + window.outerHeight - window.innerHeight,
          width: body.scrollWidth,
        };
      })
      .then(res => {
        log.debug('get dimensions');
        log.debug(res);
        resolve(res);
      })
      .catch(err => log.error(err));
  })
);

exports.getHrefs = client => (
  new Promise((resolve) => {
    client
      .evaluate(() => {
        const links = [].slice.call(document.querySelectorAll('a'));
        return links.map(link => link.href);
      })
      .then(res => {
        log.debug('get Hrefs');
        log.debug(`href number = ${res.length}`);
        resolve(res);
      })
      .catch(err => log.error(err));
  })
);

exports.capture = (client, { width, height }, path) => (
  new Promise((resolve) => {
    client
      .viewport(width, height)
      .screenshot(path)
      .then(res => {
        log.debug('captured');
        resolve(res);
      })
      .catch(err => log.error(err));
  })
);
