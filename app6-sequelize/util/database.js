const Sequelize = require('sequelize');

const sequelize = new Sequelize('eshop_nodejs', 'root', 'phproot', {
  dialect: 'mysql',
  host: 'localhost',
  port: '3307'
});

module.exports = sequelize;
