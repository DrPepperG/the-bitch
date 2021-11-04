const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    transactionType: 'IMMEDIATE',
});

const Games = require('./models/Games.js')(sequelize, Sequelize.DataTypes);
const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);

module.exports = { Games, Users };
