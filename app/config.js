'use strict';
/* jshint node: true */

module.exports = {
    truncateDatabaseTables: process.env.TRUNCATE || false,
    mysql: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        database: process.env.DB_NAME || 'para_billing',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null
    },
    server: {
        port: process.env.PORT || 3000,
        admin: {
            username: process.env.ADMIN_LOGIN || 'admin',
            password: process.env.ADMIN_PASSWORD || 'password'
        }
    },
    folders: {
        input: process.env.DATA_INPUT_FOLDER || 'data',
        output: process.env.DATA_OUTPUT_FOLDER || 'data/processed',
        reports: process.env.DATA_REPORTS_FOLDER || 'data/reports',
    }
};
