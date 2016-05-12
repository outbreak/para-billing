'use strict';
/* jshint node: true */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('services', {
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        cost: {
            type: DataTypes.DECIMAL(8, 2),
            field: 'cost',
            defaultValue: 0
        }
    }, {
        underscored: true,
        indexes: [{
            unique: true,
            fields: ['name']
        }]
    });
};
