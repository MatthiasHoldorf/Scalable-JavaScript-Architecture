/**
 The Sandbox.js is used as a facade and proxy for the Core.js.

 @module Client_Sandbox.js
 @class Client_Sandbox.js
 **/
var Sandbox = function( core, moduleId ) {
    ///////////////////
    // private scope
    var core_socket    = core.Socket,
        core_mediator  = core.Mediator,
        core_dom       = core.DomManipulation,
        core_ajax      = core.Ajax,
        core_templates = core.Templates,
        core_utils     = core.Utils,

        // permissions of modules to emit messages to the socket server
        permissions_emit = {
            "registration" : {
                "send-corkboard-message" : false,
                "send-friend-request"    : false,
                "accept-friend-request"  : false,
                "decline-friend-request" : false,
                "send-chat-message"      : false
            },
            "corkboard" : {
                "send-corkboard-message" : true,
                "send-friend-request"    : false,
                "accept-friend-request"  : false,
                "decline-friend-request" : false,
                "send-chat-message"      : false
            },
            "friend-request" : {
                "send-corkboard-message" : false,
                "send-friend-request"    : true,
                "accept-friend-request"  : false,
                "decline-friend-request" : false,
                "send-chat-message"      : false
            },
            "notification" : {
                "send-corkboard-message" : false,
                "send-friend-request"    : false,
                "accept-friend-request"  : true,
                "decline-friend-request" : true,
                "send-chat-message"      : false
            },
            "chat" : {
                "send-corkboard-message" : false,
                "send-friend-request"    : false,
                "accept-friend-request"  : false,
                "decline-friend-request" : false,
                "send-chat-message"      : true
            }
        },

        // permissions of modules to receive messages from the socket server
        permissions_on = {
            "registration" : {
                "corkboard-message"               : false,
                "friend-request"                  : false,
                "response-send-friend-request"    : false,
                "friend-request-accepted"         : false,
                "response-accept-friend-request"  : false,
                "friend-request-declined"         : false,
                "response-decline-friend-request" : false,
                "chat-message-initial"            : false,
                "chat-message"                    : false
            },
            "corkboard" : {
                "corkboard-message"               : true,
                "friend-request"                  : false,
                "response-send-friend-request"    : false,
                "friend-request-accepted"         : false,
                "response-accept-friend-request"  : false,
                "friend-request-declined"         : false,
                "response-decline-friend-request" : false,
                "chat-message-initial"            : false,
                "chat-message"                    : false
            },
            "friend-request" : {
                "corkboard-message"               : false,
                "friend-request"                  : false,
                "response-send-friend-request"    : true,
                "friend-request-accepted"         : true,
                "response-accept-friend-request"  : false,
                "friend-request-declined"         : true,
                "response-decline-friend-request" : false,
                "chat-message-initial"            : false,
                "chat-message"                    : false
            },
            "notification" : {
                "corkboard-message"               : false,
                "friend-request"                  : true,
                "response-send-friend-request"    : false,
                "friend-request-accepted"         : false,
                "response-accept-friend-request"  : true,
                "friend-request-declined"         : false,
                "response-decline-friend-request" : true,
                "chat-message-initial"            : false,
                "chat-message"                    : false
            },
            "chat" : {
                "corkboard-message"               : false,
                "friend-request"                  : false,
                "response-send-friend-request"    : false,
                "friend-request-accepted"         : false,
                "response-accept-friend-request"  : false,
                "friend-request-declined"         : false,
                "response-decline-friend-request" : false,
                "chat-message-initial"            : true,
                "chat-message"                    : true
            }
        };

    ///////////////////
    // public scope
    return {
        socket : {
            connect : function() {
                core_socket.connect();
            },
            emit : function(channel, args) {
                if(permissions_emit[moduleId][channel]) {
                    core_socket.emit(channel, args);
                }
            },
            on : function(channel, callback) {
                if(permissions_on[moduleId][channel]) {
                    core_socket.on(channel, callback);
                }
            },
            removeListener : function(channel, callback) {
                core_socket.removeListener(channel, callback);
            }
        },
        mediator : {
            subscribe : function(channel, callback) {
                core_mediator.subscribe(channel, callback);
            },
            unsbscribe : function(channel, callback) {
                core_mediator.unsbscribe(channel, callback);
            },
            publish : function(channel, args) {
                core_mediator.publish(channel, args);
            }
        },
        ajax : {
            request : function(type, url, dataType, data, success, error) {
                core_ajax.request(type, url, dataType, data, success, error);
            }
        },
        utils : {
            isArray : function(obj) {
                core_utils.isArray(obj);
            }
        },
        dom : {
            query : function(selector, context) {
                return core_dom.query(selector, context);
            },
            getValue : function(selector) {
                return core_dom.getValue(selector);
            },
            setValue : function(selector, value){
                core_dom.setValue(selector, value);
            },
            setAttr : function(el, attr, value) {
                core_dom.setAttr(el, attr, value);
            },
            setHtml : function(el, html) {
                core_dom.setHtml(el, html);
            },
            createElement : function(el) {
                return core_dom.createElement(el);
            },
            addClass : function(el, class_name) {
                core_dom.addClass(el, class_name);
            },
            removeClass : function(el, class_name) {
                core_dom.removeClass(el, class_name);
            },
            setBackgroundColor : function(el, color){
                core_dom.setBackgroundColor(el, color);
            },
            fadeOut : function(el, duration) {
                core_dom.fadeOut(el, duration);
            },
            bind : function(el, evt, callback) {
                core_dom.bind(el, evt, callback);
            },
            unbind : function(el, evt, callback) {
                core_dom.unbind(el, evt, callback);
            },
            delegate : function(el, delegate, evt, callback) {
                core_dom.delegate(el, delegate, evt, callback);
            },
            undelegate : function(el, delegate, evt, callback) {
                core_dom.undelegate(el, delegate, evt, callback);
            },
            appendToList : function(el, html) {
                core_dom.appendToList(el, html);
            },
            hideAppendTo : function(html, el, duration) {
                core_dom.hideAppendTo(html, el, duration);
            },
            prependTo : function(html, el, color, duration) {
                core_dom.prependTo(html, el, color, duration);
            },
            scrollDown : function(el) {
                core_dom.scrollDown(el);
            }
        },
        templates : {
            corkboard_message : function( data ) {
                return core_templates.corkboard_message(data);
            },
            chat_message : function( data ) {
                return core_templates.chat_message(data);
            },
            friend_request_notification : function( data ) {
                return core_templates.friend_request_notification(data);
            },
            friend : function( data ) {
                return core_templates.friend(data);
            },
            friend_status_unknown : function() {
                return core_templates.friend_status_unknown();
            },
            friend_status_pending : function() {
                return core_templates.friend_status_pending();
            },
            friend_status_friends : function() {
                return core_templates.friend_status_friends();
            }
        }
    };
};
