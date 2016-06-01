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
        },
        ip: {
            type: DataTypes.STRING,
            field: 'ip',
            defaultValue: '127.0.0.1',
            validate: {
                isIP: true
            }
        },
        port: {
            type: DataTypes.INTEGER,
            field: 'port',
            defaultValue: 0
        }
    }, {
        underscored: true,
        instanceMethods: {
            address: function() {
                return [this.street, this.home, this.office].join(', ');
            }
        }
    });
};
