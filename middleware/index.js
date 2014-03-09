/**
 The Middleware.js provides middleware for the routing of the application.

 @module Server_App.js
 @class Server_App_middleware.js
 **/

var model = require("../app/model");

/**
 Verifies the authentication of a user:
 - redirects to registration view if the user is authorized but not a registered user
 - redirects to notAuthorized view if the user is not authorized (no valid certificate)
 - if the user is authorized (whether he is stored in session or not) the middle ware will call next()

 @param req
 @param res
 @param next
 @method isAuthenticated
 **/
exports.isAuthenticated = function(req, res, next) {
    if(req.client.authorized) {
            // user authorized
            if (!req.session.user) {

            // set user session
            var cert = req.connection.getPeerCertificate().subject;

            model.UserModel.findOne({ "_id" : cert.CN }, function(error, user) {
                if (error) {
                    console.log("Error in database " + error);
                }
                else if (!user) {
                    return res.redirect("/registration");
                }
                else {
                    console.log("User stored in session");
                    req.session.user = user;
                    next();
                }
            });
        }
        else {
            // user is authorized and session is already set
            next();
        }
    }
    else {
        // user is not authorized
        return res.redirect("/notAuthorized");
    }
};

/**
 Verifies if the user has a valid certificate.

 @param req
 @param res
 @param next
 @method hasValidCertificate
 **/
exports.hasValidCertificate = function(req, res, next) {
    if (req.client.authorized) {
        next();
    }
    else {
        // user not authorized
        return res.redirect("/notAuthorized");
    }
};

/**
 Verifies if the user is registered.
 - redirects to profile View if the user is registered

 @param req
 @param res
 @param next
 @method isNoRegisteredUser
 **/
exports.isNoRegisteredUser = function(req, res, next) {
    var certId = req.connection.getPeerCertificate().subject.CN;

    model.UserModel.findOne({ "_id" : certId}, function(error, user) {
        if (error) {
            console.log("Error in database " + error);
        }
        else if (!user) {
            // no user with id of certId exists
            next();
        }
        else {
            // user exists, redirect to own profile
            res.redirect("/profile?userId=" + user._id);
        }
    });
};