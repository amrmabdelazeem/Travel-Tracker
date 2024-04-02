# Travel Tracker

This is a simple family project for tracking visited countries, built using ExpressJS, EJS and PostgreSQL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

What things you need to install the software and how to install them:

- Node.js
- PostgreSQL

## Setting Up Local Environment

A step by step series of examples that tell you how to get a development environment running

1. Clone this repository

`git clone https://github.com/amrmabdelazeem/Travel-Tracker `

2. Install all dependencies

`npm install`

3. Set up your database (make sure PostgreSQL is installed)

- Create a new PostgreSQL database named world
- Create a new table named countries with the following query:

```
CREATE TABLE countries (
  country_code CHAR(3) PRIMARY KEY,
  country_name TEXT NOT NULL UNIQUE
);
```

- Create a new table named users with the following query:

```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL
);
```

- Create a new table named visited_countries with the following query:

```
CREATE TABLE visited_countries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  country_code CHAR(3) NOT NULL REFERENCES countries(country_code)
  UNIQUE (user_id, country_code)
);
```

4. Start the server using `nodemon` or `node` in the root directory and visit http://localhost:{port}.

## Routes

- `/`: Home page that displays a map of the world showing which countries have been visited by each user.

- `/add`: Add new user.

- `/user`: Get information about a specific user.

## Built With

- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [EJS](http://ejs.co/)
