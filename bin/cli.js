#!/usr/bin/env node

const { initCommands } = require("./commandLoader");

new Promise((res, rej) => {
  initCommands(
    () => res(process.exit(0)), 
    (e) => rej(console.log(e), process.exit())
  ).parse(process.argv);
});