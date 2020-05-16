const {Sequelize, DataTypes} = require('sequelize');
const MovieModel = require("../../models/movie");

module.exports = class DB {
    logger;
    Movie;

    constructor(logger) {
        this.logger = logger;
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db/database.sqlite'
        });

        this.Movie = MovieModel(this.sequelize, Sequelize);
    }

    async auth() {
        return this.sequelize.authenticate()
            .then(res => {
                this.logger('Connection has been established to the DB successfully');
                this.logger("Initializing and Synchronizing DB ...")
                this.sequelize.sync()
                    .then(() => {
                        this.logger("Database synchronized");
                    });

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