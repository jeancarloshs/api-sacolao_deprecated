const express = require('express');
const app = express();

// Configurações do Sequelize e do banco de dados
const { Sequelize } = require('sequelize');

// const Sequelize = require('sequelize')
const fs = require('fs')

const database = process.env.DATABASE
const username = process.env.USER
const password = process.env.PASSWORD
const host = process.env.HOST
const dialect = process.env.DIALECT
// const certificad = fs.readFileSync("{./DigiCertGlobalRootCA.crt.pem}")

const connection = new Sequelize(database, username, password, {
    host,
    dialect,
    dialectModule: 'mysql2',
    dialectOptions: {
        options: {
          requestTimeout: 600000
        }
      },
    pool: {
        min: 0,
        acquire: 600000,
        idle: 20000
      },
      // ssl: {
      //   ca: certificad
      // }
})

module.exports = connection