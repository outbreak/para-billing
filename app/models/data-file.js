'use strict';
/* jshint node: true */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('data_files', {
        fileName: {
            type: DataTypes.STRING,
            field: 'file_name'
        },
        finishedAt: {
            type: DataTypes.DATE,
            field: 'finished_at'
        }
    }, {
        underscored: true,
        updatedAt: false
    });
};
