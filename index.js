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

async function selectVisited(){
  let countries = [];
  const result = await db.query("SELECT * FROM visited_countries");

  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  //Write your code here.
  const countries = await selectVisited();
  res.render("index.ejs", { countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  const newCountry = req.body["country"];
  console.log(newCountry);
  let result = await db.query("SELECT country_code FROM countries WHERE country_name=$1", [newCountry]);
  if(result.rows.length !== 0){
    const data = result.rows[0];
    const countryCode = data.country_code;
    console.log(result.rows[0].country_code);

  await db.query("INSERT INTO visited_countries (country_code) Values($1)",[countryCode]);
  res.redirect("/");
  }
  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



/*
1- Assign a route "/add"
2- save added country name into a variable with req.body
3- make an SQL query to check if the entered country is in our "countries" table
4 - then insert it's country code into the visited_countries db.

*/