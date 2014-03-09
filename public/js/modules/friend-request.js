/**
 The friend-request.js is a module that provides the functionality of a friend-request.

 @module Client_Modules.js
 @class Client_Modules_friend-request.js
 **/
Core.register("friend-request", function(sandbox) {
    sandbox.socket.connect();
    ///////////////////
    // private scope
    var sendControls = $("#friend-request-send-controls"),
        sendRequest  = "#send-friend-request",

        ///////////////////
        // event functions

        /**
         Sends a friend request.

         @method sendFriendRequest
         **/
        sendFriendRequest = function() {
            sandbox.socket.emit("send-friend-request");
        },

        ///////////////////
        // socket functions

        /**
         Updates send controls on:
         - "friend-request-accepted"
         - "friend-request-declined"
         - "response-send-friend-request"

         @param data
         @method updateSendControls
         **/
        updateSendControls = function(data) {
            var html;

            switch(data.type) {
                case "friend-request-accepted"      : html = sandbox.templates.friend_status_friends; break;
                case "friend-request-declined"      : html = sandbox.templates.friend_status_unknown; break;
                case "response-send-friend-request" : html = sandbox.templates.friend_status_pending; break;
            }

            sendControls.empty();
            sendControls.append(html).hide().fadeIn(1250);
        }

    ///////////////////
    // public scope
    return {
        init : function() {
            sandbox.dom.delegate(sendControls, sendRequest, "click", sendFriendRequest);

            sandbox.socket.on("friend-request-accepted", updateSendControls);
            sandbox.socket.on("friend-request-declined", updateSendControls);
            sandbox.socket.on("response-send-friend-request", updateSendControls);
        },

        destroy : function() {
            sandbox.dom.undelegate(sendControls, sendRequest, "click", sendFriendRequest);

            sandbox.socket.removeListener("friend-request-accepted", updateSendControls);
            sandbox.socket.removeListener("friend-request-declined", updateSendControls);
            sandbox.socket.removeListener("response-send-friend-request", updateSendControls);
        }
    };
});