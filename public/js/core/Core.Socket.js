/**
 The Core.Socket.js is used to communicate with the socket server.

 @module Client_Core.js
 @class Client_Core_Core.Socket.js
 **/
Core.Socket = (function() {
    ///////////////////
    // private scope
    var connection_string = "https://localhost:8080",
        socket,

        socket_connect = function() {
        if (!socket) {
            socket = io.connect( connection_string );
        }
        return socket;
    };

    ///////////////////
    // public scope
    return {

        /**
         Connects to a socket server.

         @method connect
         **/
        connect : socket_connect,

        /**
         Emits a message to a socket server.

         @param channel
         @param args
         @method emit
         **/
        emit : function(channel, args) {
            socket.emit(channel, args);
        },

        /**
         Register a callback to a given channel.

         @param channel
         @param callback
         @method on
         **/
        on : function(channel, callback) {
            socket.on(channel, callback);
        },

        /**
         Register a callback to a given channel.

         @param channel
         @param callback
         @method removeListener
         **/
        removeListener : function(channel, callback) {
            socket.removeListener(channel, callback);
        }
    };
}());