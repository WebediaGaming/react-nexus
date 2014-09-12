module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                esnext: true,
            },
            default: ["src/**/*.js"],
        },
        regenerator: {
            default: {
                files: [{
                    expand: true,
                    cwd: "src",
                    src: ["*.js"],
                    dest: "dist/",
                }],
            },
            client: {
                files: {
                    "dist/client.js": "src/client.js",
                },
                options: {
                    includeRuntime: true,
                },
            },
            server: {
                files: {
                    "dist/server.js": "src/server.js",
                },
                options: {
                    includeRuntime: true,
                },
            },
        },
    });
    grunt.loadNpmTasks("grunt-regenerator");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("default", ["jshint", "regenerator:default", "regenerator:client", "regenerator:server"]);
};