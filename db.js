const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres", // user name
  host: "localhost", // server name or IP address
  database: "mydb", // database name
  password: "", // ここを設定していないとエラーになる
  port: 5432, // port number
});

module.exports = pool;
