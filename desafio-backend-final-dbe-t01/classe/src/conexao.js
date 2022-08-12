const local = {
    host: process.env.DB_HOST_LOCAL,
    user: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    port: process.env.DB_PORT
}
const heroku = {
    host: 'ec2-34-235-31-124.compute-1.amazonaws.com',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
}
const knex = require('knex')({
    client: 'pg',
    connection: heroku
});
module.exports = knex;