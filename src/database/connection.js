const Sequelize = require('sequelize');
const fs = require('fs');

const database = process.env.DATABASE;
const username = process.env.USER;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dialect = process.env.DIALECT;
const options = {};

if (dialect === 'mysql') {
  options.dialectModule = require('mysql2');
}

const connection = new Sequelize(database, username, password, {
  host,
  dialect,
  dialectOptions: {
    requestTimeout: 600000
  },
  pool: {
    min: 0,
    acquire: 600000,
    idle: 20000
  }
});

// Uncomment the following lines if you need to use an SSL certificate
// const certificate = fs.readFileSync("./DigiCertGlobalRootCA.crt.pem");
// connection.options.ssl = {
//   ca: certificate
// };

module.exports = connection;
