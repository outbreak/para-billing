'use strict';
/* jshint node: true */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            field: 'email',
            validate: {
                isEmail: true
            }
        },
        firstName: {
            type: DataTypes.STRING,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING,
            field: 'last_name'
        },
        middleName: {
            type: DataTypes.STRING,
            field: 'middle_name'
        },
        phone: {
            type: DataTypes.STRING,
            field: 'phone'
        },
        lastSignedAt: {
            type: DataTypes.STRING,
            field: 'last_signed_at'
        }
    }, {
        underscored: true,
        indexes: [{
            fields: ['email']
        }]
    });
};
