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
        files: ['Gruntfile.js', 'spec/*.js', 'src/html-grammar.pegjs', 'spec/html/*.html', 'index.js'],
        tasks: ['default', 'mochaTest:test']
      }
    },
    mochaTest: {
      test: {
        src: ['spec/index-spec.js'],
        options: {
          reporter: 'spec'
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
  grunt.registerTask('dev', ['watch']);
};
