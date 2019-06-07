// import {List} from 'immutable';
// // const ipcRenderer = require('electron').ipcRenderer;
// // const pg = require('electron').remote.require('pg');
// import pg  from 'pg';
// import {Client} from 'pg'

// const client = new Client({
//    connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
// })

// client.connect()

// function formatFilter(filter) {
//   let operator = '';
//   let value = filter.get('value');
//   switch (filter.get('operator')) {
//     case '<':
//       operator = '<';
//       value = `'${value}'`;
//       break;
//     case '>':
//       operator = '>';
//       value = `'${value}'`;
//       break;
//     case '=':
//       operator = '=';
//       value = `'${value}'`;
//       break;
//     case '≠':
//       operator = '<>';
//       value = `'${value}'`;
//       break;
//     case '≤':
//       operator = '<=';
//       value = `'${value}'`;
//       break;
//     case '≥':
//       operator = '>=';
//       value = `'${value}'`;
//       break;
//     case 'contains':
//       operator = 'LIKE';
//       value = `'%${value}%'`;
//       break;
//     case 'does not contains':
//       operator = 'NOT LIKE';
//       value = `'%${value}%'`;
//       break;
//     case 'is exactly':
//       operator = 'LIKE';
//       value = `'${value}'`;
//       break;
//     case 'is not exactly':
//       operator = 'NOT LIKE';
//       value = `'${value}'`;
//       break;
//     case 'begins with':
//       operator = 'LIKE';
//       value = `'${value}%'`;
//       break;
//     case 'ends with':
//       operator = 'LIKE';
//       value = `'%${value}'`;
//       break;
//     case 'is':
//       operator = 'IS';
//       break;
//     default:
//       operator = 'LIKE';
//       value = '\'%%\'';
//   }
//   return [operator, value];
// }

// export default class DB {
//   static createConnectUrl(params) {
//     return `postgres://${params.user}:${params.password}@${params.address}:${params.port}/${params.database}?ssl=true`;
//   }

//   static connect(params, callback) {
//     this.connectDB(this.createConnectUrl(params), params.useSSL, callback);
//   }

//   static connectDB(connectUrl, useSSL, callback) {
//     pg.defaults.ssl = useSSL;
//     pg.connect(connectUrl, (err, client, done) => {
//       let errorMessage = '';
//       this.client = client;
//       this.done = done;
//       let isConnected = true;
//       this.handleError(err);
//       if (err) {
//         isConnected = false;
//         errorMessage = err.message;
//       }
//       callback.apply(null, [isConnected, errorMessage, false]);
//     });
//   }

//   static disconnectDB() {
//     if (this.client) {
//       this.client.end();
//     }
//   }

//   static getTables() {
//     return new Promise((resolve, reject) => {
//       const query =
//         `SELECT table_name
//          FROM information_schema.tables
//          WHERE table_schema='public'
//          AND table_type='BASE TABLE'`;
//       this.client.query(query, (err, result) => {
//         this.handleError(err);

//         if (err) {
//           reject(err);
//         }

//         const tables = result.rows;

//         tables.sort((a, b) => {
//           if (a.table_name > b.table_name) {
//             return 1;
//           }
//           if (b.table_name > a.table_name) {
//             return -1;
//           }
//           return 0;
//         });

//         resolve(tables);
//       });
//     });
//   }

//   static getForeignKeys(tables) {
//     return new Promise((resolve, reject) => {
//       const tablesWithRefs = [...tables];
//       const fKeyQuery =
//         `SELECT information_schema.constraint_column_usage.constraint_name AS conname,
//   information_schema.key_column_usage.column_name AS colname,
//   information_schema.key_column_usage.table_name AS tablename,
//   information_schema.constraint_column_usage.column_name AS refer_colname,
//   information_schema.constraint_column_usage.table_name AS refer_tablename
//   FROM information_schema.constraint_column_usage, information_schema.key_column_usage
//   WHERE information_schema.key_column_usage.constraint_name =
//   information_schema.constraint_column_usage.constraint_name AND
//   information_schema.key_column_usage.table_name <>
//   information_schema.constraint_column_usage.table_name`;
//       this.client.query(fKeyQuery, (err, res) => {
//         if (err) {
//           reject(err);
//         }
//         tablesWithRefs.forEach((table) => {
//           // eslint-disable-next-line no-param-reassign
//           table.foreignKeys = res.rows.filter(row => row.tablename === table.table_name);
//         });
//         resolve(tablesWithRefs);
//       });
//     });
//   }

//   static getReferences(foreignKeys) {
//     return new Promise((resolve, reject) => {
//       const data = [];
//       if (foreignKeys.length) {
//         foreignKeys.forEach((fKey, i) => {
//           const referenceQuery =
//             `SELECT * FROM information_schema.key_column_usage
//             WHERE constraint_name = '${fKey.name}'`;
//           this.client.query(referenceQuery, (error, result) => {
//             if (error) {
//               reject(error);
//             }
//             data.push(result.rows[0]);
//             if (i === foreignKeys.length - 1) {
//               resolve(data);
//             }
//           });
//         });
//       } else {
//         resolve([]);
//       }
//     });
//   }

//   static getPrimaryKeys(tableName) {
//     return new Promise((resolve, reject) => {
//       const primarykeyQuery = `SELECT column_name
//  FROM pg_constraint, information_schema.constraint_column_usage
//  WHERE contype = 'p' AND information_schema.constraint_column_usage.table_name = '${tableName}'
//  AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`;
//       this.client.query(primarykeyQuery, (err, res) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(res.rows);
//       });
//     });
//   }

//   static getTableConstraints(tableName) {
//     return new Promise((resolve, reject) => {
//       const columnConstraintQuery =
//         `SELECT pg_constraint.conname AS constraintName, column_name AS columnName,
//  pg_constraint.contype AS contype, pg_constraint.consrc AS consrc
//  FROM information_schema.constraint_column_usage, pg_constraint
//  WHERE table_name = '${tableName}'
//  AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`;
//       const constraints = [];
//       this.client.query(columnConstraintQuery, (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         if (!result.rows.length) {
//           resolve([]);
//         }
//         result.rows.forEach((constraint, i) => {
//           constraints.push({
//             name: constraint.constraintname,
//             column: constraint.columnname,
//             type: constraint.contype,
//             source: constraint.consrc,
//             table: tableName,
//           });
//           if (i === result.rows.length - 1) {
//             resolve(constraints);
//           }
//         });
//       });
//     });
//   }

//   static getTableIndexes(tableName) {
//     return new Promise((resolve, reject) => {
//       const query =
//         `SELECT indexname, indexdef
//         FROM pg_indexes
//         WHERE tablename = '${tableName}'`;
//       this.client.query(query, (err, res) => {
//         if (err) reject(err);
//         resolve(res);
//       });
//     });
//   }

//   static getTableOid(tables) {
//     return new Promise((resolve, reject) => {
//       const tablesWithOids = [];
//       tables.forEach((table, i) => {
//         const oidQuery =
//           `SELECT oid FROM pg_class WHERE relname = '${table.table_name}' AND relkind = 'r'`;
//         this.client.query(oidQuery, (error, res) => {
//           if (error) {
//             reject(error);
//           }
//           tablesWithOids.push({...table, oid: res.rows[0].oid});
//           if (i === tables.length - 1) {
//             resolve(tablesWithOids);
//           }
//         });
//       });
//     });
//   }

//   static getNotNullConstraints(columns, oid) {
//     return new Promise((resolve, reject) => {
//       const constraints = [];
//       if (columns) {
//         const columnsIter = columns.entries();
//         for (const entry of columnsIter) {
//           const [i, column] = entry;
//           const notNullConstraintQuery = `SELECT attnotnull as isNotNull FROM pg_attribute
// WHERE attname = '${column.get('columnname')}' AND attrelid = ${oid}`;
//           this.client.query(notNullConstraintQuery, (error, res) => {
//             if (error) {
//               reject(error);
//             }
//             if (res.rows[0].isnotnull) {
//               constraints.push({
//                 name: '',
//                 type: 'nn',
//                 column: column.get('columnname')
//               });
//             }
//             if (i === columns.size - 1) {
//               resolve(constraints);
//             }
//           });
//         }
//       }
//     });
//   }

//   static getTableContent(params) {
//     return new Promise((resolve, reject) => {
//       const page = params.page || 1;
//       const offset = (page - 1) * 100;
//       let totalCount = 0;

//       /[> SORTING <]/
//       const order = params.order || [];
//       let orderQuery = '';
//       if (order.length) {
//         orderQuery = 'ORDER BY ';
//         orderQuery += `"${order[0].index}" ${order[0].sortType}, `;
//       }
//       // ********* //

//       /[> FILTERING <]/
//       const filters = params.filters || new List();
//       let filterQuery = '';
//       if (filters.size === 1) {
//         const filter = filters.get(0);
//         if (filter.get('column') !== '' &&
//           filter.get('operator') !== '' &&
//           filter.get('value') !== '') {
//           const [operator, value] = formatFilter(filter);
//           const suffix = filter.get('suffix') || '';
//           filterQuery = `WHERE "${filter.get('column')}"${suffix} ${operator} ${value}`;
//         }
//       } else if (filters.size > 1) {
//         filterQuery = 'WHERE ';
//         for (const filter of filters.values()) {
//           if (!(filter.get('column') === '' ||
//             filter.get('operator') === '' ||
//             filter.get('value') === '')) {
//             const [operator, value] = formatFilter(filter);
//             const suffix = filter.get('suffix') || '';
//             filterQuery += `"${filter.get('column')}"${suffix} ${operator} ${value} \n\t AND `;
//           }
//         }
//         filterQuery = filterQuery.slice(0, -4);
//       }
//       //  *********  //

//       orderQuery = orderQuery.slice(0, -2);
//       const countQuery = `SELECT COUNT(*) FROM "${params.tableName}" ${filterQuery}`;
//       this.client.query(countQuery, (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         totalCount = parseInt(result.rows[0].count, 10);
//         const query = `
//         SELECT * FROM "${params.tableName}" ${filterQuery} ${orderQuery}
//         LIMIT 100 OFFSET 100`;
//         this.client.query(query, (error, res) => {
//           if (error) {
//             reject(error);
//           }
//           const rows = res.rows;
//           resolve({
//             rows,
//             totalCount,
//             order,
//             page
//           });
//         });
//       });
//     });
//   }

//   static getTableStructure(tableName) {
//     return new Promise((resolve) => {
//       const structureQuery = `
//             SELECT COLUMN_NAME AS ColumnName, DATA_TYPE AS DataType,
//             CHARACTER_MAXIMUM_LENGTH AS CharacterLength, COLUMN_DEFAULT as DefaultValue
//             FROM INFORMATION_SCHEMA.COLUMNS
//             WHERE TABLE_NAME = '${tableName}'`;
//       this.client.query(structureQuery, (titleError, resStructure) => {
//         this.handleError(titleError);
//         resolve(resStructure.rows);
//       });
//     });
//   }

//   static updateCells(params) {
//     return new Promise((resolve, reject) => {
//       const update = [];
//       params.forEach((param, i) => {
//         this.client.query(param.query, (err, res) => {
//           if (err) {
//             reject(`${err}`);
//           } else if (res) {
//             update.push({
//               type: param.query.substr(0, 6),
//               updated: res.rows[0]
//             });
//           }
//           if (i === params.length - 1) {
//             resolve(update);
//           }
//         });
//       });
//     });
//   }

//   static insertRow(params) {
//     return new Promise((resolve, reject) => {
//       const query = `INSERT INTO ${params.tableName} DEFAULT VALUES;`;
//       this.client.query(query, (err, result) => {
//         if (err) {
//           reject(`${err}`);
//         }
//         resolve(result);
//       });
//     });
//   }

//   static createTable(tableName) {
//     return new Promise((resolve, reject) => {
//       const query = `CREATE TABLE ${tableName}
//  (id SERIAL PRIMARY KEY);`;
//       this.client.query(query, (err, result) => {
//         if (err) {
//           reject(`${err}`);
//         }
//         resolve(result);
//       });
//     });
//   }

//   static truncateTable(tableName, restartIdentity) {
//     return new Promise((resolve, reject) => {
//       const query = `TRUNCATE ${tableName} ${restartIdentity ? 'RESTART IDENTITY' : ''}`;
//       this.client.query(query, (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(result);
//       });
//     });
//   }

//   static dropTable(tableName) {
//     return new Promise((resolve, reject) => {
//       const query = `DROP TABLE ${tableName}`;
//       this.client.query(query, (err, result) => {
//         if (err) {
//           reject(`${err}`);
//         }
//         resolve(result);
//       });
//     });
//   }

//   static handleError(err) {
//     if (err) {
//       pg.end();
//     }
//   }
// }


// // import {Client} from 'pg';
// // 
// // const client = new Client({
// //   connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
// // })
// // client.connect()
// // 
// // // the final table object reference
// // //
// // // {
// // //   "name": "customers",
// // //   "columns": [
// // //     {"column_name":"id","data_type":"integer"}
// // //     {"column_name":"name","data_type":"character varying"}
// // //     {"column_name":"age","data_type":"integer"}
// // //     {"column_name":"address","data_type":"character"}
// // //     {"column_name":"salary","data_type":"numeric"}
// // //   ],
// // //   "primaryKey": {"column_name":"id","ordinal_position":1}
// // //   "foreignKeys": []
// // // }
// // //
// // 
// // export default class Db {
// //   static getPrimaryKey(tableToQuery) {
// //     client.query(`
// //       SELECT
// //         c.column_name,
// //         c.ordinal_position
// //       FROM
// //         information_schema.key_column_usage AS c
// //         LEFT JOIN
// //           information_schema.table_constraints AS t
// //           ON t.constraint_name = c.constraint_name
// //       WHERE
// //         t.table_name = '${tableToQuery}'
// //         AND t.constraint_type = 'PRIMARY KEY';
// //     `, (err, res) => {
// //         console.log(err, 'got response from getPrimaryKeys')
// //         client.end()
// //       })
// //   }
// // 
// //   static getForeignKeys(tableToQuery) {
// //     client.query(`
// //       SELECT
// //       tc.table_schema,
// //       tc.constraint_name,
// //       tc.table_name,
// //       kcu.column_name,
// //       ccu.table_schema AS foreign_table_schema,
// //       ccu.table_name AS foreign_table_name,
// //       ccu.column_name AS foreign_column_name
// //     FROM
// //       information_schema.table_constraints AS tc
// //       JOIN
// //         information_schema.key_column_usage AS kcu
// //         ON tc.constraint_name = kcu.constraint_name
// //         AND tc.table_schema = kcu.table_schema
// //       JOIN
// //         information_schema.constraint_column_usage AS ccu
// //         ON ccu.constraint_name = tc.constraint_name
// //         AND ccu.table_schema = tc.table_schema
// //     WHERE
// //       tc.constraint_type = 'FOREIGN KEY'
// //       AND tc.table_name = '${tableToQuery}';
// //     `, (err, res) => {
// //         console.log(err, 'got response from get foreing keys')
// //         client.end()
// //       })
// //   }
// // 
// //   static getColumns(tableToQuery) {
// //     client.query(`
// //       select
// //         COLUMN_NAME,
// //         DATA_TYPE
// //       from
// //         INFORMATION_SCHEMA.COLUMNS
// //       where
// //         TABLE_NAME = '${tableToQuery}'
// //     `, (err, res) => {
// //         console.log(err, 'got response from get columns')
// // 
// //         client.end()
// //       })
// //   }
// // 
// //   static composeTableData() {
// //     this.getTableNames()
// //   }
// // 
// //   static getTableNames() {
// //     client.query(`
// //       SELECT
// //         table_name
// //       FROM
// //         information_schema.tables
// //       WHERE
// //         table_schema = 'public'
// //         AND table_type = 'BASE TABLE'
// //     `, (err, res) => {
// //         if (err) console.error(err)
// //         console.log('got response from get table names')
// //         // gets the response's array of table objects 
// //         const tableNames = res.rows
// // 
// //         // assign a new property to the first objecg
// //         // returns: { table_name: 'projects', newProperty: 'hey a new property' }
// //         tableNames[0].newProperty = 'hey a new property'
// // 
// //         console.log('table name 1', tableNames[0]['table_name'])
// // 
// //         // postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq
// //         this.getPrimaryKey('orders')
// // 
// //         client.end()
// //       })
// //   }
// // }
// // 
