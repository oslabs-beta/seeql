// create the db connection, add the object methods as middlesware, export the object
import client from './dbConnect';

class dbQuery {
  getTables() {
    console.log('ingettables');
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema='public'
                        AND table_type='BASE TABLE'`,
        (err: string, result: string) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  getForeignKeys(tableName: string) {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT tc.table_schema,
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
        (err: string, result: string) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  getColumns(tableName: string) {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT COLUMN_NAME AS ColumnName,
                               DATA_TYPE AS DataType,
                               CHARACTER_MAXIMUM_LENGTH AS CharacterLength,
                               COLUMN_DEFAULT AS DefaultValue
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_NAME = '${tableName}'`,
        (err: string, result: string) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  getPrimaryKey(tableName: string) {
    return new Promise((resolve, reject) => {
      client.query(
        `SELECT column_name
                        FROM pg_constraint, information_schema.constraint_column_usage
                        WHERE contype = 'p'
                        AND information_schema.constraint_column_usage.table_name = '${tableName}'
                        AND pg_constraint.conname = information_schema.constraint_column_usage.constraint_name`,
        (err: string, result: string) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }
  composeTableData = async () => {
    let tablesArr = [];
    var tableNames: any = null;
    tableNames = await this.getTables();

    for (let table of tableNames.rows) {
      table.primaryKey = await this.getPrimaryKey(table.table_name);
      table.foreignKey = await this.getForeignKeys(table.table_name);
      table.columns = await this.getColumns(table.table_name);
      tablesArr.push(table);
    }
    return new Promise((resolve, reject) => {
      resolve(tablesArr);
    });
  };
}

export default dbQuery;
