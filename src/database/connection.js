const Sequelize = require("sequelize");
const fs = require("fs");

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dialect = process.env.DIALECT;
const certificad = fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")

const connection = new Sequelize(database, username, password, {
  host,
  dialect,
  dialectModule: require("mysql2"),
  dialectOptions: {
    options: {
      requestTimeout: 600000,
    },
    ssl: {
      ca: certificad
    }
  },
  pool: {
    min: 0,
    acquire: 600000,
    idle: 20000,
  },
});

module.exports = connection;
