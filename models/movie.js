'use strict';
module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        name: DataTypes.STRING,
        year: DataTypes.STRING,
        quality: DataTypes.STRING
    }, {});
    Movie.associate = function (models) {
        // associations can be defined here
    };
    return Movie;
};