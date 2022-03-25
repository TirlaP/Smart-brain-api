const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    user: "postgres", //add your user name for the database here
    port: 5432, // add your port number here
    password: "c6779d3c", //add your correct password in here
    database: "smart-brain", //add your database name you created here
  },
});

const app = express();

// PARSING DATA -> IMPORTANT!!!!!
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// EVERY TIME we restart the server, the code gets runned all over again because
// we are using JavaScript variables to store data, and not an actual database
// SOOO -> we loose all the information added when we restart
app.get("/", (req, res) => {
  res.send("Success");
});

//////////////////////////////
// SIGN IN

// Same as (req, res) => {
//   register.handleSignin(req, res, db, bcrypt);
// }
app.post("/signin", signin.handleSignin(db, bcrypt));

//////////////////////////////
// REGISTER

// New user created
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//////////////////////////////
// PROFILE

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//////////////////////////////
// IMAGE Count

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
