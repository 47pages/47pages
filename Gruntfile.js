'use strict()';

var config = {
	port: 3000
};

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		express: {
			options: {
				port: config.port
			},
			dev: {
				options: {
					script: 'keystone.js',
					debug: true
				}
			}
		},

		less: {
			development: {
				options: {
					compress: true
				},
				files: {
					"public/styles/css/art.min.css": "public/styles/pages/art.less",
					"public/styles/css/art_submission.min.css": "public/styles/pages/art_submission.less",
					"public/styles/css/contribute.min.css": "public/styles/pages/contribute.less",
					"public/styles/css/index.min.css": "public/styles/pages/index.less",
					"public/styles/css/literature.min.css": "public/styles/pages/literature.less",
					"public/styles/css/literature_submission.min.css": "public/styles/pages/literature_submission.less",
					"public/styles/css/staff.min.css": "public/styles/pages/staff.less"
				}
			}
		},

		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				force: true
			},
			all: [
				'routes/**/*.js',
				'models/**/*.js'
			],
			server: [
				'./keystone.js'
			]
		},

		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		nodemon: {
			debug: {
				script: 'keystone.js',
				options: {
					nodeArgs: ['--debug'],
					env: {
						port: config.port
					}
				}
			}
		},

		watch: {
			js: {
				files: [
					'model/**/*.js',
					'routes/**/*.js'
				],
				tasks: ['jshint:all']
			},
			express: {
				files: [
					'keystone.js',
					'public/js/lib/**/*.{js,json}'
				],
				tasks: ['jshint:server', 'concurrent:dev']
			},
			styles: {
				files: ['public/styles/**/*.less'],
				tasks: ['less:development'],
				options: {
					nospawn: true
				}
			}
		}
	});

	// load jshint
	grunt.registerTask('lint', function (target) {
		grunt.task.run([
			'jshint'
		]);
	});

	// default option to connect server
	grunt.registerTask('serve', function (target) {
		grunt.task.run([
			'jshint',
			'concurrent:dev'
		]);
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve:' + target]);
	});

	grunt.registerTask('default', ['watch']);
};
