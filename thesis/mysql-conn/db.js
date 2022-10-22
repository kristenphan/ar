// https://www.tutorialspoint.com/updating-a-record-in-mysql-using-nodejs
// INSERT INTO using raw sql
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
    console.log(error);
    return;
  }
  console.log("Connection established successfully");
});

const sql = "INSERT INTO watering_history(plant_status) VALUES('Good');";
connection.query(sql, (error, result) => {
  if (error) {
    console.log("INSERT INTO failed \n");
    console.log(error);
  }
  console.log(result);
});


connection.end((error) => {
  if (error) {

  }
  console.log("Connection terminated successfully");
});