console.log("running db.js");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "kristen",
  password: "12345",
  database: "thesis",
});

connection.connect((error) => {
  if (error) {
    console.log("Error connecting to the MySQL database");
    console.log("error = ", error);
    return;
  }
  console.log("Connection established successfully");
});

connection.end((error) => {
  if (error) {

  }
  console.log("Connection terminated successfully");
});