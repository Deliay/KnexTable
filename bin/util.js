const path = require('path');
const color = require('colorette');
const fs = require('fs');
const knex = require('knex');

function resolveDefaultKnexfilePath() {
  return path.join(process.cwd(), '/knexfile.js');
}

function getKnexInstance(knexfile) {
  const basedir = path.dirname(knexfile);
  if (!fs.existsSync(knexfile)) {
    console.log("Knexfile:", color.redBright(knexfile), "not exist");
    return;
  }
  if (process.cwd() !== basedir) {
    process.chdir(basedir);
    console.log("Working directory changed to", color.magenta(basedir));
  }
  const defaultEnv = "development" || process.env.NODE_ENV;
  console.log("Using environment:", color.magenta(defaultEnv));

  return knex(require(knexfile)[defaultEnv]);
}

function fromTables({ TABLE_SCHEMA, TABLE_NAME }) {
  return {
    TABLE_SCHEMA,
    TABLE_NAME,
  };
}

function fromColumns({ TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUN_LENGTH, COLUMN_KEY, COLUMN_COMMENT }) {
  return {
    TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUN_LENGTH, COLUMN_KEY, COLUMN_COMMENT,
  };
}

function fromUsage({ TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME }) {
  return { TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME };
}

/**
 * @param {Column} column 
 */
function sqlTypeToJsType(column) {
  switch (column.DATA_TYPE.toLowerCase()) {
    case "int":
    case "bigint": 
    case "decimal": 
    case "float": { return "number"; }
    case "varchar":
    case "longtext":
    case "mediumtext": 
    case "text": { return "string"; }
    case "date":
    case "timestamp":
    case "datetime": { return "Date"; }
    case "tinyint": { return "boolean"; }
  }
  console.log("Unknown type:", color.cyan(column.DATA_TYPE), "in", color.magentaBright(`${column.TABLE_NAME}.${column.COLUMN_NAME}`));
  return column.DATA_TYPE;
}

/**
 * @param {Column} column 
 */
function sqlTypeToJoiType(column) {
  switch (column.DATA_TYPE.toLowerCase()) {
    case "int":
    case "bigint": 
    case "decimal": 
    case "float": { return "number"; }
    case "varchar":
    case "longtext":
    case "mediumtext": 
    case "text": { return "string"; }
    case "date":
    case "timestamp":
    case "datetime": { return "date"; }
    case "tinyint": { return "boolean"; }
  }
  console.log("Unknown type:", color.cyan(column.DATA_TYPE), "in", color.magentaBright(`${column.TABLE_NAME}.${column.COLUMN_NAME}`));
  return column.DATA_TYPE;
}

/**
 * @typedef {{TABLE_SCHEMA, TABLE_NAME}} Table
 * @typedef {{TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUN_LENGTH, COLUMN_KEY, COLUMN_COMMENT}} Column
 * @typedef {{ TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME }} Usage
 * @typedef {Map<string, Map<string, Column>>} TableMap
 * @typedef {Map<string, Map<string, Usage>>} TableRefMap

 * @typedef {Object} ResolveSchema
 * @prop {TableMap} TableMap
 * @prop {TableRefMap} TableRefMap
 * @prop {Map<string, Set<string>>} TableRefTable
 * @returns {ResolveSchema}
*/
async function resolveSchema(schema) {
  const config = resolveDefaultKnexfilePath();
  console.log(config);
  console.log("Loading...");
  const knex = getKnexInstance(config);
  if (!knex) {
    console.log(color.redBright("Can't load knex"));
    return null;
  }
  console.log("Schema:", color.magenta(schema));

  const db = new class {
    get info() { return knex.withSchema("information_schema"); }
  }();

  const tables = await db.info
  .select("*")
  .from("tables")
  .where("TABLE_SCHEMA", schema)
  .where("TABLE_TYPE", "BASE TABLE");
  const TableMap = new Map();
  for (const rawTable of tables) {
    const table = fromTables(rawTable);
    const ColumnMap = new Map();
    const columns = await db.info.select("*").from("columns").where(table);
    for (const rawColumn of columns) {
      const column = fromColumns(rawColumn);
      ColumnMap.set(column.COLUMN_NAME, column);
    }
    TableMap.set(table.TABLE_NAME, ColumnMap);
  }
  // Table 'A.xxx_id' -ref-> 'B.id' 
  // mean A ref to B
  const TableRefMap = new Map();
  const TableRefTable = new Map();
  const refs = await db.info
  .select('*')
  .from('KEY_COLUMN_USAGE')
  .where('TABLE_SCHEMA', schema)
  .whereNotNull('REFERENCED_TABLE_NAME');
  for (const rawRef of refs) {
    const ref = fromUsage(rawRef);
    if (!TableRefMap.has(ref.TABLE_NAME)) {
      TableRefMap.set(ref.TABLE_NAME, new Map());
      TableRefTable.set(ref.TABLE_NAME, new Set());
    }
    TableRefMap.get(ref.TABLE_NAME).set(ref.COLUMN_NAME, ref);
    TableRefTable.get(ref.TABLE_NAME).add(ref.REFERENCED_TABLE_NAME);
  }
  console.log("Loaded:", color.cyan(TableMap.size), "Tables(s) from database");
  return { TableMap, TableRefMap, TableRefTable };
}

module.exports = {
  resolveDefaultKnexfilePath,
  getKnexInstance,
  fromTables,
  fromColumns,
  fromUsage,
  resolveSchema,
  sqlTypeToJsType,
  sqlTypeToJoiType,
};
