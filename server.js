'use strict';
/* jshint node: true */

var path = require('path'),
    express = require('express'),
    session = require('express-session'),
    engine = require('ejs-mate'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    db = require('./app/database.js'),
    config = require('./app/config.js'),
    routes = require('./app/routes.js'),
    app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

morgan.token('body', function(req) {
      return '\n' + JSON.stringify(req.body, null, 2);
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.use(session({
    secret: 'para-billing-session',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    console.log('Session: %j', req.session);
    req.db = db;
    next();
});

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
    force: false
}).then(onDatabaseConnectionSuccess, onDatabaseConnectionError);
