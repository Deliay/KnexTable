const color = require('colorette');
const { resolveSchema, sqlTypeToJoiType } = require("../util");

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
function loadTableDefine(columnMap, camelCase, prefix = '', suffix = '') {
  const map = [];
  for (const [key, value] of columnMap) {
    map.push(`${prefix}  ${camelCase ? toCamelCase(key): key}: Joi.${sqlTypeToJoiType(value)}().description('${value.COLUMN_COMMENT}'),${suffix}`)
  }

  return map;
}

async function toJoi(schema, options) {
  const { toFile, camelCase, tableName } = options;

  if (camelCase) {
    console.log(color.cyan('Using camelCase'));
  } else {
    console.log(color.cyan('Using default database name'), options);
  }
  if (toFile && toFile.length > 0) {
    console.log("write to " + toFile);
  }
  const output = (content) => toFile && toFile.length > 0 ? fs.writeFileSync(toFile, content) : console.log(content);

  const result = await resolveSchema(schema);
  if (!result) {
    return;
  }

  const { TableMap, TableRefMap, TableRefTable } = result;
  const content = [];
  if (tableName && tableName.length > 0) {
    if (!TableMap.has(tableName)) {
      console.log(color.red(`Table ${tableName} not exist`));
      return;
    }
    const columnMap = TableMap.get(tableName);
    content.push(...loadTableDefine(columnMap, camelCase));
  } else {
    for (const [key, value] of TableMap) {
      content.push(`const ${camelCase ? toCamelCase(key): key} = {`);
      content.push(loadTableDefine(value, camelCase, '  ').join('\n'));
      content.push('};\n');
    }
  }
  output(content.join('\n'));
}

module.exports = { toJoi };
