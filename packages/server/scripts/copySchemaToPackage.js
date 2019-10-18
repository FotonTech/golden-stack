import fs from 'fs';

import { PROJECT } from '../src/common/config';

const copySchemaToPackage = (schemaFolderSrc, schemaFileDest) => {
  try {
    fs.copyFileSync(schemaFolderSrc, schemaFileDest);
    // eslint-disable-next-line
    console.info(`Schema successfully copied to: ${schemaFileDest}`);
  } catch (error) {
    // eslint-disable-next-line
    console.error(`Error while trying to copy schema to: ${schemaFileDest}`, error);
  }
};

const runScript = () => {
  // web, app
  copySchemaToPackage(PROJECT.GRAPHQL_SCHEMA_FILE, `../schemas/${PROJECT.GRAPHQL}/schema.graphql`);
};

(() => {
  runScript();
})();
