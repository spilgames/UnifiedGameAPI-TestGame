module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-shell');

    grunt.initConfig({
        shell: {
            deploy: {
                command: 'af login --email <%= af.username %> --passwd <%= af.password %>; af update <%= af.appName %>;',
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        }
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
};