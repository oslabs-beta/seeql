const { ipcRenderer } = require("electron");
const { Client } = require("pg");
const composeTableData = require("./db");

let client = null;

ipcRenderer.on("uri-to-db", (event, uri) => {
  client = new Client(uri);
  client.connect(err => {
    if (err) ipcRenderer.send("db-connection-error", "Unable to connect");
    else {
      composeTableData(client)
        .then(databaseTables => {
          ipcRenderer.send("database-tables-to-main", databaseTables);
        })
        .catch(err =>
          ipcRenderer.send(
            "db-connection-error",
            "Unable to retrieve database information"
          )
        );
    }
  });
});

ipcRenderer.on("query-to-db", (event, query) => {
  client.query(query)
    .then(result => console.log('query result in query.tsx:', result.rows))
    .catch(err => console.log('query err in query.tsx:', err));
});

