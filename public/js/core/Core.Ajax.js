/**
 The Core.Ajax.js provides functionality for asynchronous requests against the server.

 @module Client_Core.js
 @class Client_Core_Core.Ajax.js
 **/
Core.Ajax = (function($) {
    ///////////////////
    // public scope
    return {

        /**
         Starts a request against the server.

         @param type
         @param url
         @param dataType
         @param data
         @param success
         @param error
         @method request
         **/
        request : function(type, url, dataType, data, success, error) {
            $.ajax({
                type: type,
                url: url,
                dataType: dataType,
                data: data,
                success : success,
                error : error
            });
        }
    };
}(jQuery));