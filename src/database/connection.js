const Sequelize = require('sequelize')

const database = process.env.DATABASE
const username = process.env.USER
console.log(username)
const password = process.env.PASSWORD
const host = process.env.HOST
const dialect = process.env.DIALECT

const connection = new Sequelize(database, username, password, {
    host,
    dialect,
    dialectOptions: {
        options: {
          requestTimeout: 600000
        }
      },
    pool: {
        max: 20,
        min: 0,
        acquire: 600000,
        idle: 20000
      }
})

module.exports = connection