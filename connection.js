const mysql = require('mysql');
var connection = mysql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'root',
    password: 'akshaysajitha',
    database: 'nodecurd', 
});

connection.connect((err) => {
    if (!err) {
        console.log('Connected to the database');
    } else {
        console.error(err);
    }
});
 
module.exports = connection;
