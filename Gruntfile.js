let matchdep = require('matchdep');
let mergeFiles = require('./grunt-scripts/mergeFiles');

module.exports = function (grunt) {
	matchdep.filterAll(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
	mergeFiles(grunt);

	grunt.initConfig({
		screeps: {
			options: {
				email:    '*****************',
				password: '*****************',
				branch:   'default',
				ptr:      false,
			},
			dist:    {
				src: ['dist/*.js']
			}
		},

		copy:      {
			home: {
				expand:  true,
				flatten: true,
				filter:  'isFile',
				cwd:     'dist/',
				src:     '**',
				dest:    'C:/Users/Jonathan/AppData/Local/Screeps/scripts/10_0_0_2___21025/default'
			},
			screepsplus: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				cwd: 'dist/',
				src: '**',
				dest: 'C:/Users/Jonathan/AppData/Local/Screeps/scripts/server1_screepspl_us___21025/default'
			},
			local: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				cwd: 'dist/',
				src: '**',
				dest: 'C:/Users/Jonathan/AppData/Local/Screeps/scripts/127_0_0_1___21025/default'
			}
		},
	});

	grunt.registerTask('main', ['test', 'merge', 'write']);
	grunt.registerTask('merge', 'mergeFiles');
	grunt.registerTask('home', ['merge', 'copy:home']);
	grunt.registerTask('sp', ['merge', 'copy:screepsplus']);
	grunt.registerTask('local', ['merge', 'copy:local']);
};