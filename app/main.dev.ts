/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
// const { Client } = require('pg');
// import db from '../db';
import { Client } from 'pg';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();

      const getTables = () => {
        return new Promise((resolve, reject) => {
          const client = new Client({
            connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
          })
          client.connect()

          const query =
            `SELECT table_name
					 FROM information_schema.tables
					 WHERE table_schema='public'
           AND table_type='BASE TABLE'`;

          client.query(query, (err, result) => {
            if (err) {
              reject(err);
            }

            const tables = result.rows;

            tables.sort((a, b) => {
              if (a.table_name > b.table_name) {
                return 1;
              }
              if (b.table_name > a.table_name) {
                return -1;
              }
              return 0;
            });

            resolve(tables);
          });
        });
      }

      const getForeignKeys = (table) => {
        return new Promise((resolve, reject) => {
          const client = new Client({
            connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
          })
          client.connect()

          const fKeyQuery =
            `SELECT
								 tc.table_schema,
								 tc.constraint_name,
								 tc.table_name,
								 kcu.column_name,
								 ccu.table_schema AS foreign_table_schema,
								 ccu.table_name AS foreign_table_name,
								 ccu.column_name AS foreign_column_name
							 FROM
								 information_schema.table_constraints AS tc
								 JOIN
									 information_schema.key_column_usage AS kcu
									 ON tc.constraint_name = kcu.constraint_name
									 AND tc.table_schema = kcu.table_schema
								 JOIN
									 information_schema.constraint_column_usage AS ccu
									 ON ccu.constraint_name = tc.constraint_name
									 AND ccu.table_schema = tc.table_schema
							 WHERE
								 tc.constraint_type = 'FOREIGN KEY'
                 AND tc.table_name = '${table}'`

          client.query(fKeyQuery, (err, res) => {
            if (err) reject(err);

            resolve(res.rows);
          });
        });
      }

      const getTableColumns = (tableName) => {
        return new Promise((resolve) => {
          const client = new Client({
            connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
          })
          client.connect()

          const query = `
							SELECT COLUMN_NAME AS ColumnName,
								DATA_TYPE AS DataType,
								CHARACTER_MAXIMUM_LENGTH AS CharacterLength,
								COLUMN_DEFAULT as DefaultValue
							FROM INFORMATION_SCHEMA.COLUMNS
              WHERE TABLE_NAME = '${tableName}'`;

          client.query(query, (err, res) => {
            if (err) console.error(err)
            resolve(res.rows);
          });

        });
      }

      // #TODO: return only the string value
      const getPrimaryKey = (tableName: string) => {
        return new Promise((resolve, reject) => {
          const client = new Client({
            connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
          })

          client.connect()

          const primarykeyQuery = `SELECT column_name
		 FROM pg_constraint, information_schema.constraint_column_usage
		 WHERE contype = 'p' AND information_schema.constraint_column_usage.table_name = '${tableName}'
     AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`;

          client.query(primarykeyQuery, (err, res) => {
            if (err) {
              reject(err)
            }

            resolve(res.rows[0].column_name);
          });
        });
      }

      // const client = new Client('postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true');

      // client.connect((err, result) => {
      //   if (err) {
      //     console.error(err)
      //   } else {

      // the final table object reference

      // const tableData = [
      //   {
      //     "table_name": "customers",
      //     "columns": [
      //       {
      //         columnname: 'id',
      //         datatype: 'integer',
      //         characterlength: null,
      //         defaultvalue: 'nextval(\'projects_id_seq\'::regclass)'
      //       },
      //       {
      //         columnname: 'user_id',
      //         datatype: 'integer',
      //         characterlength: null,
      //         defaultvalue: null
      //       },
      //       {
      //         columnname: 'name',
      //         datatype: 'character varying',
      //         characterlength: null,
      //         defaultvalue: null
      //       },
      //       {
      //         columnname: 'created_at',
      //         datatype: 'date',
      //         characterlength: null,
      //         defaultvalue: 'now()'
      //       }
      //     ],
      //     "primaryKey": "id",
      //     "foreignKeys": [
      //       {
      //         table_schema: 'public',
      //         constraint_name: 'projects_user_id_fkey',
      //         table_name: 'projects',
      //         column_name: 'user_id',
      //         foreign_table_schema: 'public',
      //         foreign_table_name: 'users',
      //         foreign_column_name: 'id',
      //       }
      //     ]
      //   },
      //   {
      //     "table_name": "customers",
      //     "columns": [
      //       {
      //         columnname: 'id',
      //         datatype: 'integer',
      //         characterlength: null,
      //         defaultvalue: 'nextval(\'users_id_seq\'::regclass)'
      //       },
      //       {
      //         columnname: 'first_name',
      //         datatype: 'character varying',
      //         characterlength: null,
      //         defaultvalue: null
      //       },
      //       {
      //         columnname: 'last_name',
      //         datatype: 'character varying',
      //         characterlength: null,
      //         defaultvalue: null
      //       },
      //       {
      //         columnname: 'email',
      //         datatype: 'character varying',
      //         characterlength: null,
      //         defaultvalue: null
      //       }
      //     ],
      //     "primaryKey": "id",
      //     "foreignKeys": []
      //   }
      // ]

      // getTables()
      //   .then(y => console.log('return value of getTables', y))

      // getTableColumns(`users`)
      //   .then(x => console.log('return value of getTableColumns', x))

      // getForeignKeys(`users`)
      //   .then(x => console.log('return value of getForeignKey', x))

      // How to async await inside loops
      // const start = async () => {
      //   await asyncForEach([1, 2, 3], async (num) => {
      //     await waitFor(50);
      //     console.log(num);
      //   });
      //   console.log('Done');
      // }
      // start();


      const getTableNames = async () => {
        const tableNames = await getTables()
        return tableNames
      }

      // Takes table_name object, returns fully populated table object
      const composeTableData = async () => {
        let tablesArr = []
        const tableNames = await getTableNames()

        for (let table of tableNames) {
          table.primaryKey = await getPrimaryKey(table.table_name)
          table.foreignKey = await getForeignKeys(table.table_name)
          table.columns = await getTableColumns(table.table_name)

          tablesArr.push(table)
        }
        
        return tablesArr
      }

      composeTableData()
        .then(r => console.log('composeTableData() then is:', JSON.stringify(r, null, 2)))
        .catch(err => console.log('then err is:', err))

      // console.log('FINAL output of composeAllTables invocation:', composeTableData())
      // .then(r => console.log('FINAL output of composeAllTables invocation:', r))
      // .catch(err => console.log('oops:', err))
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  new AppUpdater();
});
