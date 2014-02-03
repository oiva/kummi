/* jshint indent: 4 */
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'handlebars'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,

        // watch list
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },
            js: {
                files: [
                    '{.tmp,<%= yeoman.app %>}/scripts/{,**/}*.js',
                    '{.tmp,<%= yeoman.app %>}/templates/{,**/}*.hbs',
                ],
                tasks: ['browserify']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,**/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,**/}*.js',
                    '{.tmp,<%= yeoman.app %>}/templates/{,**/}*.hbs',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    
                    'test/spec/{,**/}*.js'
                ],
                options: {
                    livereload: true
                }
            }
        },

        // testing server
        connect: {
            testserver: {
                options: {
                    port: 1234,
                    base: '.'
                }
            }
        },

        // mocha command
        exec: {
            mocha: {
                command: 'mocha-phantomjs http://localhost:<%= connect.testserver.options.port %>/test',
                stdout: true
            }
        },

        
        // express app
        express: {
            options: {
                // Override defaults here
                port: '3000'
            },
            dev: {
                options: {
                    script: 'server/app.js'
                }
            },
            prod: {
                options: {
                    script: 'server/app.js'
                }
            },
            test: {
                options: {
                    script: 'server/app.js'
                }
            }
        },
        

        // open app and test page
        open: {
            server: {
                path: 'http://localhost:<%= express.options.port %>'
            }
        },

        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },

        // linting
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                ignores: ['app/y/*', 'app/scripts/vendor/*', 'app/dist'],
                globals: ['React']
            },
            all: [
                '!Gruntfile.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                'app/',
                'test/spec/{,*/}*.js'
            ]
        },

        
        // compass
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                importPath: 'app/y',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        

        browserify: {
            'app/dist/main-built.js': ['app/scripts/main.js'],
            options: {
                ignore: ['app/scripts/vendor/*.js'],
                transform: ['hbsfy', 'reactify'],
                debug: true,
                shim: {
                    jquery: {
                        path: 'app/y/jquery/jquery.min.js',
                        exports: '$'
                    },
                    backbone: {
                        path: 'app/y/backbone/backbone-min.js',
                        exports: 'Backbone',
                        depends: {
                            jquery: '$',
                            underscore: 'underscore'
                        }
                    },
                    'backbone.babysitter': {
                        path: 'app/y/backbone.babysitter/lib/backbone.babysitter.min.js',
                        exports: 'Backbone.Babysitter',
                        depends: {
                            backbone: 'Backbone'
                        }
                    },
                    'backbone.marionette': {
                        path: 'app/y/backbone.marionette/lib/backbone.marionette.min.js',
                        exports: 'Marionette',
                        depends: {
                            jquery: '$',
                            backbone: 'Backbone',
                            underscore: '_'
                        }
                    },
                    'react': {
                        path: 'app/y/react/react-with-addons.min.js',
                        exports: 'React'
                    },
                    'react.backbone': {
                        path: 'app/y/react.backbone/react.backbone.js',
                        exports: 'React.BackboneMixin',
                        depends: {
                            react: 'React'
                        }
                    },
                    underscore: {
                        path: 'app/y/underscore-amd/underscore-min.js',
                        exports: '_'
                    }
                }   
            },
            dist: {
                options: {
                    transform: ['hbsfy', 'uglifyify'],
                    debug: false
                }
            }
        },

        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },

        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>'],
                flow: {
                    steps: {'js' : [] },
                    post: []
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    collapseWhitespace: false,
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '<%= yeoman.dist %>/index.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}'                        
                    ]
                }]
            }
        },

        // handlebars
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    amd: true
                },
                files: {
                    '.tmp/scripts/templates.js': ['templates/**/*.hbs']
                }
            }
        },

        targethtml: {
            dist: {
                files: {
                    'dist/index.html': 'app/index.html'
                }
            }
        }

    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    // starts express server with live testing via testserver
    grunt.registerTask('default', function (target) {

        // what is this??
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.option('force', true);

        grunt.task.run([
            'jshint',
            'clean:server',
            'targethtml',
            'useminPrepare',
            'browserify',
            'compass:server',
            'express:dev',
            'usemin',
            'open',
            'watch'
        ]);
    });

    // todo fix these
    grunt.registerTask('test', [
        'clean:server',
        'createDefaultTemplate',
        'handlebars',
        'compass',
        'connect:testserver',
        //'exec:mocha'
    ]);

    grunt.registerTask('build', [
        'createDefaultTemplate',
        'handlebars',
        'targethtml',
        'htmlmin',
        'compass:dist',
        'useminPrepare',
        'browserify:dist',
        'imagemin',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'usemin'
    ]);

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-targethtml');
};
