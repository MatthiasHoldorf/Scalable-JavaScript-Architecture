/**
 The chatController.js exposes methods regarding the chat view.

 @module Server_Controller.js
 @class Server_Controller_chatController.js
 **/

/**
 Render the chat view.

 @param req
 @param res
 @method getChat
 **/
exports.getChat = function(req, res) {
    return res.render('chat', {
        title: "Chat"
    });
};
