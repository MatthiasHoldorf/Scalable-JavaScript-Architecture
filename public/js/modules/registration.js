/**
 The registration.js is a module that provides the functionality of a registration.

 @module Client_Modules.js
 @class Client_Modules_registration.js
 **/
Core.register("registration", function(sandbox) {

    ///////////////////
    // private scope
    var first_name_field = sandbox.dom.query("input[name='first_name']"),
        last_name_field  = sandbox.dom.query("input[name='last_name']"),
        email_field      = sandbox.dom.query("input[name='email']"),
        register_form    = sandbox.dom.query("form[name='registration']"),
        error_message    = sandbox.dom.query(".error"),

        ///////////////////
        // helper functions

        /**
         Resets a form.

         @method resetForm
         **/
        resetForm = function() {
            sandbox.dom.setHtml(error_message, "");
            sandbox.dom.removeClass(first_name_field, "error-val");
            sandbox.dom.removeClass(last_name_field, "error-val");
            sandbox.dom.removeClass(email_field, "error-val");
        },

        /**
         Displays n error message.

         @method displayErrorMessage
         **/
        displayErrorMessage = function(text) {
            sandbox.dom.setHtml(error_message, text);
        },

        /**
         Validates the input fields.

         @method validateInputFields
         **/
        validateInputFields = function(validation_error) {
            if(validation_error.first_name){
                sandbox.dom.addClass(first_name_field, "error-val");
            }
            if(validation_error.last_name){
                sandbox.dom.addClass(last_name_field, "error-val");
            }
            if(validation_error.email){
                sandbox.dom.addClass(email_field, "error-val");
            }
        },

        ///////////////////
        // validation

        /**
         Validates the client side.

         @param values
         @method clientSideValidation
         **/
        clientSideValidation = function(values) {
            var validation_error = {
                first_name : values.first_name_value.length >= 3 ? false : true,
                last_name  : values.last_name_value.length >= 3 ? false : true,
                email      : values.email_value.length >= 3 ? false : true
            };

            if (validation_error.first_name || validation_error.last_name || validation_error.email) {
                resetForm();
                displayErrorMessage("Fields must contain at least 3 characters");
                validateInputFields(validation_error);
                return false;
            }

            return true;
        },

        /**
         Validates the server side.

         @param values
         @method serverSideValidation
         **/
        serverSideValidation = function(values) {
            sandbox.ajax.request(
                "post",
                "/register",
                "json",
                // data
                {
                    first_name : values.first_name_value,
                    last_name  : values.last_name_value,
                    email      : values.email_value
                },
                // success
                function(data) {

                    // registration successful, redirect to user's profile
                    if (data.userId) {
                        window.location.replace("/profile?userId" + data.userId);
                    }
                    // error(s) happened during registration
                    else {
                        // reset form
                        resetForm();

                        // validation error
                        if (data.validationError) {
                            displayErrorMessage("Fields must contain at least 3 characters");
                            validateInputFields(data.validationError);
                        }

                        // database error
                        if (data.databaseError) {
                            displayErrorMessage("You are already registered!");
                        }

                        // unknown error
                        if (data.unknownError) {
                            displayErrorMessage("Something went wrong!");
                        }
                    }
                },
                // error
                function() {
                    displayErrorMessage("Server request failed!");
                }
            );
        },

        ///////////////////
        // event functions

        /**
         Validates the registration of a user.

         @param e
         @method validateRegistration
         **/
        validateRegistration = function(e) {
            // get values from input fields
            var values = {
                first_name_value : sandbox.dom.getValue(first_name_field),
                last_name_value  : sandbox.dom.getValue(last_name_field),
                email_value      : sandbox.dom.getValue(email_field)
            };

            // client and server side validation
            if (clientSideValidation(values)) {
                serverSideValidation(values);
            }

            // prevent default form action
            e.preventDefault();
        };

    ///////////////////
    // public scope
    return {
        init : function() {
            sandbox.dom.bind(register_form, "submit", validateRegistration);
        },
        destroy : function() {
            sandbox.dom.unbind(register_form,"submit", validateRegistration);
        }
    };
});