// Importing dependencies
const path = require("path");
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
  /* config */
});

// Importing routes (make sure these paths are correct)
const gameRoutes = require("./controllers/api/gameRoutes");
const commentRoutes = require("./controllers/api/commentRoutes");
const userRoutes = require("./controllers/api/userRoutes");
const dashRoutes = require("./controllers/api/dashRoutes");

const app = express();

// Session object configuration
const sess = {
  secret: process.env.SECRET,
  cookie: {
    expires: new Date(Date.now() + 15 * 60000),
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess)); // Use the session middleware

// Set up Handlebars as the view engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
  res.render("home", {
    logged_in: req.session.logged_in,
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Use the imported route modules
app.use("/api/games", gameRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dash", dashRoutes);
app.use("/api/users", userRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Now listening on port ${process.env.PORT}`)
  );
});
