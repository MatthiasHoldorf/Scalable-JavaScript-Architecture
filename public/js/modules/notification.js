/**
 The notification.js is a module that provides the functionality of a notifications.

 @module Client_Modules.js
 @class Client_Modules_notification.js
 **/
Core.register("notification", function(sandbox) {
    sandbox.socket.connect();
    ///////////////////
    // private scope
    var notification_list      = $("#friend-request-notification"),
        friend_list            = $("#friend-list"),
        accept_friend_request  = ".accept-friend-request",
        decline_friend_request = ".decline-friend-request",


    ///////////////////
    // event functions

    /**
     Accepts a friend request.

     @method acceptFriendRequest
     **/
    acceptFriendRequest = function() {
        sandbox.socket.emit("accept-friend-request", { "_id" : $(this).data("request-id") });
    },

    /**
     Declines a friend request.

     @method declineFriendRequest
     **/
    declineFriendRequest = function() {
        sandbox.socket.emit("decline-friend-request", { "_id" : $(this).data("request-id") });
    },

    ///////////////////
    // socket functions

    /**
     Displays a friend request notification on:
     - "friend request"

     @param data
     @method display_friend_request_notification
     **/
    display_friend_request_notification = function(data) {
        var html = sandbox.templates.friend_request_notification(data),
            li   = sandbox.dom.createElement("li");

        sandbox.dom.setBackgroundColor(li, "orange");
        sandbox.dom.setAttr(li, "data-request-id", data._id);

        sandbox.dom.prependTo(li.html(html), notification_list, "white", 3000);
    },

    /**
     Removes a friend request notification on:
     - "accept-friend-request"
     - "decline-friend-request"

     @param data
     @method remove_friend_request_notification
     **/
    remove_friend_request_notification = function(data) {
        var notification = sandbox.dom.query("li[data-request-id=" + data._id + "]", notification_list);
        sandbox.dom.fadeOut(notification, 1250);
    },

    /**
     Add a friend to the friend list on:
     - "accept-friend-request"

     @param data
     @method add_friend_to_friend_list
     **/
    add_friend_to_friend_list = function(data) {
        var html = sandbox.templates.friend(data);
        sandbox.dom.hideAppendTo(html, friend_list, 2000);
    };

    ///////////////////
    // public scope
    return {
        init : function(){
            sandbox.dom.delegate(notification_list, accept_friend_request, "click", acceptFriendRequest);
            sandbox.dom.delegate(notification_list, decline_friend_request, "click", declineFriendRequest);

            sandbox.socket.on("friend-request", display_friend_request_notification);
            sandbox.socket.on("response-accept-friend-request", add_friend_to_friend_list);
            sandbox.socket.on("response-accept-friend-request", remove_friend_request_notification);
            sandbox.socket.on("response-decline-friend-request", remove_friend_request_notification);

        },

        destroy : function(){
            sandbox.dom.undelegate(notification_list, accept_friend_request, "click", acceptFriendRequest);
            sandbox.dom.undelegate(notification_list, decline_friend_request, "click", declineFriendRequest);

            sandbox.socket.removeListener("friend-request", display_friend_request_notification);
            sandbox.socket.removeListener("response-accept-friend-request", add_friend_to_friend_list);
            sandbox.socket.removeListener("response-accept-friend-request", remove_friend_request_notification);
            sandbox.socket.removeListener("response-decline-friend-request", remove_friend_request_notification);
        }
    };
});