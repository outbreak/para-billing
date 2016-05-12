'use strict';
/* jshint node: true */

var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./app/database.js'),
    config = require('./app/config.js'),
    routes = require('./app/routes.js'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

function onDatabaseConnectionSuccess() {
    var server = app.listen(config.server.port, function() {
        console.log('Server listen on port: %s', server.address().port);
    });
}

function onDatabaseConnectionError(error) {
    console.log('Database Error:\n%s', error);
}

db.sequelize.sync({
    force: config.truncateDatabaseTables
}).then(onDatabaseConnectionSuccess, onDatabaseConnectionError);
