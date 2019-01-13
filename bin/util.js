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

module.exports = {
  resolveDefaultKnexfilePath,
  getKnexInstance,
  fromTables,
  fromColumns,
  fromUsage,
};
