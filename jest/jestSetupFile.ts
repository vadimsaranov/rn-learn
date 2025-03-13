import 'react-native-gesture-handler/jestSetup.js';
import { mockedExpoSqliteNext } from './ExpoSqliteNextMock';

jest.mock(`${__dirname}/../node_modules/expo-sqlite/build/ExpoSQLite`, () => mockedExpoSqliteNext);
jest.mock(`${__dirname}/../node_modules/expo-sqlite/build/pathUtils`, () => ({
  createDatabasePath: jest.fn().mockImplementation((databaseName: string) => {
    return databaseName;
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons');
