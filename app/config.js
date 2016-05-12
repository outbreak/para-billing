/* jshint node: true */

module.exports = {
    truncateDatabaseTables: true,
    mysql: {
        host: '127.0.0.1',
        port: 3306,
        database: 'para_billing',
        username: 'root',
        password: null
    },
    server: {
        port: 3000,
        admin: {
            username: 'admin',
            password: 'password'
        }
    },
    folders: {
        input: 'data',
        output: 'data/processed',
        reports: 'data/reports',
    }
};
