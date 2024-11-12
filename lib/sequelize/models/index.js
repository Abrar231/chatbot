import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import config from '@/lib/sequelize/models/index';
import pg from 'pg';

const basename = path.basename(new URL(import.meta.url).pathname);
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], { ...config, dialectModule: pg });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, { ...config, dialectModule: pg });
}

const files = fs.readdirSync(path.dirname(new URL(import.meta.url).pathname));

for (const file of files) {
  if (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ) {
    const model = (await import(path.join(process.cwd(), path.dirname(new URL(import.meta.url).pathname), file))).default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;