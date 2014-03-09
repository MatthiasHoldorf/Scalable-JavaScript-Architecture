YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Client_Core_Core.Ajax.js",
        "Client_Core_Core.DomManipulation.js",
        "Client_Core_Core.Mediator.js",
        "Client_Core_Core.Socket.js",
        "Client_Core_Core.Templates.js",
        "Client_Core_Core.Utils.js",
        "Client_Core_Core.js",
        "Client_Main.js",
        "Client_Modules_chat.js",
        "Client_Modules_corkboard.js",
        "Client_Modules_friend-request.js",
        "Client_Modules_notification.js",
        "Client_Modules_registration.js",
        "Client_Sandbox.js",
        "Server_App_Gruntfile.js",
        "Server_App_Socket.js",
        "Server_App_Utils.js",
        "Server_App_database.js",
        "Server_App_middleware.js",
        "Server_Controller_chatController.js",
        "Server_Controller_profileController.js",
        "Server_Controller_registrationController.js",
        "Server_Controller_userController.js",
        "Server_Model_userModel.js"
    ],
    "modules": [
        "App.js",
        "Client_Core.js",
        "Client_Modules.js",
        "Client_Sandbox.js",
        "Server_App.js",
        "Server_Controller.js",
        "Server_Model.js"
    ],
    "allModules": [
        {
            "displayName": "App.js",
            "name": "App.js",
            "description": "Starting point of the application.\nThe App.js module is used to configure the application, including:\n- npm module delegation to other modules\n- environment settings for default, test, development and production\n- the routing and default route of the application\n- the https options\n- starting the socket server"
        },
        {
            "displayName": "Client_Core.js",
            "name": "Client_Core.js",
            "description": "The Main.js module is the starting point of the client side JavaScript application.\nIt starts and stops modules depending on the site the user is visiting."
        },
        {
            "displayName": "Client_Modules.js",
            "name": "Client_Modules.js",
            "description": "The chat.js is a module that provides the functionality of a chat."
        },
        {
            "displayName": "Client_Sandbox.js",
            "name": "Client_Sandbox.js",
            "description": "The Sandbox.js is used as a facade and proxy for the Core.js."
        },
        {
            "displayName": "Server_App.js",
            "name": "Server_App.js",
            "description": "The Gruntfile.js enables minification and concatenation of JavaScript files."
        },
        {
            "displayName": "Server_Controller.js",
            "name": "Server_Controller.js",
            "description": "The chatController.js exposes methods regarding the chat view."
        },
        {
            "displayName": "Server_Model.js",
            "name": "Server_Model.js",
            "description": "The Model.js module provides the database model for the application."
        }
    ]
} };
});