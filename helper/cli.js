const meow = require('meow');

module.exports = meow(`
	Usage
	  $ foo <input>

	Options
	  -r, --rainbow  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
`, {
  alias: {
    u: 'url',
  },
});
