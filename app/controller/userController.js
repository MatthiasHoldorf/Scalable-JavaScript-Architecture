/**
 The userController.js exposes methods regarding the user view.

 @module Server_Controller.js
 @class Server_Controller_userController.js
 **/

// module dependencies
var model = require("../model");

/**
 Render the user view.

 @param req
 @param res
 @method getUsers
 **/
exports.getUsers = function(req, res) {
    model.UserModel.getUsers(function(userList) {
        return res.render('users', {
            title: "User",
            userList: userList
        });
    });
};
