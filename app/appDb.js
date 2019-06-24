import electron from 'electron';
import path from 'path';
import fs from 'fs';

const parseDataFile = async (filePath, defaults) => {
  try {
    const dataParsed = await JSON.parse(fs.readFileSync(filePath));
    return dataParsed;
  } catch (error) {
    return defaults;
  }
};

class AppDb {
  constructor(opts) {
    // use sync methods to avoid losing data (idle state etc.)
    const userDataPath = (electron.app || electron.remote.app).getPath(
      // allows both render and main process to get reference to app
      'userData'
    );
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

  push(arr, obj) {
    return fs.writeFileSync(this.path, JSON.stringify(arr.push(obj)));
  }
  fetchAll() {
    return this.data;
  }
}

export default AppDb;
