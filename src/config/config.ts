import * as dotenv from 'dotenv'
dotenv.config()

export const configs = {
    mongoUrl: `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kpxscls.mongodb.net/ims`,
    databaseName: process.env.DB_NAME,
    options: {
        useNewUrlParser: true, // removes a deprecation warning when connecting
        useUnifiedTopology: true, // removes a deprecating warning when connecting
    },
    migrationsDir: "migrations",
    changelogCollectionName: "changelog"
}