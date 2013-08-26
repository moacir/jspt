module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['lib/jspt/**/*.js'],
      options: {
        ignores: ['lib/jspt/grammar.js']
      },
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'lib/jspt/grammar.js',
          'lib/jspt/ast.js',
          'lib/jspt/buffer.js',
          'lib/jspt/context.js',
          'lib/jspt/interpreter.js',
          'lib/jspt/compiler/javascript.js',
          'lib/jspt/main.js'
        ],
        dest: 'dist/jspt.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'dist/jspt-web.js',
        dest: 'dist/jspt-web.min.js'
      }
    },
    browserify: {
      basic: {
        src: ['lib/jspt/**/*.js'],
        dest: 'dist/jspt-web.js'
      },
      options: {
        alias: ["./lib/jspt/main.js:jspt"],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'browserify', /*'concat',*/ 'uglify']);

};
