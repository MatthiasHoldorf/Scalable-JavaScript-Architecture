/**
 The Main.js module is the starting point of the client side JavaScript application.
 It starts and stops modules depending on the site the user is visiting.

 @module Client_Core.js
 @class Client_Main.js
 **/

Core.DomManipulation.ready(document, function() {

    // get the current site the user is visiting
    var url  = window.location.href.split("/"),
        site = url[url.length - 1].split("?")[0];

    // stop all modules
    Core.stopAll();

    // start modules depending on which site the user is visiting
    if (site == "registration") {
        Core.start("registration");
    }

    if (site == "profile") {
        Core.start("corkboard");
        Core.start("friend-request");
        Core.start("notification");
    }

    if (site == "chat") {
        Core.start("chat");
    }

});