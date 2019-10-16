const commander = require("commander");
const { generate } = require("./Commands/generate");
const { toJoi } = require("./Commands/toJoi");
const { toModel } = require("./Commands/toModel");

function wrap(res, rej) {
  return (asyncFunc) => (...args) => {
    asyncFunc(...args).then(res).catch((e) => rej(e));
  };
}

function initCommands(res, rej) {
  const commandWrap = wrap(res, rej);
  commander
  .command('generate <schema> <outputFile>')
  .description('Generate Typings')
  .action(commandWrap(generate));

  commander
  .command('toJoi <schema>')
  .option('-F, --tofile <path>', 'output to a specify file')
  .option('-C, --camelCase [bool]', 'convert to camel case')
  .option('-T, --tableName <string>', 'specify a table')
  .description('Convert a table structure to Joi Object Definition')
  .action(commandWrap(toJoi));

  commander
  .command('toModel <schema>')
  .option('-F, --toFolder <path>', 'output to a group of file')
  .option('-N, --useDatabaseName [bool]', 'not convert to camelCase, instead use database name')
  .option('-M, --useMoment [bool]', 'add adaptor to convert between Date and Moment')
  .option('-T, --tableName <string>', 'specify a table')
  .option('-C, --genContext [bool]', 'generate context info')
  .description('Convert a table structure to KnexEntity Model Definition')
  .action(commandWrap(toModel));

  global.commander = commander;

  return commander;
}

module.exports = {
  initCommands
};
