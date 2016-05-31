'use strict';
/* jshint node: true */

var fs = require('fs-extra'),
    EventEmitter = require('events'),
    util = require('util'),
    path = require('path'),
    async = require('async'),
    parser = require('csv-parse'),
    winston = require('winston'),
    moment = require('moment'),
    iconv = require('iconv-lite'),
    db = require('./app/database.js'),
    config = require('./app/config.js');

var dataFilesInputDirectory = path.join(__dirname, config.folders.input),
    dataFilesOutputDirectory = path.join(__dirname, config.folders.output),
    dataFilesReportsDirectory = path.join(__dirname, config.folders.reports);

function DisableFileEmitter() {
    var self = this;

    EventEmitter.call(this);

    this.list = [];

    this.on('add', function(accountId, ip, port) {
        self.list.push({
            account: accountId,
            ip: ip,
            port: port
        });
    });

    this.on('save', function(file) {
        console.log('Write Disable file: %s', file);
        fs.writeJson(file, self.list, function(err) {
            self.list = [];
            return err;
        });
    });
}
util.inherits(DisableFileEmitter, EventEmitter);
var disableFileEmitter = new DisableFileEmitter();

function EnableFileEmitter() {
    var self = this;

    EventEmitter.call(this);

    this.list = [];

    this.on('add', function(accountId, ip, port) {
        self.list.push({
            account: accountId,
            ip: ip,
            port: port
        });
    });

    this.on('save', function(file) {
        console.log('Write Enable file: %s', file);
        fs.writeJson(file, self.list, function(err) {
            self.list = [];
            return err;
        });
    });
}
util.inherits(EnableFileEmitter, EventEmitter);
var enableFileEmitter = new EnableFileEmitter();

function uploadRecord(record, callback) {
    process.stdout.write('.');

    var logger = record.logger;

    logger.info('Process Record:', {
        lsk: record.lsk,
        lsk2: record.lsk2,
        name: record.name,
        nd: record.nd,
        kw: record.kw,
        cdtp: record.cdtp,
        cena: record.cena,
        summa: record.summa
    });

    var Account = db.models.Account,
        Tariff = db.models.Tariff;

    Tariff.findOrCreate({
        where: {
            name: record.cena
        },
        defaults: {
            name: record.cena,
            cost: record.cena
        }
    }).spread(function(tariff, isCreated) {
        if (isCreated) {
            logger.info('Tariff created');
        }
        logger.info('Tariff:', {
            id: tariff.id,
            name: tariff.name,
            cost: tariff.cost
        });

        Account.findOrCreate({
            where: {
                id: record.lsk
            },
            defaults: {
                street: record.name,
                home: record.nd,
                office: record.kw,
                balance: null
            }
        }).spread(function(account, isCreated) {
            if (isCreated) {
                logger.info('Account created');
            }
            logger.info('Account:', {
                id: account.id,
                street: account.street,
                home: account.home,
                office: account.office,
                balance: account.balance,
                tariff_id: account.tariff_id
            });

            if (account.tariff_id !== tariff.id) {
                logger.info('Account tariff changed from ', account.tariff_id, 'to ', tariff.id);
                account.update({
                    tariff_id: tariff.id
                }).then(function(account) {
                    balanceHistory(account, tariff, record, callback);
                });
            } else {
                balanceHistory(account, tariff, record, callback);
            }
        });
    });

}

function balanceHistory(account, tariff, record, callback) {
    var BalanceHistory = db.models.BalanceHistory,
        logger = record.logger,
        newHistory = {};

    if ((account.balance === null) || (Number(account.balance).toFixed(2) !== Number(record.summa).toFixed(2))) {
        // TODO: проверить за эту дату загрузку
        newHistory.accountId = account.id;
        newHistory.dateAt = record.date_at.format('YYYY-MM-DD');
        newHistory.oldBalance = account.balance;
        if (account.balance === null) {
            newHistory.cost = 0 - Number(tariff.cost);
        } else {
            newHistory.cost = Number(record.summa) - Number(account.balance);
        }

        BalanceHistory.create(newHistory).then(function(history) {
            logger.info('BalanceHistory:', {
                account_id:     history.accountId,
                cost:           history.cost,
                date_at:        history.dateAt,
                old_balance:    history.oldBalance
            });
            account.balance = Number(record.summa).toFixed(2);
            account.isActive = (Number(account.balance) >= 0);

            if ((Number(history.oldBalance).toFixed(2) >= 0)  && (Number(account.balance).toFixed(2) < 0)) {

                // Если старый баланс больше или равен нулю и новый баланс стал меньше нуля
                disableFileEmitter.emit('add', account.id, account.ip, account.port);

            } else if ((Number(history.oldBalance).toFixed(2) < 0) && (Number(account.balance).toFixed(2) >= 0)) {

                // Если старый баланс был меньше нуля и новый баланс стал больше или равен нулю
                enableFileEmitter.emit('add', account.id, account.ip, account.port);
            }

            account.save().then(function() {
                logger.info('Account:', {
                    id: account.id,
                    street: account.street,
                    home: account.home,
                    office: account.office,
                    balance: account.balance,
                    tariff_id: account.tariff_id
                });
                callback(null);
            });
        });
    } else {
        callback(null);
    }
}

// Читаю файл, перекодирую из cp1251 в utf-8, разбираю CSV
function loadFile(filename, callback) {
    console.log('\nLoad file: %s', filename);

    // Дата из названия файла
    var date = moment.utc(filename.substr(3, 8), 'YYYYMMDD');

    var reportsPath = path.join(dataFilesReportsDirectory, date.format('YYYY-MM-DD'));

    fs.createReadStream(path.join(dataFilesInputDirectory, filename))
        .pipe(iconv.decodeStream('win1251'))
        .pipe(parser({
            delimiter: ';',
            columns: true
        }, function(err, records) {
            if (err) {
                console.log('Error parse CSV:\n%j', err);
                return callback(err);
            }
            console.log('Parse CSV complete.');
            console.log('Found %s records.', records.length);

            // Create report directory
            fs.mkdirs(reportsPath, function() {
                // Empty report directory if have files
                fs.emptyDir(reportsPath, function() {
                    fs.writeJson(path.join(reportsPath, 'records.json'), records, function(err) {
                        if (err) {
                            console.log('Error write file:\n%j', err);
                            return callback(err);
                        }
                        console.log('Save JSON to: %s', reportsPath + '/records.json');

                        var logger = new winston.Logger({
                            level: 'info',
                            transports: [
                                new(winston.transports.File)({
                                    filename: path.join(reportsPath, 'upload.log'),
                                    json: false
                                })
                            ]
                        });

                        records.forEach(function(record) {
                            record.logger = logger;
                            record.date_at = date;
                        });

                        // uploadRecord on each records object
                        async.eachSeries(records, uploadRecord, function(err) {
                            if (err) {
                                return callback(err);
                            }

                            console.log('\nUpload records complete.');

                            disableFileEmitter.emit('save', path.join(reportsPath, 'disable.json'));
                            enableFileEmitter.emit('save', path.join(reportsPath, 'enable.json'));


                            if (fs.existsSync(path.join(dataFilesOutputDirectory, filename))) {
                                fs.removeSync(path.join(dataFilesOutputDirectory, filename));
                            }

                            fs.move(path.join(dataFilesInputDirectory, filename), path.join(dataFilesOutputDirectory, filename), function(err) {
                                console.log('Source file moved to: %s', dataFilesOutputDirectory);
                                callback(err);
                            });
                        });
                    });
                });
            });
        }));
}

function readDataFilesInputDirectory(callback) {
    fs.readdir(dataFilesInputDirectory, function(error, names) {
        var filenames = names.filter(function(name) {
            return fs.statSync(path.join(dataFilesInputDirectory, name)).isFile() && (path.extname(name) === '.txt');
        });
        return callback(null, filenames);
    });
}

function onLoadFiles(error) {
    if (error) {
        console.log('Loading complete with errors:\n%j', error);
    } else {
        console.log('Loading complete.');
    }
    process.exit(0);
}

function onDatabaseConnectionSuccess() {
    console.log('Database connection established.');

    readDataFilesInputDirectory(function(error, filenames) {
        if (error) {
            console.log(error);
        }

        async.eachSeries(filenames, loadFile, onLoadFiles);
    });
}

function onDatabaseConnectionError(error) {
    console.log('Database error:\n%s', error);
}

db.sequelize.sync({
    force: config.truncateDatabaseTables
}).then(onDatabaseConnectionSuccess, onDatabaseConnectionError);
