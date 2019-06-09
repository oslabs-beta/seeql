import { Client, QueryResult } from 'pg'

export default class Db {
  conn(URI: string) {
    // #TODO: see w/ alice where SSL is @, merge it into this branch
    const client = new Client(URI + '?ssl=true')

    // #TODO: figure out proper err handling for connect, peek pool
    client.connect((err: Error) => {
      if (err) return err
    })

    const getTables = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT table_name
                      FROM information_schema.tables
                      WHERE table_schema='public'
                      AND table_type='BASE TABLE'`,
          // export interface QueryResult extends QueryResultBase {
          //   rows: any[];
          // }
          (err: Error, result: QueryResult) => {
            if (err) reject(err);
            resolve(result)
          });
      })
    }

    const getForeignKeys = (tableName: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT tc.table_schema,
                              tc.constraint_name,
                              tc.table_name,
                              kcu.column_name,
                              ccu.table_schema AS foreign_table_schema,
                              ccu.table_name AS foreign_table_name,
                              ccu.column_name AS foreign_column_name
                       FROM information_schema.table_constraints AS tc
                       JOIN information_schema.key_column_usage AS kcu
                       ON tc.constraint_name = kcu.constraint_name
                       AND tc.table_schema = kcu.table_schema
                       JOIN information_schema.constraint_column_usage AS ccu
                       ON ccu.constraint_name = tc.constraint_name
                       AND ccu.table_schema = tc.table_schema
                       WHERE tc.constraint_type = 'FOREIGN KEY'
                       AND tc.table_name = '${tableName}'`,
          (err: Error, result: QueryResult) => {
            if (err) reject(err);
            resolve(result)
          });
      });
    }

    const getColumns = (tableName: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT COLUMN_NAME AS ColumnName,
                             DATA_TYPE AS DataType,
                             CHARACTER_MAXIMUM_LENGTH AS CharacterLength,
                             COLUMN_DEFAULT AS DefaultValue
                      FROM INFORMATION_SCHEMA.COLUMNS
                      WHERE TABLE_NAME = '${tableName}'`,
          (err: Error, result: QueryResult) => {
            if (err) reject(err);
            resolve(result)
          });
      });
    }

    const getPrimaryKey = (tableName: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        client.query(`SELECT column_name
                      FROM pg_constraint, information_schema.constraint_column_usage
                      WHERE contype = 'p'
                      AND information_schema.constraint_column_usage.table_name = '${tableName}'
                      AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`,
          (err: Error, result: QueryResult) => {
            if (err) reject(err);
            resolve(result)
          });
      });
    }

    async function composeTableData(): Promise<any> {
      let tablesArr = []
      var tableNames: any = null
      tableNames = await getTables()

      for (let table of tableNames.rows) {
        table.primaryKey = await getPrimaryKey(table.table_name)
        table.foreignKey = await getForeignKeys(table.table_name)
        table.columns = await getColumns(table.table_name)

        tablesArr.push(table)
      }

      // #TODO: generate an empty db response from this
      return new Promise((resolve, reject) => {
        if (tablesArr.length > 1) {
          resolve(tablesArr)
        } else {
          reject('db empty')
        }
      })
    }

    composeTableData().then(r => console.log('table data #TODO: render when component is decided', r))
  }
}
