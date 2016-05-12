'use strict';
/* jshint node: true */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('accounts', {
        id: {
            type: DataTypes.INTEGER(8).UNSIGNED.ZEROFILL,
            autoIncrement: false,
            primaryKey: true
        },
        street: {
            type: DataTypes.STRING,
            field: 'street'
        },
        home: {
            type: DataTypes.STRING,
            field: 'home'
        },
        office: {
            type: DataTypes.STRING,
            field: 'office'
        },
        balance: {
            type: DataTypes.DECIMAL(8, 2),
            field: 'balance',
            allowNull: true,
            defaultValue: null
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active',
            defaultValue: true
        }
    }, {
        underscored: true
    });
};
