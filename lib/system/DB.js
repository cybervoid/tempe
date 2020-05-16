const Movie = require("../../models/movie");
const {Sequelize, DataTypes} = require('sequelize');

module.exports = class DB {
    logger;
    Movie;

    constructor(logger) {
        this.logger = logger;
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db/database.sqlite'
        });

        this.Movie = Movie(this.sequelize, Sequelize);
    }

    async auth() {
        return this.sequelize.authenticate()
            .then(res => {
                this.logger('Connection has been established to the DB successfully');
                return true;
            })
            .catch(err => {
                console.log('Unable to connect to the database:', err);
                return false;
            })
    }

    async runSync() {
        this.logger("Synchronizing DB models ...");
        this.sequelize.sync({force: true});
        this.logger("All models were synchronized successfully.");
    }


}