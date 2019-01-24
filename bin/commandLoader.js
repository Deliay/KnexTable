const commander = require("commander");
const { generate } = require("./Commands/generate");
const { toJoi } = require("./Commands/toJoi");

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
  .action(commandWrap(generate))

  commander
  .command('toJoi <schema>')
  .option('-F, --tofile <path>', 'output to a specify file')
  .option('-C, --camelCase [bool]', 'output to a specify file')
  .option('-T, --tableName <string>', 'specify a table')
  .description('Convert a table structure to Joi Object Definition')
  .action(commandWrap(toJoi))

  global.commander = commander;

  return commander;
}

module.exports = {
  initCommands
};
