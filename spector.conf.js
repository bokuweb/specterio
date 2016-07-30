module.exports = {
  beforeEach: (client, done) => {
    client.then(() => {
      done();
    });
  },
  before: (client, done) => ({
    'http://npmjs.com': () => {
      client.then(() => {
        done();
      });
    },
  }),
};
