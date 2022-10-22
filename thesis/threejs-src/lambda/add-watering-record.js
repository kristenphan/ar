const Knex = require("knex");

const plantStatus = "Good";

// Connect to mysql database using knex.js query builder
const knex = new Knex({
  client: "mysql",
  connection: {
    host : "localhost",
    port : 3306,
    user : "kristen",
    password : "12345",
    database : "thesis",
  },
});

// Add a new record to database
knex('watering_history').insert({ plant_status: `${plantStatus}`, })
.then(() => console.log("Data inserted"))
.catch((err) => { console.log(err); throw err })
.finally(() => { knex.destroy(); });

// Show table
knex.from('watering_history')
  .select("*")
  .then((rows) => {
      for (row of rows) {
          console.log(`${row['record_id']} ${row['plant_status']} ${row['created_at']}`);
      }
  })
  .catch((err) => { console.log( err); throw err })
  .finally(() => { knex.destroy();});




  
