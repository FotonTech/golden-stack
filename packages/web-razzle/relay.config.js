const packages = ['web-razzle'];

module.exports = {
  watchman: false,
  src: '../.',
  schema: '../schemas/graphql/schema.graphql',
  language: 'typescript',
  include: [...packages.map(pkg => `./${pkg}/src/**`)],
};
