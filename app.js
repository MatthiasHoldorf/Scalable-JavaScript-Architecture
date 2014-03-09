/**
 Starting point of the application.
 The App.js module is used to configure the application, including:
 - npm module delegation to other modules
 - environment settings for default, test, development and production
 - the routing and default route of the application
 - the https options
 - starting the socket server

 @module App.js
 **/

// module dependencies
// built-in
var express = require('express'),
    https   = require('https'),
    path    = require('path'),
    fs      = require("fs"),
    app     = express(),

//  third-party
    io           = require("socket.io"),
    db           = require("./database"),
    sessionStore = new express.session.MemoryStore(),

// own modules
    mw    = require("./middleware"),
    utils = require("./utils"),
    model = require("./app/model");

///////////////////
// configuration

// all environments
app.configure(function() {
    app.set("port", process.env.PORT || 8080);
    app.set("views", __dirname + "/app/view");
    app.set("view engine", "jade");

    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser("secret"));
    app.use(express.session({
        key: "connect.sid",
        store: sessionStore
    }));
    app.use(express.static(path.join(__dirname, "public")));
    require("./app/controller")(app, mw, utils, model);
});

// development environment
app.configure("development", function() {
    db.connect("sn_dev");
});

// test environment
app.configure("test", function() {
    db.connect("sn_test");
});

//// production environment
app.configure("production", function() {
    db.connect("sn");
});

///////////////////
// routing

// default route: if no other route matches, redirect to user's own profile
app.all("*", mw.isAuthenticated, function(req, res) {
    // redirect to user's own profile
    return res.redirect("/profile?userId=" + req.session.user._id);
});

///////////////////
// https options
httpsOptions = {
    key :  fs.readFileSync("./private/keys/Server.key"),
    cert:  fs.readFileSync("./private/certs/Server.crt"),
    ca:    fs.readFileSync("./private/ca/CA.crt"),
    requestCert: true,
    rejectUnauthorized: false
};

///////////////////
// start https server
var server = https.createServer(httpsOptions, app).listen(app.get("port"), function() {
    console.log("Server listening on port " + app.get("port"));
});

///////////////////
// start socket server
require("./socket")(server, sessionStore);

///////////////////
// expose server
exports = module.exports = server;