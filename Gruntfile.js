var clc = require('cli-color');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-tagrelease');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            deploy: {
                command: 'af login --email <%= af.username %> --passwd <%= af.password %>; af update <%= af.appName %>;',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            pushcode: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'git push origin master'
            },
            pushtag: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'git push --tags'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                expr: true,
                globals: {
                    SpilGames: true,
                    GameAPI: true,
                    Kinetic: true
                }
            },
            all: ['public/js/game.js']
        },
        bumpup: {
            files: ['package.json', 'bower.json']
        },
        tagrelease: {
            file: 'package.json',
            commit:  true,
            message: 'Release %version%',
            prefix:  '',
            annotate: true
        }
    });

    grunt.registerTask('lint', 'jshint');

    grunt.registerTask('push', ['shell:pushcode', 'shell:pushtag']);

    grunt.registerTask('default', 'lint');

    grunt.registerTask('build', function(type) {
        grunt.task.run('verify_tag_number:' + type); //Gets new tag number
        grunt.task.run('lint'); //lints your js code
        grunt.task.run('bumpup:' + type); //bump up the version number
        grunt.task.run('updatePkg'); //updates the contents of package.json
        grunt.task.run('tagrelease'); // creates a new tag for the release
        grunt.task.run('postrelease'); //displays a nice message
    });

    grunt.registerTask('deploy', function(appName, username, password) {
        if(arguments.length === 0) {
            grunt.log.error("Deployment: No arguments provided. Please provide the App Name, Username and Password.");
            return false;
        }

        grunt.config.set('af.appName', appName);
        grunt.config.set('af.username', username);
        grunt.config.set('af.password', password);

        var tasks = [
            'shell:deploy'
        ];

        grunt.task.run(tasks);
    });

    grunt.registerTask('verify_tag_number', function(type) {
        var valid_types = ["patch", "minor", "major"];

        if(valid_types.indexOf(type) === -1) {
            throw new Error(
                clc.red('"' + type + '" is not a valid release type!') +
                "\n\nUsage: grunt release:[type] -- where [type] is any of: " + valid_types.join(', ') + "\n\n" +
                clc.redBright("Aborting...\n\n")
            );
        }
    });

    grunt.registerTask('updatePkg', function () {
        console.log('Reloading package.json');
        grunt.config.set('pkg', grunt.file.readJSON('package.json'));
    });

    grunt.registerTask('postrelease', function () {
        console.log(
            clc.greenBright("Release created successfully!\n\n") +
            clc.cyan.underline("Please push to GitHub using") + " `grunt push`" + 
            clc.cyan.underline("You can deploy using") + " `grunt deploy (grunt deploy:myAppName:myAfLogin:myAfPassword)`"
        );
    });
};