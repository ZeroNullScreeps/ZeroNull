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
			main: {
				expand:  true,
				flatten: true,
				filter:  'isFile',
				cwd:     'dist/',
				src:     '**',
				dest:    'C:/Users/Jonathan/AppData/Local/Screeps/scripts/10_0_0_2___21025/ZeroNull'
			},
		},
	});

	grunt.registerTask('main', ['test', 'merge', 'write']);
	grunt.registerTask('merge', 'mergeFiles');
	grunt.registerTask('local', ['merge', 'copy']);
};