/**
 The Core.js provides functionality to register, start and stop modules of the application.

 @module Client_Core.js
 @class Client_Core_Core.js
 **/
var Core = (function() {
    ///////////////////
    // private scope

     /**
     Contains the registered modules.

     @property moduleData
     @type Object
     **/
    var moduleData     = {},
        runningModules = {};

    ///////////////////
    // public scope
    return {

        /**
         Registers a module by the moduleId parameter as a key and the creator parameter as the function.

         This method will throw an error if:
         - The moduleId parameter provided isn't a String
         - The moduleId parameter provided isn't at least 3 characters long
         - The creator parameter provided isn't a function

         @param moduleId {String} The module name
         @param creator  {Function} The module function itself
         @method register
         **/
        register : function(moduleId, creator) {
            if (!(typeof moduleId === "string")) {
                throw new Error("The moduleId is not a string")
            }

            if (!(moduleId.length >= 2)) {
                throw new Error("The moduleId must contain at least 2 characters")
            }

            if (!(Object.prototype.toString.call(creator) === "[object Function]")) {
                throw new Error("The creator must be a function");
            }

            moduleData[moduleId] = {
                creator: creator,
                instance: null
            };
        },

        /**
         Removes a module identified by the provided moduleId.

         This method will throw an error if:
         - No module can be find by the provided moduleId

         @param moduleId {String} The module name
         @method remove
         **/
        remove : function(moduleId) {
            if (moduleData[moduleId] === undefined) {
                throw new Error("Attempt to remove a module that has not been registered: " + moduleId);
            }

            delete moduleData[moduleId];
        },

        /**
         Starts a module identified by the  moduleId parameter, if the module isn't already running.

         This method will throw an error if:
         - No module can be find by the provided moduleId parameter

         @param moduleId {String} The module name
         @method start
         **/
        start : function(moduleId) {
            if (moduleData[moduleId] === undefined) {
                throw new Error("Attempt to start a module that has not been registered: " + moduleId);
            }
            // only start a module that isn't already started
            else if (moduleData[moduleId].instance === null) {
                moduleData[moduleId].instance = moduleData[moduleId].creator(new Sandbox(this , moduleId));

                try {
                    moduleData[moduleId].instance.init();
                    runningModules[moduleId] = moduleData[moduleId];
                }
                catch(e) {
                    throw new Error("The creator must have a property init of type function");
                }

                console.log("start: " + moduleId);
            }
        },

        /**
         Stops a module identified by the provided moduleId.

         This method will throw an error if:
         - No module can be find by the provided moduleId

         @param moduleId {String} The module namee
         @method stop
         **/
        stop : function(moduleId) {
            if (moduleData[moduleId] === undefined) {
                throw new Error("Attempt to stop a module that has not been registered: " + moduleId);
            }

            var data = moduleData[moduleId];
            if (data.instance) {
                data.instance.destroy();
                data.instance = null;
            }
        },

        /**
         Starts all registered modules of the Core.

         @method startAll
         **/
        startAll : function() {
            for (var moduleId in moduleData) {
                if (moduleData.hasOwnProperty(moduleId)) {
                    this.start(moduleId);
                    console.log(moduleId);
                }
            }
        },

        /**
         Stops all running modules of the Core.

         @method stopAll
         **/
        stopAll : function() {
            for (var moduleId in moduleData) {
                if (moduleData.hasOwnProperty(moduleId)) {
                    this.stop(moduleId);
                }
            }
        },

        /**
         Returns the registered modules of the Core.

         @method getModuleData
         @return an array of modules
         **/
        getModuleData : function() {
            return moduleData;
        },

        /**
         Returns all running modules of the Core.

         @method getRunningModules
         @return an array of modules
         **/
        getRunningModules : function() {
            return runningModules;
        }

    };
}());