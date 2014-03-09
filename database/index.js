/**
 The Database.js enables the connection with the database.

 @module Server_App.js
 @class Server_App_database.js
 **/

var mongoose = require("mongoose"),
    defaultPort = 27017;

/**
 Connects to the database.

 @param databaseName
 @method connect
 **/
exports.connect = function(databaseName) {
    var connectionString = "mongodb://localhost:" + defaultPort + "/" + databaseName;

    mongoose.connect(connectionString, function(error){
        if (error) {
            console.log("Can not connect to database: " + connectionString + "\n" + error);
        }
        else {
            console.log("Connection established successfully to: " + connectionString);
        }
    });
};