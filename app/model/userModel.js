/**
 The userModel.js provides and exposes the UserModel.

 @module Server_Model.js
 @class Server_Model_userModel.js
 **/

// module dependencies
var mongoose = require("mongoose"),
    Schema   = mongoose.Schema;

///////////////////
// options
var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

///////////////////
// schema
var userSchema = new Schema({
    _id : { type : Number, index : true, required: true },
    first_name : { type : String, required: true },
    last_name : { type : String, required: true },
    email : { type : String, required: true },
    friends :  [{
        _id : { type : Number },
        name : String
    }],
    pendingFriendRequests : [{
        _id : { type : Number },
        name : String
    }],
    messages : [{
        _id:  { type : Number, required: true },
        name: String,
        body : String,
        date : { type : Date, default: Date.now}
    }]
}, schemaOptions, { collection : "users"});

///////////////////
// virtuals
userSchema.virtual("full_name").get(function(){
    return this.first_name + " " + this.last_name;
});

///////////////////
// statics

/**
 Query a single user from the database.

 @param userId
 @param callback
 @method getUser
 @returns a User object
 **/
userSchema.statics.getUser = function(userId, callback){
    this.findOne({"_id" : userId}, function(error, user){
        if( error ) {
            console.log("Error in database! " + error);
        }
        else if(!user) {
            console.log("Can't find user with the id: " + userId);
            callback(null);
        }
        else {
            callback(user);
        }
    });
};

/**
 Query an array of user from the database.

 @param callback
 @method getUsers
 @returns a User object
 **/
userSchema.statics.getUsers = function(callback) {
    this.find({}, function(error, user) {
        if (error){
            console.log("Error in database! " + error);
        }
        else if (!user) {
            console.log("Can't find any user!");
            callback(null);
        }
        else {
            callback(user);
        }
    });
};

///////////////////
// validation

// length of: first_name, last_name and email must be at least 3 characters
userSchema.path("first_name").validate(function(value) {
    if(!value) return false;
    return value.length >= 3;
}, "First name isn't at least 3 characters long!");

userSchema.path("last_name").validate(function(value) {
    if(!value) return false;
    return value.length >= 3;
}, "Last name isn't at least 3 characters long!");

userSchema.path("email").validate(function(value) {
    if(!value) return false;
    return value.length >= 3;
}, "Email isn't at least 3 characters long!");

///////////////////
// export
exports.UserModel = mongoose.model("User", userSchema);