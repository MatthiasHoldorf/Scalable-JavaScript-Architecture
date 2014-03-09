/**
 The Gruntfile.js enables minification and concatenation of JavaScript files.

 @module Server_App.js
 @class Server_App_Gruntfile.js
 **/

module.exports = function(grunt) {
    grunt.initConfig({

        uglify: {
            js_files: {
                src : [ "public/js/libraries/*.js", "public/js/core/Core.js", "public/js/core/*.js", "public/js/sandbox/*.js", "public/js/modules/*.js", "public/js/*.js" ],
                dest: "public/js_min/client.min.js"
            }
        },
        // grunt watch --force
        watch: {
            js_files: {
                files: [ "public/js/libraries/*.js", "public/js/core/Core.js", "public/js/core/*.js", "public/js/sandbox/*.js", "public/js/modules/*.js", "public/js/*.js" ],
                tasks: [ "uglify" ]
            }
        }

    });

    // load plugins
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // register tasks
    grunt.registerTask("default", [ "uglify" ]);
};