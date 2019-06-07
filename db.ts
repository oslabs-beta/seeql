import {Client} from 'pg';

const client = new Client({
  connectionString: 'postgres://ltdnkwnbccooem:64ad308e565b39cc070194f7fa621ae0e925339be5a1c69480ff2a4462eab4c4@ec2-54-163-226-238.compute-1.amazonaws.com:5432/ddsu160rb5t7vq?ssl=true',
})
client.connect()

// the final table object reference
//
// {
//   "name": "customers",
//   "columns": [
//     {"column_name":"id","data_type":"integer"}
//     {"column_name":"name","data_type":"character varying"}
//     {"column_name":"age","data_type":"integer"}
//     {"column_name":"address","data_type":"character"}
//     {"column_name":"salary","data_type":"numeric"}
//   ],
//   "primaryKey": {"column_name":"id","ordinal_position":1}
//   "foreignKeys": []
// }
//

export default class Db {
  static getTableNames() {
    client.query(`
      SELECT
        table_name
      FROM
        information_schema.tables
      WHERE
        table_schema = 'public'
        AND table_type = 'BASE TABLE'
    `, (err, res) => {
        console.log(err, res.rows)
        client.end()
      })
  }

  static getPrimaryKey(tableToQuery) {
    client.query(`
      SELECT
        c.column_name,
        c.ordinal_position
      FROM
        information_schema.key_column_usage AS c
        LEFT JOIN
          information_schema.table_constraints AS t
          ON t.constraint_name = c.constraint_name
      WHERE
        t.table_name = '${tableToQuery}'
        AND t.constraint_type = 'PRIMARY KEY';
    `, (err, res) => {
        console.log(err, res)
        client.end()
      })
  }

  static getForeignKeys(tableToQuery) {
    client.query(`
      SELECT
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
      AND tc.table_name = '${tableToQuery}';
    `, (err, res) => {
        console.log(err, res)
        client.end()
      })
  }

  static getColumns(tableToQuery) {
    client.query(`
      select
        COLUMN_NAME,
        DATA_TYPE
      from
        INFORMATION_SCHEMA.COLUMNS
      where
        TABLE_NAME = '${tableToQuery}'
    `, (err, res) => {
        console.log(err, res)
        client.end()
      })
  }
}

