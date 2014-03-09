/**
 The Core.Utils.js provides utility functions for the entire application.

 @module Client_Core.js
 @class Client_Core_Core.Utils.js
 **/
Core.Utils = (function() {
    ///////////////////
    // public scope
    return {

        /**
         Checks whether the given object is of type Array or not.

         @param obj
         @method isArray
         @returns a Boolean
         **/
        isArray : function(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        },

        /**
         Checks whether the given object is of type Function or not.

         @param obj
         @method isFunction
         @returns a Boolean
         **/
        isFunction : function(obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        /**
         Checks whether the given object is of type Object or not.

         @param obj
         @method isObject
         @returns a Boolean
         **/
        isObject : function(obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        },

        /**
         Checks whether the given object is of type String not.

         @param obj
         @method isString
         @returns a Boolean
         **/
        isString : function(obj) {
            return Object.prototype.toString.call(obj) === "[object String]";
        }
    };
}());