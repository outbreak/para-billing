'use strict';
/* jshint node: true */

var Sequelize = require('sequelize'),
    config = require('./config.js'),
    db = {
        models: {}
    };

// Database connection
var sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: 'mysql',
    pool: {
        maxConnections: 5,
        minConnections: 0,
        maxIdleTime: 10000
    },
    logging: false
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models
var Account = sequelize.import('./models/account.js');
db.models.Account = Account;

var User = sequelize.import('./models/user.js');
db.models.User = User;

var Tariff = sequelize.import('./models/tariff.js');
db.models.Tariff = Tariff;

var Service = sequelize.import('./models/service.js');
db.models.Service = Service;

var BalanceHistory = sequelize.import('./models/balance-history.js');
db.models.BalanceHistory = BalanceHistory;

var DataFile = sequelize.import('./models/data-file.js');
db.models.DataFile = DataFile;

// Associations for Models
Account.belongsTo(User);
Account.belongsTo(Tariff);
Account.hasMany(BalanceHistory);
BalanceHistory.belongsTo(Account);
Tariff.hasMany(Account);
Tariff.hasMany(Service);
Service.belongsTo(Tariff);
User.hasMany(Account);

// Module Exports
module.exports = db;
