'use strict';
/* jshint node: true */

var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('balance_histories', {
        cost: {
            type: DataTypes.DECIMAL(8, 2),
            field: 'cost'
        },
        accountId: {
            type: DataTypes.INTEGER(8).UNSIGNED.ZEROFILL,
            field: 'account_id'
        },
        dateAt: {
            type: DataTypes.DATEONLY,
            field: 'date_at'
        },
        oldBalance: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            defaultValue: null,
            field: 'old_balance'
        }
    }, {
        underscored: true,
        updatedAt: false,
        instanceMethods: {
            date: function() {
                return moment.utc(this.dateAt).format('DD MMMM YYYY');
            }
        }
    });
};
