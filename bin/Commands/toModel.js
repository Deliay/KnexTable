const color = require('colorette');
const fs = require('fs');
const path = require('path');
const { resolveSchema, sqlTypeToJsType } = require("../util");

/**
 * @param {string} string
 */
function toCamelCase(string) {
  return string.replace(/^([A-Z])|[\s-_](\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();        
  })
}

/**
 * @param {Map} columnMap 
 */
function generateModel(columnMap, useDatabaseName, tableName, useMoment) {
  const map = [];
  const entity = [];
  const fieldMap = [];
  const toEntity = [];
  const toRaw = [];
  const def = [];
  entity.push(`export interface ${tableName}Entity extends KnexEntity.Entity {`)
  fieldMap.push(`const ${tableName}Map: KnexEntity.EntityColumnMap<${tableName}Entity> = {`);
  toEntity.push(`const ${tableName}ConvertToEntity: KnexEntity.EntityColumnConvertToEntity<${tableName}Entity> = {`);
  toRaw.push(`const ${tableName}ConvertToRaw: KnexEntity.EntityColumnConvertToRaw<${tableName}Entity> = {`);
  let PK = 'id';
  for (const [key, value] of columnMap) {
    const entityFieldKey = useDatabaseName ? key: toCamelCase(key);
    const jsType = sqlTypeToJsType(value);
    entity.push(`  /** ${value.COLUMN_COMMENT} */`);
    entity.push(`    ${entityFieldKey}: ${jsType},`);
    fieldMap.push(`  ${entityFieldKey}: '${key}',`);
    if (useMoment && jsType === 'Date') {
      toEntity.push(`  ${entityFieldKey}: (raw: any) => moment(raw),`)
      toRaw.push(`  ${entityFieldKey}: (data) => data.toDate(),`);
    }
    if (value.CONSTRAINT_TYPE === 'PRIMARY') {
      PK = entityFieldKey;
    }
  }
  entity.push('}');
  fieldMap.push('}');
  toEntity.push('}');
  toRaw.push('}');
  
  def.push(`export const ${tableName}Definition: KnexEntity.ModelDefinition<${tableName}Entity> = {`);
  def.push(`  table: '${tableName}',`);
  def.push(`  key: '${PK}',`);
  def.push(`  map: ${tableName}Map,`);
  def.push(`  convertToEntity: ${tableName}ConvertToEntity,`);
  def.push(`  convertToRaw: ${tableName}ConvertToRaw,`);
  def.push('}')

  map.push([
    entity.join('\n'),
    fieldMap.join('\n'),
    toEntity.join('\n'),
    toRaw.join('\n'),
    def.join('\n'),
  ].join('\n'))
  return map;
}

async function toModel(schema, options) {
  const { toFolder: toFile, useDatabaseName = false, tableName, useMoment = true, genContext = false } = options;

  if (!useDatabaseName) {
    console.log(color.cyan('Using camelCase'));
  } else {
    console.log(color.cyan('Using default database name'), options);
  }
  if (toFile && toFile.length > 0) {
    console.log("write to " + toFile);
  }
  const output = (content, tableName) => toFile && toFile.length > 0 ? fs.writeFileSync(path.join(toFile, `${tableName}.ts`), content) : console.log(content);

  const result = await resolveSchema(schema);
  if (!result) {
    return;
  }

  const { TableMap, TableRefMap, TableRefTable } = result;
  const entities = new Map();
  const baseTableContent = [];
  baseTableContent.push("import * as KnexEntity from 'KnexEntity';");
  if (useMoment) {
    baseTableContent.push("import moment from 'moment';");
  }
  if (tableName && tableName.length > 0) {
    if (!TableMap.has(tableName)) {
      console.log(color.red(`Table ${tableName} not exist`));
      return;
    }
    const columnMap = TableMap.get(tableName);
    const camelCaseTableName = toCamelCase(tableName);
    entities.set(camelCaseTableName, generateModel(columnMap, useDatabaseName, camelCaseTableName, useMoment).join('\n'));
  } else {
    for (const [key, value] of TableMap) {
      const camelCaseTableName = toCamelCase(key);
      entities.set(camelCaseTableName, generateModel(value, useDatabaseName, camelCaseTableName, useMoment).join('\n'));
    }
  }

  if (genContext) {
    const camelCaseSchema = toCamelCase(schema);
    const context = [
      `import * as Knex from 'knex';`
    ];
    const entitiesInterface = [
      `interface ${camelCaseSchema}Entities {`
    ];
    const tablesDefinition = [
      `{`
    ]
    const tablesGetter = [];
    for (const [key, value] of entities) {
      if (toFile) {
        context.push(`import { ${key}Entity, ${key}Definition } from './${key}';`);
      }
      entitiesInterface.push(`  ${key}: ${key}Entity,`);
      tablesDefinition.push(`  ${key}: ${key}Definition,`)
      tablesGetter.push([
        `public get ${key}() { return this.getModel('${key}'); }`
      ])
    }
    entitiesInterface.push('}');
    tablesDefinition.push('}');
    context.push(entitiesInterface.join('\n'));
    context.push(`export class ${camelCaseSchema}Context extends DbContext<${camelCaseSchema}Entities> {`)
    context.push(`  constructor(contextKnex: Knex) { super({ contextKnex, tablesDefinition: ${tablesDefinition.join('\n')}}); }`)
    context.push(`  ${tablesGetter.join('\n  ')}`);
    context.push('}')

    output(context.join('\n'), `${camelCaseSchema}Context`);
  }
  for (const [key, value] of entities) {
    if (toFile) {
      output([...baseTableContent, value].join('\n'), key);
    } else {
      output(value, key);
    }
  }
}

module.exports = { toModel };
