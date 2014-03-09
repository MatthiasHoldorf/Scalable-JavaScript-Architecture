/**
 The chat.js is a module that provides the functionality of a chat.

 @module Client_Modules.js
 @class Client_Modules_chat.js
 **/
Core.register("chat", function(sandbox) {
    sandbox.socket.connect();
    ///////////////////
    // private scope
    var messages          = [],
        chat_message_list = $("#chat-message-list"),
        new_chat_message  = $("#new-chat-message"),
        sendButton        = $("#send-chat-message"),

        ///////////////////
        // event functions

        /**
         Send a chat-message via the send button.

         @method button_send_message
         **/
        button_send_message = function() {
            var message = sandbox.dom.getValue(new_chat_message);

            if (message.length > 0) {
                sandbox.socket.emit("send-chat-message", { body : message });
                sandbox.dom.setValue(new_chat_message, "");
                new_chat_message.focus();
            }
        },

        /**
         Send a chat-message by hitting enter within the input field.

         @param e
         @method field_send_message
         **/
        field_send_message = function(e) {
            if (e.keyCode == 13 || e.which == 13) {
                button_send_message();
                return false;
            }
        },

        ///////////////////
        // socket functions

        /**
         Displays multiple chat-messages.

         @param data
         @method displayMultipleMessages
         **/
        displayMultipleMessages = function(data) {
            for (var i = 0; i < data.length; i++) {
                var newMessage = sandbox.templates.chat_message(data[i]);
                messages.push(newMessage);
            }

            sandbox.dom.appendToList(chat_message_list, messages);
            sandbox.dom.scrollDown(chat_message_list);
        },

        /**
         Displays a single chat-message.

         @param data
         @method displaySingleMessage
         **/
        displaySingleMessage = function(data) {
            var newMessage = sandbox.templates.chat_message(data);
            messages.push(newMessage);

            sandbox.dom.appendToList(chat_message_list, newMessage);
            sandbox.dom.scrollDown(chat_message_list);
        };

    ///////////////////
    // public scope
    return {
        init : function() {
            sandbox.dom.bind(sendButton, "click", button_send_message);
            sandbox.dom.bind(new_chat_message, "keyup", field_send_message);

            sandbox.socket.on("chat-message-initial", displayMultipleMessages);
            sandbox.socket.on("chat-message", displaySingleMessage);
        },
        destroy : function() {
            sandbox.dom.unbind(sendButton, "click", button_send_message);
            sandbox.dom.unbind(new_chat_message, "keyup", field_send_message);

            sandbox.socket.removeListener("chat-message-initial", displayMultipleMessages);
            sandbox.socket.removeListener("chat-message", displaySingleMessage);
        }
    };
});