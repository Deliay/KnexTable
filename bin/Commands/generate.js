const fs = require('fs');
const color = require('colorette');
/**
 * @typedef {{TABLE_SCHEMA, TABLE_NAME}} Table
 * @typedef {{TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUN_LENGTH, COLUMN_KEY, COLUMN_COMMENT: string}} Column
 * @typedef {{ TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME }} Usage
 * @typedef {Map<string, Map<string, Column>>} TableMap
 * @typedef {Map<string, Map<string, Usage>>} TableRefMap
 */
const { resolveSchema, sqlTypeToJsType } = require("../util");

/**
 * @param {TableMap} TableMap
 * @returns {string[]}
 */
function getAllTableNames(TableMap) {
  return [...TableMap.keys()]
}

/**
 * 
 * @param {Column} column 
 */
function getColumn(column) {
  return `/** ${column.COLUMN_COMMENT.replace(/\//g, '\\\/')}*/${column.COLUMN_NAME}${column.IS_NULLABLE === 'YES' ? '?' : ''}: ${sqlTypeToJsType(column)};`
}

/**
 * @param {Map<string, Column>} ColumnMap 
 */
function getColumnList(ColumnMap) {
  return [...ColumnMap.keys()];
}

/**
 * 
 * @param {string} TableName
 * @param {Map<string, Column>} ColumnMap 
 */
function getInterfance(TableName, ColumnMap) {
  return `  interface ${TableName} { ${getColumnList(ColumnMap).map((key) => getColumn(ColumnMap.get(key))).join(' ')}}`;
}

/**
 * 
 * @param {string} TableName 
 * @param {Map<string, Column>} ColumnMap 
 */
function getStringTypeColumns(TableName, ColumnMap) {
  return `  type ${TableName}Columns = ${getColumnList(ColumnMap).map((name) => `/** ${ColumnMap.get(name).COLUMN_COMMENT.replace(/\//g, '\\\/')}*/"${TableName}.${name}"`).join("|")};`
}

/**
 * 
 * @param {string} TableName
 * @param {Set<string>} TableRefTable
 */
function getQueryBuilder(TableName, TableRefTable) {
  const refTables = TableRefTable ? [...TableRefTable.values()] : [];
  const extraJoin = () => {
    const reference = `${refTables.map((table) => `${table}Columns`).join('|')}, ${refTables.join('&')}`;
    return `
      join: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      innerJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      leftJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      leftOuterJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      rightJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      rightOuterJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      outerJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      fullOuterJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
      crossJoin: JoinExtra<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}, ${reference}>;
    `;
  }
  return `  interface ${TableName}Builder extends TableBuilder<${TableName}Builder, ${TableName}Columns, ${TableName}References, ${TableName}> {
    ${refTables.length > 0 ? extraJoin() : ''}
  }`
}

function qoute(value) {
  return `"${value}"`
}

/**
 * 
 * @param {TableRefMap} TableRefMap 
 */
function getTableRextraReferences(TableRefMap) {
  const allTableNames = [...TableRefMap.keys()];
  return allTableNames.map((name) => `type ${name}ExtraReferences = ` + [...TableRefMap.get(name).keys()].map((columnName) => {
    const ref = TableRefMap.get(name).get(columnName);
    return qoute(`${ref.REFERENCED_TABLE_NAME}.${ref.REFERENCED_COLUMN_NAME}`);
  }).join("|")).join(";\n  ");
}

/**
 * @param {TableMap} TableMap
 * @param {TableRefMap} TableRefMap
 * @param {Map<string, Set<string>>} TableRefTable
 */
function generateDTSContent(TableMap, TableRefMap, TableRefTable) {
  const allTableNames = getAllTableNames(TableMap);
  return `
import knex = require("knex");
import Bluebird = require("bluebird");
declare namespace Mage {
  ${require('./generateBase')}
  // All Interfaces
  ${allTableNames.map((table) => getInterfance(table, TableMap.get(table))).join('\n')}
  // TableNames
  type TableNames = ${allTableNames.map(qoute).join('|')};
  // All Table Column Names
  ${allTableNames.map((table) => getStringTypeColumns(table, TableMap.get(table))).join('\n')}
  // All Table References
  ${allTableNames.map((key) => `type ${key}References = ` + (TableRefTable.has(key) ? [...TableRefTable.get(key).values()].map(qoute).join('|') : 'null')).join(';\n  ')}
  // All Table Extra References
  ${getTableRextraReferences(TableRefMap)}
  // All Table QueryBuilder
  ${allTableNames.map((table) => getQueryBuilder(table, TableRefTable.get(table))).join('\n')}
  interface db extends knex {
    select: KnexSelect;
    columns: KnexSelect;
    column: KnexSelect;
    distinct: KnexColumnNameQueryBuilder;
    (tableName: TableNames): db;
${allTableNames.map((table) => `    from(tableName: "${table}"): ${table}Builder;
    (tableName: "${table}"): ${table}Builder;`).join('\n')}
  }
}
  `;
}

async function generate(schema, outputFile) {
  const { TableMap, TableRefMap, TableRefTable } = await resolveSchema(schema);
  fs.writeFileSync(outputFile, generateDTSContent(TableMap, TableRefMap, TableRefTable));
  console.log("done");
}

module.exports = {
  generate
};
