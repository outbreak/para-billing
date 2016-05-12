'use strict';
/* jshint node: true */

var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.send('Root route');
});

router.get('/login', function(req, res) {
    res.send('Login');
});

router.post('/login', function(req, res) {
    res.end();
});

router.get('/logout', function(req, res) {
    res.end();
});



module.exports = router;
