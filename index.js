import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

//This is not exposing my local DB, it's for development purposes only
//For safer useage in production or else, change to dotenv.
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "789121",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

let users = [
  { id: 1, name: "Michael", color: "teal" },
  { id: 2, name: "Dwight", color: "powderblue" },
];

async function checkVisited() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users");
  users = result.rows;
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const currentUser = await getCurrentUser();
  
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  }); // db.end();
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser();
  try {
    const result = await db.query(
      "SELECT country_code From countries WHERE LOWER(country_name) LIKE '%' || $1 || '%'",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;

    try {
      await db.query("INSERT INTO visited_countries (country_code, user_id) VALUES($1, $2)", [
        countryCode,
        currentUserId,
      ]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisited();
      res.render("index.ejs", {
        countries,
        users,
        color: currentUser.color,
        total: countries.length,
        error: "This country has already been added!",
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisited();
    res.render("index.ejs", {
      countries,
      users,
      color: currentUser.color,
      total: countries.length,
      error: "Country name doesn't exist! try again!",
    });
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const newUser = req.body.name;
  const color = req.body.color;
  console.log("New User added! --> "+newUser);

  const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING*;", [
    newUser,
    color,
  ]);

  const id = result.rows[0].id;
  currentUserId = id;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

