'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

    grunt.initConfig({
        mochaTest: {

            test: {
                options: {
                    reporter: 'spec'
                }
            },
            src: ['test/*.js']
        },
        jshint: {
            options: {
                jshintrc: true,
                ignores: ['node_modules/**/*']
            },
            all: ['./**/*.js']
        },

        jscs: {
            src: './**/*.js',
            options: {
                config: '.jscsrc',
                excludeFiles: ['node_modules/**/*']
            }
        }
    });

    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('test', ['mochaTest']);
};
