/**
 The Utils.js provides utility functions for the entire application.

 @module Server_App.js
 @class Server_App_Utils.js
 **/

/**
 Order a user's messages by date (most recent first) and formats the date into a string: mm:hh dd:mm:yyyy

 @param user
 @method formatMessages
 @return a User object
 **/
var formatMessages = function(user) {
    try {
        // reverse order of messages by date (most recent messages first)
        user.messages.sort(function(a, b) {
            a = new Date(a.date);
            b = new Date(b.date);

            return a > b ? -1 : a < b ? 1 : 0;
        });

        // format dates (mm:hh dd:mm:yyyy)
        for (var i = 0; i < user.messages.length; i++) {
            // "user.messages[i].date" isn't mutable (due to mongoose) => create a new object instead
            user.messages[i] = {
                from: user.messages[i]._id,
                name: user.messages[i].name,
                body: user.messages[i].body,
                _id: user.messages[i]._id,
                date: formatDate(user.messages[i].date)
            };
        }

        return user;
    }
    catch(e) {
        console.log("Formatting message of user failed. " + e);
    }
};

/**
 Formats the date into a string: mm:hh dd:mm:yyyy

 @param date
 @method formatDate
 @return a String representing a Date
 **/
var formatDate = function(date) {
    var _date = new Date(date),
        min = _date.getMinutes() < 10 ? "0" + _date.getMinutes() : _date.getMinutes(),
        h = _date.getHours() < 10 ? "0" + _date.getHours() : _date.getHours(),
        d = _date.getDate() < 10 ? "0" + _date.getDate() : _date.getDate(),
        m = (_date.getMonth() + 1) < 10 ? "0" + (_date.getMonth() + 1) :  (_date.getMonth() + 1),
        y = _date.getFullYear();

    return h + ":" + min +  "   " + d + "." + m + "." + y;
};

/**
 Returns the time now (hh:mm)

 @method timeNow
 @return a String representing the current Time
 **/
var timeNow = function() {
    var d = new Date();
    return ((d.getHours() < 10)?"0":"") + d.getHours() +":"+ ((d.getMinutes() < 10)?"0":"") + d.getMinutes();
};

/**
 Search a value in an array by a provided key, return true if the value exist; false if it doesn't

 @param array, key, value
 @method inArray
 @return a Boolean
 **/
var inArray = function(array, key, value) {
    var res = false,
        length = array.length;

    for (var i = 0; i < length; i++) {
        if (array[i][key] == value){
            res = true;
        }
    }
    return res;
};

/**
 Search a value in an array by a provided key, if the value exists, remove it

 @param array, key, value
 @method removeFromArray
 @return a Boolean
 **/
var removeFromArray = function(array, key, value) {
    var length = array.length;

    for (var i = 0; i < length; i++) {
        if (array[i][key] == value){
            array.splice(i, 1);
        }
    }
};

// order messages by date (most recent first)
// and formats the date into string: mm:hh dd:mm:yyyy
exports.formatMessages = formatMessages;

// formats the date into a string: mm:hh dd:mm:yyyy
exports.formatDate = formatDate;

// the time now (hh:mm)
exports.timeNow = timeNow;

// search a value in an array by a provided key, return true if the value exist; false if it doesn't
exports.inArray = inArray;

// search a value in an array by a provided key, if the value exists, remove it
exports.removeFromArray = removeFromArray;