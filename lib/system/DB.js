const {Sequelize, DataTypes} = require('sequelize');
const MovieModel = require("../../models/movie");

module.exports = class DB {
    logger;
    Movie;

    constructor(logger) {
        this.logger = logger;
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: 'db/database.sqlite',
            retry: {
                max: 10
            }
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

    async saveMovie(task) {
        const movie = task.movie;
        console.log(`Saving Movie: Title: ${movie.title}, Year: ${movie.releaseDate}, format: ${movie.format} Download link: ${movie.torrent}`);

        await task.MovieModel.findOrCreate({
            where: {
                name: movie.title
            },
            defaults: { // set the default properties if it doesn't exist
                name: movie.title,
                year: movie.releaseDate,
                quality: movie.format
            }
        })
            .then(result => {
                const movie = result[0]; // boolean stating if it was created or not
                const logMovieName = `movie: ${movie.name} (${movie.year}) - ${movie.format}`;

                if (result[1]) { // false if author already exists and was not created.
                    task.logger(`The ${logMovieName} was added to the Database`);
                } else {
                    task.logger(`Skipping ${logMovieName}, seems like it was already processed on ${task.updatedAt}`);
                }
            })
            .catch(err => {
                task.logger(err)
            });
    }

}