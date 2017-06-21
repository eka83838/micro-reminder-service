import * as Sequelize from 'sequelize';
import * as Configs from '../configurations';
import * as glob from 'glob';

const dbConfig = Configs.getDatabaseConfig();
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
var db = {};

var findModel = glob.sync('**/*.model.js', { absolute: true });

if (findModel.length > 0) {
  findModel.forEach((filePath: string) => {
    var model = sequelize['import'](filePath);
    db[model['name']] = model;
  });
} else {
  console.log('No model file created');
}

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

export default db;
