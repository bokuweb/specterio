module.exports = {
  beforeEach: (client, done) => {
    client.then(() => {
      console.log('before each');
      done();
    });
  },
  before: (client, done) => ({
    'http://npmjs.com': () => {
      client.then(() => {
        console.log('before');
        done();
      });
    },
  }),
};
