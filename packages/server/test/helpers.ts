import { fromGlobalId } from 'graphql-relay';
import mongoose from 'mongoose';

import { getContext } from './getContext';
const { ObjectId } = mongoose.Types;

process.env.NODE_ENV = 'test';

const mongooseOptions = {
  autoIndex: false,
  autoReconnect: false,
  connectTimeoutMS: 20000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

export * from './createResource/createRows';

// Just in case you want to debug something
// mongoose.set('debug', true);

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing

export async function connectMongoose() {
  jest.setTimeout(20000);
  return mongoose.connect(global.__MONGO_URL__, {
    ...mongooseOptions,
    dbName: global.__MONGO_DB_NAME__,
  });
}

export async function clearDatabase() {
  await mongoose.connection.db.dropDatabase();
}

export async function disconnectMongoose() {
  await mongoose.disconnect();
  // dumb mongoose
  mongoose.connections.forEach(connection => {
    const modelNames = Object.keys(connection.models);

    modelNames.forEach(modelName => {
      delete connection.models[modelName];
    });

    const collectionNames = Object.keys(connection.collections);
    collectionNames.forEach(collectionName => {
      delete connection.collections[collectionName];
    });
  });

  const modelSchemaNames = Object.keys(mongoose.modelSchemas);
  modelSchemaNames.forEach(modelSchemaName => {
    delete mongoose.modelSchemas[modelSchemaName];
  });
}

export async function clearDbAndRestartCounters() {
  await clearDatabase();
  restartCounters();
}

export { getContext };

// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type Value = string | boolean | null | undefined | IValueObject | Value[] | object;
interface IValueObject {
  [x: string]: Value;
}
export const sanitizeValue = (
  value: Value,
  field: string | null,
  keys: string[],
  ignore: string[] = [],
  jsonKeys: string[] = [],
): Value => {
  // If value is empty, return `EMPTY` value so it's easier to debug
  // Check if value is boolean
  if (typeof value === 'boolean') {
    return value;
  }

  if (!value && value !== 0) {
    return 'EMPTY';
  }
  // If this current field is specified on the `keys` array, we simply redefine it
  // so it stays the same on the snapshot
  if (keys.indexOf(field) !== -1) {
    return `FROZEN-${field.toUpperCase()}`;
  }

  if (jsonKeys.indexOf(field) !== -1) {
    const jsonData = JSON.parse(value);

    return sanitizeTestObject(jsonData, keys, ignore, jsonKeys);
  }

  // if it's an array, sanitize the field
  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, null, keys, ignore));
  }

  // Check if it's not an array and can be transformed into a string
  if (!Array.isArray(value) && typeof value.toString === 'function') {
    // Remove any non-alphanumeric character from value
    const cleanValue = value.toString().replace(/[^a-z0-9]/gi, '');

    // Check if it's a valid `ObjectId`, if so, replace it with a static value
    if (ObjectId.isValid(cleanValue) && value.toString().indexOf(cleanValue) !== -1) {
      return value.toString().replace(cleanValue, 'ObjectId');
    }

    if (value.constructor === Date) {
      // TODO - should we always freeze Date ?
      return value;
      // return `FROZEN-${field.toUpperCase()}`;
    }

    // If it's an object, we call sanitizeTestObject function again to handle nested fields
    if (typeof value === 'object') {
      return sanitizeTestObject(value, keys, ignore, jsonKeys);
    }

    // Check if it's a valid globalId, if so, replace it with a static value
    const result = fromGlobalId(cleanValue);
    if (result.type && result.id && ObjectId.isValid(result.id)) {
      return 'GlobalID';
    }
  }

  // If it's an object, we call sanitizeTestObject function again to handle nested fields
  if (typeof value === 'object') {
    return sanitizeTestObject(value, keys, ignore, jsonKeys);
  }

  return value;
};

export const defaultFrozenKeys = ['id', 'createdAt', 'updatedAt'];

export const sanitizeTestObject = (
  payload: Value,
  keys = defaultFrozenKeys,
  ignore: string[] = [],
  jsonKeys: string[] = [],
) => {
  // TODO - treat array as arrays
  return (
    payload &&
    Object.keys(payload).reduce((sanitizedObj, field) => {
      const value = payload[field];

      if (ignore.indexOf(field) !== -1) {
        return {
          ...sanitizedObj,
          [field]: value,
        };
      }

      const sanitizedValue = sanitizeValue(value, field, keys, ignore, jsonKeys);

      return {
        ...sanitizedObj,
        [field]: sanitizedValue,
      };
    }, {})
  );
};

export const restartCounters = () => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce((prev, curr) => ({ ...prev, [curr]: 0 }), {});
};
