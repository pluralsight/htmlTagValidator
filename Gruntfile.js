module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      pegjs: {
        options: {
          failOnError: true
        },
        command: './node_modules/.bin/pegjs src/html-grammar.pegjs src/html-parser.js'
      },
      test: {
        options: {
          failOnError: true
        },
        command: './node_modules/.bin/mocha test/index-spec.js --reporter="nyan"'
      },
      debug: {
        options: {
          failOnError: false,
          debounceDelay: 2000,
          forever: true
        },
        command: 'DEBUG=true ./node_modules/.bin/mocha test/index-spec.js --reporter="list"'
      }
    },
    watch: {
      debug: {
        files: ['Gruntfile.js', 'test/*.js', 'src/*.js', 'src/*.pegjs', 'test/html/*.html', 'index.js'],
        tasks: ['default', 'shell:debug']
      }
    }
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  // grunt.registerTask('default', ['shell:pegjs', 'shell:browserify']);
  grunt.registerTask('default', ['shell:pegjs']);
  grunt.registerTask('test', ['default', 'shell:test']);
  grunt.registerTask('debug', ['default', 'shell:debug', 'watch:debug']);
};
