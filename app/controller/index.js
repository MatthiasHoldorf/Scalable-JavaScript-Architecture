/**
 The Controller.js module assigns the methods of concrete controller to routes of the application.

 @module Server_Controller.js
 **/

module.exports = function(app, mw) {

    // controller references
    var registrationController = require("./registrationController"),
        profileController      = require("./profileController"),
        userController         = require("./userController"),
        chatController         = require("./chatController");

    ///////////////////
    // assign controller methods to routes

    // registration
    app.get("/registration", mw.hasValidCertificate, mw.isNoRegisteredUser, registrationController.getRegistration);
    app.post("/register", mw.hasValidCertificate, registrationController.postRegister);
    app.get("/notAuthorized", registrationController.getNotAuthorized);

    // profile
    app.get("/profile", mw.isAuthenticated, profileController.getProfile);

    // user
    app.get("/users", mw.isAuthenticated, userController.getUsers);

    // chat
    app.get("/chat", mw.isAuthenticated, chatController.getChat);
};