import electron from 'electron';
import path from 'path';
import fs from 'fs';

// checks if user settings file exists
const parseDataFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    return defaults;
  }
};

class AppDb {
  constructor(opts) {
    // allows both render and main process to get reference to app
    const userDataPath = (electron.app || electron.remote.app).getPath(
      'userData'
    );
    // pass a file name to config object to get full file path
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    // use sync to avoid losing data (idle state etc.)
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

export default AppDb;

