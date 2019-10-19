const path = require('path');

const siblingPackages = [];

module.exports = {
  plugins: [
    {
      func: require('@golden-stack/razzle-plugin'),
      options: { include: siblingPackages.map(package => path.join(__dirname, '..', package)) },
    },
  ],
};
