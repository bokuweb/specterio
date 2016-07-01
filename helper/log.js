const log = require('loglevel');

if (process.env.NODE_ENV !== 'production') {
  log.setLevel('debug');
} else {
  log.setLevel('info');
}

module.exports = log;
