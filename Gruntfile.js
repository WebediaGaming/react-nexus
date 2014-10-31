module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                esnext: true,
                globals: {
                    Promise: true,
                },
            },
            default: ["src/**/*.js"],
        },
        jst: {
            options: {
                namespace: "tpl",
                commonjs: true,
                prettify: true,
            },
            default: {
                files: {
                    "tmp/jst.js": ["src/**/*.tpl"],
                },
            },
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
        smash: {
            "d3": {
                files: {
                    "lib/d3.js": ["node_modules/d3/src/start.js", "node_modules/d3/src/interpolate/*.js", "node_modules/d3/src/transition/ease.js", "node_modules/d3/src/end.js"],
                }
            },
        },
        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
              name: '<%= pkg.name %>',
              description: '<%= pkg.description %>',
              version: '<%= pkg.version %>',
              url: '<%= pkg.homepage %>',
              options: {
                paths: 'src/',
                outdir: 'doc/'
            }
        }
    },
});
grunt.loadNpmTasks("grunt-regenerator");
grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.loadNpmTasks("grunt-contrib-jst");
grunt.loadNpmTasks("grunt-smash");
grunt.loadNpmTasks("grunt-contrib-yuidoc");
grunt.registerTask("default", ["jshint", "regenerator"]);
grunt.registerTask("doc", ["yuidoc"]);
};
