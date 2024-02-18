import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  port: 5432,
  database: "world",
  password: "789121",
  host: "localhost",
});

db.connect();

let totalCount = 0;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("SELECT * FROM visited_countries");
  let countries= [];
  result.rows.forEach((country)=>{
    countries.push(country.country_code);
  })
  res.render("index.ejs", { countries, total: totalCount });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
