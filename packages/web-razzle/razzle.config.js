const path = require('path');

const siblingPackages = ['relay-ssr', 'relay-web'];

module.exports = {
  plugins: [
    {
      func: require('@golden-stack/razzle-plugin'),
      options: { include: siblingPackages.map(package => path.join(__dirname, '..', package)) },
    },
  ],
};
