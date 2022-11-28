const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json())

app.post("/api/login", function (req, res, next) {
  const { userid, password } = req.body;
  console.log(req.body)
  const conn = mysql.createConnection({
    host: "localhost",
    database: "talent_management",
    password: "",
    user: "root",
  });
  conn.connect(function (error) {
    if (error) {
      return console.log(error);
    }
    console.log("connected");
    conn.query(
      `SELECT * FROM student WHERE student_id="${userid}" and password="${password}"`,
      function (err, results) {
        if (err) {
          return console.log(err);
        }
        // console.log(results)
        if (results.length > 0) {
          res.redirect("/dashboard");
        } else {
          res.redirect("/loginpage");
        }
      }
    );
  });
});
app.post("/api/joinclubs", function (req, res, next) {
  const { userid, clubid } = req.body;
  const conn = mysql.createConnection({
    host: "localhost",
    database: "talent_management",
    password: "",
    user: "root",
  });
  conn.connect(function (error) {
    if (error) {
      return res.json(error);
    }
    console.log("connect");
    conn.query(
      `INSERT INTO registration ( club_id, student_id, registration_id) VALUES ("${clubid}", "${userid}", "${
        clubid + userid
      }")`,
      function (error, results) {
        if (error) {
          return res.json({err: error});
        }
        res.json({mess: "Student has joined the club"});
      }
    );
  });
});
app.post("/api/register", function (req, res, next) {
  const { userid, email, password, name } = req.body;
  const conn = mysql.createConnection({
    host: "localhost",
    database: "talent_management",
    password: "",
    user: "root",
  });
  conn.connect(function (error) {
    if (error) {
      return console.log(error);
    }
    console.log("connected");
    conn.query(
      `INSERT INTO student (student_id,email_address , password, student_name)
        VALUES ("${userid}","${email}", "${password}", "${name}")`,
      function (err, results) {
        if (err) {
          return console.log(err);
        }
        console.log("Student successfully added");
      }
    );
  });
  res.redirect("/loginpage");
});

app.get("/dashboard", function (req, res, next) {
  res.render("dashboard");
});

app.get("/loginpage", function (req, res, next) {
  res.render("loginpage");
});

app.use(function (req, res, next) {
  res.send("<h1>Page Does not exist</h1>");
});

app.listen(2000);
