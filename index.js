import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "world",
  password: "789121",
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];

async function checkVisited() {
  const result = await db.query("SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1",[currentUserId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUserId(){
  const result = await db.query('SELECT * FROM users');
  users = result.rows;
  return users.find((user)=> user.id ==currentUserId);
}
app.get("/", async (req, res) => {
  const countries = await checkVisited();
  console.log(countries.length);
  currentUserId = await getCurrentUserId();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUserId.color,
  });  // db.end();
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  try {
    const result = await db.query(
      "SELECT country_code From countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query("INSERT INTO visited_countries (country_code, user_id) VALUES($1, $2)", [countryCode]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries,
        total: countries.length,
        error: "This country has already been added!",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries,
      total: countries.length,
      error: "Country name doesn't exist! try again!",
    });
  }
});

app.post("/user", async (req, res) => {
  if(req.body.add === 'new'){
    res.render("new.ejs");
  }
});

app.post("/new", async (req, res) => {
  const newUser = req.body.name;
  const color = req.body.color;
  console.log(newUser, color);
  try {
    await db.query('INSERT INTO users (name, color) VALUES($1, $2)',[newUser, color]);
    res.redirect('/');
  } catch (error) {
    console.log(error);
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
