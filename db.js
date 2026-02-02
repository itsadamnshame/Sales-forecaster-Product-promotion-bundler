const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'SalesForecaster_ProductPromotionBundler'
});

connection.query(
  'SELECT * FROM datasets WHERE user_id = ?', [1],
  (err, results) => {
    if (err) throw err;
    console.log(results); // This prints your rows to the terminal
  }
);