/**
 The Core.Mediator.js provides an implementation of the mediator pattern.

 @module Client_Core.js
 @class Client_Core_Core.Mediator.js
 **/
Core.Mediator = (function() {
    ///////////////////
    // private scope
    var subscriptions = {
        any : []
    };

    ///////////////////
    // public scope
    return {

        /**
         Subscribes a callback to a given channel.

         @param channel
         @param callback
         @method subscribe
         **/
        subscribe : function(channel, callback) {
            channel = channel || "any";

            if (typeof subscriptions[channel] === "undefined") {
                subscriptions[channel] = [];
            }
            subscriptions[channel].push(callback);
        },

        /**
         Unsubscribes the callback from the given channel.

         @param channel
         @param callback
         @method unsubscribe
         **/
        unsubscribe : function(channel, callback) {
            channel         = channel || "any";
            var subscribers = subscriptions[channel],
                max         = subscribers.length;


            for (var i = 0; i < max; i++) {
                if (subscribers[i] === callback) {
                    subscribers.splice(i, 1);
                }
            }
        },

        /**
         Publish an information to a given channel. The args parameter will be passed to callback function when invoked.

         @param channel
         @param args
         @method publish
         **/
        publish : function(channel, args) {
            channel         = channel || "any";
            var subscribers = subscriptions[channel],
                max         = subscribers.length;

            for (var i = 0; i < max; i++) {
                subscribers[i](args);
            }
        },

        /**
         Get all subscriptions from the mediator.

         @method getSubscriptions
         @return an array of subscribers
         **/
        getSubscriptions : function() {
            return subscriptions;
        }
    };
}());