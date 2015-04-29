module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      pegjs: {
        options: {
          failOnError: true
        },
        command: './node_modules/.bin/pegjs src/html-grammar.pegjs src/html-parser.js'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'test/*.js', 'src/html-grammar.pegjs', 'test/html/*.html', 'index.js'],
        tasks: ['default', 'mochaTest:test']
      }
    },
    mochaTest: {
      test: {
        src: ['test/index-spec.js'],
        options: {
          reporter: 'list'
        }
      }
    }
  });

  // Load the npm installed tasks
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // The default tasks to run when you type: grunt
  // grunt.registerTask('default', ['shell:pegjs', 'shell:browserify']);
  grunt.registerTask('default', ['shell:pegjs']);
  grunt.registerTask('dev', ['default', 'mochaTest:test', 'watch']);
};
