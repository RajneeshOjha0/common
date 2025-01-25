const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",  
    user: "root",          
    password: "",          
    database: "viblo_backend", 
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.message);
      return;
    }
    console.log("Connected to MySQL database!");
  });

  module.exports = db;