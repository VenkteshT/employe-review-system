// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// express
const express = require("express");
const app = express();
const expresslayouts = require("express-ejs-layouts");

// passport
const passport = require("passport");
const LocalStrategy = require("./config/passport-local-strategy");

// mongoose and database
const DB = require("./config/mongoose");
const mongoStore = require("connect-mongo");

// others
const bodyparser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const authController = require("./controller/auth");
const cookieparser = require("cookie-parser");
const gloablErrorHandler = require("./controller/error");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("./asset"));
app.use(cookieparser());
app.use(expresslayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up session cookie
app.use(
  session({
    name: "employe review system",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRETE,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
    store: mongoStore.create(
      {
        mongoUrl: process.env.DATABASE,
        autoRemove: "disabled",
      },
      (err) => console.log(err.message || "connect mongo error")
    ),
  })
);

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(authController.setAuthenticatedUser);

// flash middlewares
app.use(flash());
app.use(require("./config/flashMware").setFlash);

// set view engine as ejs
app.set("view engine", "ejs");
app.set("views", "./view");

// route
app.use("/", require("./route"));

// Global error handler
app.use(gloablErrorHandler);

// start server;
const port = process.env.PORT;
app.listen(port || 7000, (err) => {
  if (err) {
    console.log("error in connecting to server:", err.message);
    process.exit(1);
  }
  console.log("server started on port:", port);
});
