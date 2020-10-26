const mysql = require('mysql');
const dbConfig = require('../config');

const db = mysql.createConnection(dbConfig);

db.connect();

module.exports = db;
