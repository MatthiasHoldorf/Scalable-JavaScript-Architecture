/**
 The corkboard.js is a module that provides the functionality of a corkboard.

 @module Client_Modules.js
 @class Client_Modules_corkboard.js
 **/
Core.register("corkboard", function(sandbox) {
    sandbox.socket.connect();
    ///////////////////
    // private scope
    var corkboard_message_list = sandbox.dom.query("#corkboard-message-list"),
        new_corkboard_message  = sandbox.dom.query("#new-corkboard-message"),
        send_button            = sandbox.dom.query("#send-corkboard-message"),

        ///////////////////
        // event functions

        /**
         Send a corkboard-message via the send button.

         @method button_send_message
         **/
        button_send_message = function() {
            var message = sandbox.dom.getValue(new_corkboard_message);

            if(message.length > 0) {
                sandbox.socket.emit("send-corkboard-message", { body : message } );
                sandbox.dom.setValue(new_corkboard_message, "");
                new_corkboard_message.focus();
            }
        },

        /**
         Send a corkboard-message by hitting enter within the text area.

         @param e
         @method field_send_message
         **/
        field_send_message = function(e) {
            if(e.keyCode == 13 || e.which == 13) {
                button_send_message();
            }
            return false;
        },

        ///////////////////
        // socket functions

        /**
         Displays a corkboard message.

         @method displayMessage
         **/
        displayMessage = function(data) {
            var html =  sandbox.templates.corkboard_message(data),
                li   =  sandbox.dom.createElement("li");

            sandbox.dom.setBackgroundColor(li, "orange");
            sandbox.dom.prependTo(li.html(html), corkboard_message_list, "white", 3000);
        };

    ///////////////////
    // public scope
    return {
        init : function() {
            sandbox.dom.bind(send_button, "click", button_send_message);
            sandbox.dom.bind(new_corkboard_message, "keyup", field_send_message);

            sandbox.socket.on("corkboard-message", displayMessage);
        },
        destroy : function() {
            sandbox.dom.unbind(send_button, "click", button_send_message);
            sandbox.dom.unbind(new_corkboard_message, "keyup", field_send_message);

            sandbox.socket.removeListener("corkboard-message", displayMessage);
        }
    };
});