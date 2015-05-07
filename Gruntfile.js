module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      pegjs: {
        options: {
          failOnError: true
        },
        command: './node_modules/.bin/pegjs src/html-grammar.pegjs src/html-parser.js'
      },
      mochaTest: {
        command: './node_modules/.bin/mocha test/index-spec.js --reporter="nyan"'
      },
      mochaDebug: {
        command: 'DEBUG=true ./node_modules/.bin/mocha test/index-spec.js --reporter="list"'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'test/*.js', 'src/html-grammar.pegjs', 'test/html/*.html', 'index.js'],
        tasks: ['default', 'mochaTest:test']
      }
    }
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  // grunt.registerTask('default', ['shell:pegjs', 'shell:browserify']);
  grunt.registerTask('default', ['shell:pegjs']);
  grunt.registerTask('test', ['default', 'shell:mochaTest']);
  grunt.registerTask('debug', ['default', 'shell:mochaDebug', 'watch']);
};
