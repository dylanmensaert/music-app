'use strict';

var _ = require('underscore.string');

module.exports = function (grunt) {
    var paths,
        sources;

    paths = {
        //server
        tmpPublic: '.tmp/public',
        views: 'views',
        phonegap: 'phonegap',
        //assets
        assets: 'assets',
        javascripts: 'assets/javascripts',
        less: 'assets/less',
        stylesheets: '.tmp/public/stylesheets',
        images: 'assets/images',
        //prod
        prodJavascripts: '.tmp/public/javascripts',
        prodImages: '.tmp/public/images',
        prodFonts: '.tmp/public/fonts',
        //other
        test: 'test',
        components: 'assets/bower_components',
        bootstrapFonts: 'assets/bower_components/bootstrap/dist/fonts',
        fontawesomeFonts: 'assets/bower_components/fontawesome/fonts',
        bootstrapMaterialDesignFonts: 'assets/bower_components/bootstrap-material-design/fonts',
        indexHtml: '.tmp/public/index.html',
        indexJade: 'assets/index.jade',
        zip: '.tmp/public/music-app.zip'
    };

    sources = {
        client: ['<%= paths.javascripts %>/**/*.js', '!<%= sources.templatesjs %>'],
        test: ['<%= paths.test %>/**/*.js'],
        rcfiles: ['.bowerrc', '.csslintrc', '.jsbeautifyrc', '.jscsrc', '.jshintrc'],
        configJson: ['.csscomb.json', '<%= paths.javascripts %>/.jshintrc', '<%= paths.test %>/.jshintrc'],
        dependencies: ['bower.json', 'package.json'],
        templatesjs: '<%= paths.javascripts %>/init/templates.js',
        hbs: '<%= paths.javascripts %>/**/*.hbs',
        css: '<%= paths.stylesheets %>/**/*.css',
        less: '<%= paths.less %>/**/*.less',
        mainCss: '<%= paths.stylesheets %>/main.css',
        mainLess: '<%= paths.less %>/main.less',
        views: '<%= paths.views %>/**/*',
        assets: '<%= paths.assets %>/*.*',
        images: '<%= paths.images %>/**/*.*'
    };

    sources.javascripts = sources.client.concat(sources.test);
    sources.json = sources.rcfiles.concat(sources.configJson).concat(sources.dependencies);
    sources.javascriptsAndJson = sources.javascripts.concat(sources.json);

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        paths: paths,
        sources: sources,
        clean: {
            tmpPublic: {
                src: ['<%= paths.tmpPublic %>/*']
            },
            tmpPublicExcludeZip: {
                src: ['<%= paths.tmpPublic %>/*', '!<%= paths.zip %>']
            },
            cleanup: {
                src: ['<%= sources.templatesjs %>', 'node_modules', '<%= paths.components %>']
            }
        },
        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.bootstrapFonts %>',
                    src: ['**'],
                    dest: '<%= paths.prodFonts %>'
                }, {
                    expand: true,
                    cwd: '<%= paths.fontawesomeFonts %>',
                    src: ['**', '!FontAwesome.otf'],
                    dest: '<%= paths.prodFonts %>'
                }, {
                    expand: true,
                    cwd: '<%= paths.bootstrapMaterialDesignFonts %>',
                    src: ['**'],
                    dest: '<%= paths.prodFonts %>'
                }]
            },
            development: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.assets %>',
                    src: ['**', '!*.jade'],
                    dest: '<%= paths.tmpPublic %>'
                }]
            },
            production: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.images %>',
                    src: ['**'],
                    dest: '<%= paths.prodImages %>'
                }, {
                    expand: true,
                    cwd: '<%= paths.phonegap %>',
                    src: ['**'],
                    dest: '<%= paths.tmpPublic %>'
                }]
            }
        },
        emberTemplates: {
            all: {
                options: {
                    amd: true,
                    templateBasePath: '<%= paths.javascripts %>/',
                    templateCompilerPath: 'assets/bower_components/ember/ember-template-compiler.js',
                    handlebarsPath: 'assets/bower_components/handlebars/handlebars.js',
                    templateName: function (sourceFile) {
                        var templateName;

                        templateName = sourceFile.replace('/template', '');
                        templateName = _.camelize(templateName);

                        return templateName;
                    },
                    preprocess: function (source) {
                        return source.replace(/\s+/g, ' ');
                    }
                },
                files: {
                    '<%= sources.templatesjs %>': '<%= sources.hbs %>'
                }
            }
        },
        less: {
            options: {
                paths: ['<%= paths.components %>'],
                strictImports: true,
                strictUnits: true
            },
            development: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.less %>',
                    src: ['**/*.less'],
                    dest: '<%= paths.stylesheets %>',
                    ext: '.css'
                }]
            },
            production: {
                files: {
                    '<%= sources.mainCss %>': '<%= sources.mainLess %>'
                },
                options: {
                    cleancss: true
                }
            }
        },
        requirejs: {
            all: {
                options: {
                    baseUrl: '<%= paths.javascripts %>',
                    name: '../bower_components/almond/almond',
                    include: ['main'],
                    mainConfigFile: '<%= paths.javascripts %>/main.js',
                    out: '<%= paths.prodJavascripts %>/main.js',
                    paths: {
                        ember: '../bower_components/ember/ember.prod',
                        'ember-data': '../bower_components/ember-data/ember-data.prod',
                        'meta-data': 'meta/data.prod'
                    }
                }
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: {
                src: '<%= sources.javascripts %>'
            }
        },
        jscs: {
            all: {
                src: '<%= sources.javascripts %>'
            }
        },
        jsonlint: {
            all: {
                src: '<%= sources.json %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: ['<%= sources.css %>', '!<%= sources.mainCss %>']
            }
        },
        jsbeautifier: {
            options: {
                config: '.jsbeautifyrc',
                js: {
                    fileTypes: '<%= sources.rcfiles %>'
                }
            },
            all: {
                src: '<%= sources.javascriptsAndJson %>'
            }
        },
        csscomb: {
            all: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.less %>',
                    src: ['**/*.less'],
                    dest: '<%= paths.less %>',
                }]
            }
        },
        open: {
            development: {
                path: 'http://localhost:9000'
            }
        },
        watch: {
            emberTemplates: {
                files: ['<%= sources.hbs %>'],
                tasks: ['emberTemplates:all']
            },
            less: {
                files: ['<%= sources.less %>'],
                tasks: ['less:development']
            },
            jsbeautifier: {
                files: ['<%= sources.javascriptsAndJson %>'],
                tasks: ['jsbeautifier:all']
            },
            index: {
                files: ['<%= paths.indexJade %>'],
                tasks: ['jade:development']
            },
            livereload: {
                files: ['<%= sources.client %>', '<%= sources.hbs %>', '<%= sources.mainCss %>', '<%= sources.views %>',
                    '<%= sources.assets %>', '<%= sources.images %>'
                ],
                tasks: ['copy:development'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    base: '<%= paths.tmpPublic %>',
                    middleware: function (connect, options) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            // Include the proxy first
                            proxy,
                            // Serve static files.
                            connect.static(String(options.base)),
                            // Make empty directories browsable.
                            connect.directory(options.base)
                        ];
                    }
                },
                proxies: [{
                    context: ['/vi'],
                    host: 'i.ytimg.com',
                    port: 443,
                    https: true,
                    changeOrigin: true
                }, {
                    context: ['/youtube/v3/search'],
                    host: 'www.googleapis.com',
                    port: 443,
                    https: true,
                    changeOrigin: true
                }, {
                    context: ['/complete/search'],
                    host: 'suggestqueries.google.com',
                    changeOrigin: true
                }, {
                    context: ['/a/pushItem/?item'],
                    host: 'www.youtube-mp3.org',
                    changeOrigin: true
                }, {
                    context: ['/a/itemInfo/?video_id'],
                    host: 'www.youtube-mp3.org',
                    changeOrigin: true
                }, {
                    context: ['/get?video_id'],
                    host: 'www.youtube-mp3.org',
                    changeOrigin: true
                }]
            }
        },
        jade: {
            development: {
                options: {
                    pretty: true,
                    data: {
                        environment: 'development'
                    }
                },
                files: {
                    '<%= paths.indexHtml %>': '<%= paths.indexJade %>'
                }
            },
            production: {
                options: {
                    data: {
                        environment: 'production'
                    }
                },
                files: {
                    '<%= paths.indexHtml %>': '<%= paths.indexJade %>'
                }
            }
        },
        compress: {
            production: {
                options: {
                    archive: '<%= paths.zip %>'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmpPublic %>',
                    src: ['**'],
                    dest: '/'
                }]
            }
        }
    });

    grunt.registerTask('default', ['clean:tmpPublic', 'emberTemplates:all', 'less:development', 'copy:development', 'copy:fonts',
        'jade:development'
    ]);
    grunt.registerTask('prod', ['clean:tmpPublic', 'emberTemplates:all', 'requirejs:all', 'less:production', 'copy:production', 'copy:fonts',
        'jade:production', 'compress:production', 'clean:tmpPublicExcludeZip'
    ]);

    grunt.registerTask('dev', ['default', 'configureProxies:server', 'connect:server', 'open:development', 'watch']);

    //TODO: Improve integration of unit tests!!
    grunt.registerTask('test', ['jshint:all', 'jscs:all', 'jsonlint:all', 'emberTemplates:all', 'requirejs:all', 'less:development', 'csslint:all']);
    grunt.registerTask('tidy', ['jsbeautifier:all', 'csscomb:all']);

    grunt.registerTask('cleanup', ['clean:tmpPublic', 'clean:cleanup']);
};
