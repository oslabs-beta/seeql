const { ipcRenderer } = require('electron');
const { Client } = require('pg');
const composeTableData = require('./db');

let client = null;

ipcRenderer.on('uri-to-db', (event, uri) => {
  client = new Client(uri);
  client.connect(err => {
    if (err) ipcRenderer.send('db-connection-error', 'Unable to connect');
    else {
      composeTableData(client)
        .then(databaseTables => {
          ipcRenderer.send('database-tables-to-main', databaseTables);
        })
        .catch(err =>
          ipcRenderer.send(
            'db-connection-error',
            'Unable to retrieve database information'
          )
        );
    }
  });
});

ipcRenderer.on("query-to-db", (event, query) => {
  if (query.slice(0, 6).toUpperCase() === 'SELECT') {
    if (query.indexOf(';') > -1) query = query.slice(0, query.indexOf(';'))
    query += ';';
    client.query(query)
      .then(result => ipcRenderer.send('query-result-to-main', { statusCode: 'Success', message: result.rows }))
      .catch(err => ipcRenderer.send('query-result-to-main', { statusCode: 'Syntax Error', message: 'Issue getting data from db', err }));
  } else {
    ipcRenderer.send('query-result-to-main', { statusCode: 'Invalid Request', message: 'Invalid query input. The query can only be a SELECT statement.' })
  }
});

ipcRenderer.on('logout', (_event, message) => {
  client.end()
  client = null;
  ipcRenderer.on('login-mounted', () => ipcRenderer.send('inactivity-logout', 'logged out'));
});