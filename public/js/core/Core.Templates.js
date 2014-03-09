/**
 The Core.Templates.js provides HTML Templates for the application.

 @module Client_Core.js
 @class Client_Core_Core.Templates.js
 **/
Core.Templates = (function() {
    ///////////////////
    // public scope
    return {

        /**
         Renders a message of a corkboard message.

         @param data
         @method corkboard_message
         @returns the HTML
         **/
        corkboard_message : function(data) {
            var html =
                "<div class='corkboard-message borderd'>"
                    + "<small class='corkboard-message-details'>"
                    + "<a class='corkboard-message-user' href='/profile?userId=" + data._id + "'>"   + data.name + "</a>"
                    + "<span> wrote </span>"
                    + "<span class='corkboard-message-date'>at " + data.date + "</span>"
                    + "</small>"
                    + "<div class='corkboard-message-body'>" + data.body + "</div>" +
                    "</div>";

            return html;
        },

        /**
         Renders a message of a chat message.

         @param data
         @method chat_message
         @returns the HTML
         **/
        chat_message : function( data ) {
            var html =
                "<div class='chat-message'>"
                    + "<small class='chat-message-time'> " + data.time + "</small>"
                    + " <a class='chat-message-user' href='/profile?userId=" + data.user._id + "'>" + data.user.first_name + ":</a>"
                    + "<span class='chat-message-body'>" + data.body + "</span>" +
                    "</div>";

            return html;
        },

        /**
         Renders a friend request notification.

         @param data
         @method friend_request_notification
         @returns the HTML
         **/
        friend_request_notification : function( data ) {
            var html =
                "<span>The User</span>"
                    + "<a href='/profile?userId=" + data._id + "'>" + data.fullname + "</a>"
                    + "<span>wants to be friends with you!</span>"
                    + "<div class='friend-request-react-controls'>"
                    + "<a href='javascript:void(0)' class='accept-friend-request'  data-request-id=" + data._id + ">accept</a>"
                    + "<a href='javascript:void(0)' class='decline-friend-request' data-request-id=" + data._id + ">decline</a>" +
                    "</div>";

            return html;
        },

        /**
         Renders a friend of a user on his profile.

         @param data
         @method friend
         @returns the HTML
         **/
        friend : function(data) {
            var html = "<li><a href='/profile?userId=" + data._id + "'>" + data.fullname + "</a></li>";
            return html;
        },

        /**
         Renders a send-friend-request button.

         @method friend_status_unknown
         @returns the HTML
         **/
        friend_status_unknown : function() {
            return "<button id='send-friend-request' class='btn btn-success'>Send friend request</button>";
        },

        /**
         Renders a pending-friend-request button.

         @method friend_status_pending
         @returns the HTML
         **/
        friend_status_pending : function() {
            return "<div class='pending-friend-request'>Pending friend request</div>";
        },

        /**
         Renders a friend button as a notification that the user is already a friend.

         @method friend_status_friends
         @returns the HTML
         **/
        friend_status_friends : function() {
            return "<div class='friend'>Friends</button>";
        }
    };
}());