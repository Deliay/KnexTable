const commander = require("commander");
const { generate } = require("./Commands/generate");

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

  return commander;
}

module.exports = {
  initCommands
};
