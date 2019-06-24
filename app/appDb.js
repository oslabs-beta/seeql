import electron from 'electron';
import path from 'path';
import fs from 'fs';

// windowBounds: { width: 500, height: 562 },
// connStr:
//  '{ 
//   "connectionName":"tylersFirstSavedDatabase",
//   "connectionString":"postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true"
// }',
// 'database-tables-to-main logged': [ 
//   { columns: [Array],
//     foreignKeys: [],
//     primaryKey: 'id',
//     table_name: 'awesome_table' },
//   { columns: [Array],
//     foreignKeys: [Array],
//     primaryKey: 'id',
//     table_name: 'nodes' },
//   { columns: [Array],
//     foreignKeys: [Array],
//     primaryKey: 'id',
//     table_name: 'projects' },
//   { columns: [Array],
//     foreignKeys: [],
//     primaryKey: 'id',
//     table_name: 'users' } 
//  ],
//  readyEventFired: false,
//  userQueryHistory: [
//     
//  ], 
//  theme: "default"
//  }

const parseDataFile = async (filePath, defaults) => {
  try {
    const dataParsed = await JSON.parse(fs.readFileSync(filePath));
    return dataParsed
  } catch (error) {
    return defaults;
  }
};

class AppDb { // use sync methods to avoid losing data (idle state etc.)
  constructor(opts) {
    const userDataPath = ( // allows both render and main process to get reference to app
      electron.app || electron.remote.app
    ).getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    return fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  fetchAll() { 
    return this.data
  }
}

export default AppDb;

