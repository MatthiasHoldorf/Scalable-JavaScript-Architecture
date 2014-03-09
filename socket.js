/**
 The Socket.js is used for real-time communication with the client, including the following functionality:
 - authorization to store the user's session into the session store
 - separation of sockets with rooms (namespaces)
 - listens to the events: sendCorkboardMessage, sendFriendRequest, acceptFriendRequest, declineFriendRequest and sendChatMessage

 @module Server_App.js
 @class Server_App_Socket.js
 **/

// module dependencies
var utils       = require("./utils"),
    model       = require("./app/model"),
    io          = require("socket.io"),
    parseCookie = require("express").cookieParser("secret"),
    sanitizer   = require("sanitizer"),
    // when a clients (re)connects to the chat, previous message are displayed
    previousMessages = [];

module.exports = function(server, sessionStore) {

    ///////////////////
    // start socket server
    var sio = io.listen(server);

    ///////////////////
    // disable socket.io debugging
    sio.set('log level', 1);

    ///////////////////
    // authorization
    sio.set('authorization', function(handshake, accept) {

        // no cookies where send
        if (!handshake.headers) {
            return accept('Cookie required.', false);
        }

        // 1) parse cookie to get the sid
        // 2) get the session from session store by the sid as key
        // 3) save the session into the handshake object
        parseCookie(handshake, null, function(error) {
            if (error) {
                return accept("Error parsing Cookie.", false);
            }
            else {
                var sessionID = handshake.signedCookies["connect.sid"];

                if (sessionID) {
                    sessionStore.get(sessionID, function(error, session) {
                        if (error) {
                            return accept("Error in session store.", false);
                        }
                        else if (!session) {
                            return accept("Session not found.", false);
                        }
                        else {
                            // success: session found
                            handshake.session = session;
                            return accept(null, true);
                        }
                    });
                }
            }
        });

    });


    ///////////////////
    // socket.io connection
    sio.on("connection", function(socket) {

        ///////////////////
        // rooms
        // owner of a specific profile page
        socket.join(socket.handshake.session.user._id);
        // people viewing a specific profile page
        socket.join("viewing-profile:" + socket.handshake.session.last_visited_profileId);

        ///////////////////
        // initialize chat
        // by connection to the socket (only one time) emit older chat messages, if there are any and the user is on the chat page
        var location = (socket.handshake.headers.referer).split("/");
        if (previousMessages.length && (location[location.length - 1] == "chat")) {
            socket.emit("chat-message-initial", previousMessages);
        }

        ///////////////////
        // events
        // profile.jade [corkboard]
        socket.on("send-corkboard-message", sendCorkboardMessage);

        // profile.jade [friend-request]
        socket.on("send-friend-request", sendFriendRequest);
        socket.on("accept-friend-request", acceptFriendRequest);
        socket.on("decline-friend-request", declineFriendRequest);

        // chat.jade [chat]
        socket.on("send-chat-message", sendChatMessage);

        ///////////////////
        // methods


        /**
         When a client emits a corkboard message, query the user's profile,
         to whom the message will be send (session.last_visited_profileId).
         Create a message object, save it to that user and emit the message object to all clients viewing this profile.

         @param data
         @method sendCorkboardMessage
         **/
        function sendCorkboardMessage(data) {
            // only proceed if message contains at least 1 character
            if (data.body.length > 0) {

                // find profile to whom the message will be emitted
                model.UserModel.getUser(socket.handshake.session.last_visited_profileId, function(user) {

                    // create message
                    var message = {
                        _id  : socket.handshake.session.user._id,
                        name : socket.handshake.session.user.first_name,
                        body : data.body,
                        date : new Date().setMonth(new Date().getMonth())
                    };

                    // apply message to user and save user
                    user.messages.push(message);
                    user.save();

                    // format message before sending it to client
                    message.date = utils.formatDate(message.date);

                    // escape message
                    message.body = sanitizer.escape(message.body);

                    // emit message to all clients that view the specific profile page
                    sio.sockets.in("viewing-profile:" + socket.handshake.session.last_visited_profileId).emit("corkboard-message", message);
                });
            }
        }

        /**
         Sends a friend request to the user whom the request is related to.

         @method sendFriendRequest
         **/
        function sendFriendRequest() {
            var profileId = socket.handshake.session.last_visited_profileId;

            // find user to whom the friend request is related to
            model.UserModel.getUser(profileId, function(user) {

                // validation
                // validate if there is already a pending friend request to that user
                var hasPendingFriendRequest = utils.inArray(user.pendingFriendRequests, "_id", profileId);

                // validate if the users are already friends
                var areAlreadyFriends = utils.inArray(user.friends, "_id", profileId);

                if (!hasPendingFriendRequest && !areAlreadyFriends) {

                    user.pendingFriendRequests.push({
                        _id : socket.handshake.session.user._id,
                        name : socket.handshake.session.user.first_name + " " + socket.handshake.session.user.last_name
                    });

                    // update user in database
                    user.save(function(error) {
                        if (error) {
                            console.log("Error saving\n" + error);
                        }
                        else {
                            // operation completed with success
                            socket.emit("response-send-friend-request", { type : "response-send-friend-request" });

                            // emit friend request to user whom the request is related to
                            sio.sockets.in(profileId).emit("friend-request", {
                                _id      : socket.handshake.session.user._id,
                                fullname : socket.handshake.session.user.first_name + " " + socket.handshake.session.user.last_name
                            });
                        }
                    });
                }
            });
        }

        /**
         Accepts a friend request from a given user.

         @param data
         @method acceptFriendRequest
         **/
        function acceptFriendRequest(data) {
            model.UserModel.getUser(socket.handshake.session.user._id, function(user) {

                // validation
                // validate if there is already a pending friend request to that user
                var hasPendingFriendRequest = utils.inArray(user.pendingFriendRequests, "_id", data._id);

                // validate if the users are already friends
                var areAlreadyFriends = utils.inArray(user.friends, "_id", data._id);

                if (hasPendingFriendRequest && !areAlreadyFriends) {

                    model.UserModel.getUser(data._id, function(requestUser) {
                        // remove pending friend request
                        utils.removeFromArray(user.pendingFriendRequests, "_id", requestUser._id);

                        // befriend both user
                        user.friends.push({
                            _id : requestUser._id,
                            name : requestUser.first_name + " " + requestUser.last_name
                        });
                        requestUser.friends.push({
                            _id : user._id,
                            name : user.first_name + " " + user.last_name
                        });

                        // update both user in database
                        user.save(function(error) {
                            if (error) {
                                console.log("Error saving\n" + error);
                            }
                            else {
                                requestUser.save(function(error) {
                                    if (error) {
                                        console.log("Error saving\n" + error);
                                    }
                                    else {
                                        // emit to all viewing the two profile pagess
                                        sio.sockets.in("viewing-profile:" + user._id).emit("response-accept-friend-request", { _id : requestUser._id, fullname : requestUser.first_name + " " + requestUser.last_name });
                                        sio.sockets.in("viewing-profile:" + requestUser._id).emit("response-accept-friend-request", { _id : requestUser._id, fullname : requestUser.first_name + " " + requestUser.last_name });

                                        // emit accept to requester
                                        sio.sockets.in(requestUser._id).emit("friend-request-accepted", { type : "friend-request-accepted" });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }

        /**
         Declines a friend request from a given user.

         @param data
         @method declineFriendRequest
         **/
        function declineFriendRequest(data) {
            model.UserModel.getUser(socket.handshake.session.user._id, function(user) {

                // validation
                // validate if there is already a pending friend request to that user
                var hasPendingFriendRequest = utils.inArray(user.pendingFriendRequests, "_id", data._id);

                // validate if the users are already friends
                var areAlreadyFriends = utils.inArray(user.friends, "_id", data._id);

                if (hasPendingFriendRequest && !areAlreadyFriends) {

                    model.UserModel.getUser(data._id, function(requestUser) {

                        // remove pending friend request
                        utils.removeFromArray(user.pendingFriendRequests, "_id", requestUser._id);

                        // update user in database
                        user.save(function(error){
                            if (error) {
                                console.log("Error saving\n" + error);
                            }
                            else {
                                console.log("successfully saved");

                                // emit decline to owner of the profile
                                sio.sockets.in(user._id).emit("response-decline-friend-request", { _id : requestUser._id });

                                // emit decline to requester
                                sio.sockets.in(requestUser._id).emit("friend-request-declined", { type : "friend-request-declined" });
                            }
                        });
                    });
                }
            });
        }

        /**
         When a user emits a chat-message, extend the message object with userId and time.
         After saving the extended message object in an array, emit the message object to all clients

         @param data
         @method sendChatMessage
         **/
        function sendChatMessage(data) {
            // only proceed if message contains at least 1 character
            if (data.body.length > 0) {

                // escape message
                data.body = sanitizer.escape(data.body);

                // extend data object
                data.user = socket.handshake.session.user;
                data.time = utils.timeNow();

                // save messages
                previousMessages.push(data);

                // keep a maximum of 30 message in the previousMessage array
                if (previousMessages.length > 30) {
                    previousMessages.splice(0, 1);
                }

                // emit message to all clients
                sio.sockets.emit("chat-message", data);
            }
        }
    });
};