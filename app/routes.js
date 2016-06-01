'use strict';
/* jshint node: true */

var express = require('express'),
    async = require('async'),
    router = express.Router();

function authenticate(req, res, next) {
    var Account = req.db.models.Account;
    if (req.session.account_id) {
        Account.findById(req.session.account_id).then(function(account) {
            if (account) {
                req.account = account;
                next();
            } else {
                res.redirect('/login');
            }
        });
    } else {
        res.redirect('/login');
    }
}

router.get('/', authenticate, function(req, res) {
    var Tariff = req.db.models.Tariff,
        History = req.db.models.BalanceHistory;

    async.parallel({
        user: function(cb) {
            cb(null, {
                firstName: 'Сергей',
                lastName: 'Иванов'
            });
        },
        tariff: function(cb) {
            Tariff.findById(req.account.tariff_id).then(function(tariff) {
                cb(null, tariff);
            });
        },
        histories: function(cb) {
            History.findAll({
                where: {
                    accountId: req.account.id,
                    cost: {
                        $gt: 0
                    }
                },
                order: 'date_at DESC'
            }).then(function(histories) {
                cb(null, histories);
            });
        }
    }, function(err, results) {
        res.render('index', {
            account: req.account,
            tariff: results.tariff,
            histories: results.histories,
            user: results.user
        });
    });
});

router.get('/login', function(req, res) {
    if (req.session.account_id) {
        return res.redirect('/');
    }
    res.render('login');
});

router.post('/login', function(req, res) {
    var Account = req.db.models.Account;
    if (req.session.account_id) {
        return res.redirect('/');
    }

    Account.findById(req.body.username).then(function(account) {
        if (account) {
            console.log('Account: %j', account);
            req.session.account_id = account.id;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/logout', authenticate, function(req, res) {
    req.session.destroy(function() {
        res.redirect('/login');
    });
});



module.exports = router;
