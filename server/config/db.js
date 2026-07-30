const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database Connected.');

    // We will initialize associations here
    const initAssociations = require('../models/associations');
    initAssociations();

    // Sync database schema
    await sequelize.sync({ force: false }); // Sync tables
    console.log('SQLite schemas synced.');
  } catch (error) {
    console.error(`SQLite connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
