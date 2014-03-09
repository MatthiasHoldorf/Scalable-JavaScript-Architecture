/**
 The registrationController.js exposes methods regarding the registration view.

 @module Server_Controller.js
 @class Server_Controller_registrationController.js
 **/

// module dependencies
var model = require("../model"),
    utils = require("../../utils");

/**
 Render the registration view.

 @param req
 @param res
 @method getRegistration
 **/
exports.getRegistration = function(req, res) {
    return res.render('./standalone/registration', {
        title: "Registration"
    });
};

/**
 Render the NotAuthorized view.

 @param req
 @param res
 @method getNotAuthorized
 **/
exports.getNotAuthorized = function(req, res) {
    return res.render("./standalone/notAuthorized", {
        title: "Not authorized"
    });
};

/**
 Registration of a user.
 This method is called via ajax from client side javascript.
 On a successful registration the function returns a JSON containing the newly created user's userId.
 If the registration is not successful, it returns a JSON containing the validation error(s): (validationError, databaseError, unknownError)

 @param req
 @param res
 @method getNotAuthorized
 @returns a JSON
 **/
exports.postRegister = function(req, res) {

    // get the id _id the request certificate
    var certId = req.connection.getPeerCertificate().subject.CN;

    // create user object
    var user = new model.UserModel({
            _id : certId,
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email
        }
    );

    // try to save the new user
    user.save(function(error, user) {
        ///////////////////
        // validation
        if (error) {
            var validationError, databaseError, unknownError;

            // validation error
            if (error.name === "ValidationError") {
                validationError = {
                    first_name : error.errors.first_name,
                    last_name  : error.errors.last_name,
                    email      : error.errors.email
                };
            }

            // duplicate key error
            // since the user object is created new, mongoose will check for the field "_id" (naming convention) to be unique.
            else if (error.code === 11000) {
                databaseError = "You are already registered!";
            }

            // unknown error
            else {
                unknownError = "Something went wrong!";
            }

            // registration failed, return validation errors
            return res.json(
                   {
                       validationError : validationError,
                       databaseError   : databaseError,
                       unknownError    : unknownError
                   }
            );
        }
        else {
            // registration successful, return newly user's created userId
            req.session.user = user;
            return res.send(
                   {
                       userId : user._id
                   }
            );
        }
    });
};