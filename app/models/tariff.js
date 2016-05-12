'use strict';
/* jshint node: true */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tariffs', {
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        cost: {
            type: DataTypes.DECIMAL(8, 2),
            field: 'cost',
            defaultValue: 0
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active',
            defaultValue: true
        }
    }, {
        underscored: true,
        indexes: [{
            unique: true,
            fields: ['name']
        }]
    });
};
