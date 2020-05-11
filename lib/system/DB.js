const Movie = require("../../models/movie");
const {Sequelize, DataTypes} = require('sequelize');

module.exports = class DB {
    logger;
    Movie;

    constructor(logger) {
        this.logger = logger;
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'data/database.sqlite'
        });
        this.Movie = Movie(this.sequelize, Sequelize);
    }

    /**
     * @returns {Model}
     */
    get movie() {
        return this.sequelize.define('Movie', {
            // Model attributes are defined here
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            Year: {
                type: DataTypes.STRING
            },
            Quality: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            // Other model options go here
        });
    }

    async auth() {
        this.sequelize.authenticate();
    }

    async runSync() {
        this.logger("Synchronizing DB models ...");
        this.sequelize.sync({force: true});
        this.logger("All models were synchronized successfully.");
    }


}