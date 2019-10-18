const path = require('path');
module.exports = () => {
  // eslint-disable-next-line
  console.log('\n# GLOBAL TEST SETUP #');

  // normalize timezone to UTC
  process.env.TZ = 'UTC';

  // fix dotenv-safe loading of example by setting the cwd
  process.chdir(path.resolve(path.join(__dirname, '..')));
};
