module.exports = function(grunt) {
  grunt.initConfig({
    shell: {
      pegjs: {
        options: {
          failOnError: true
        },
        command: './node_modules/.bin/pegjs -o src/html-parser.js src/html-grammar.pegjs'
      },
      test: {
        options: {
          failOnError: true,
          execOptions: {
            maxBuffer: Infinity
          }
        },
        command: './node_modules/.bin/mocha test/index-spec.js --reporter="nyan"  --color'
      },
      debug: {
        options: {
          failOnError: false,
          debounceDelay: 2000,
          forever: true
        },
        command: 'DEBUG=true ./node_modules/.bin/mocha test/index-spec.js --reporter="list" -- --debug-brk --inspect'
      },
      watchDebug: {
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
        tasks: ['default', 'shell:watchDebug']
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['shell:pegjs']);
  grunt.registerTask('test', ['default', 'shell:test']);
  grunt.registerTask('debug', ['default', 'shell:debug']);
  grunt.registerTask('watch debug', ['default', 'watch:debug']);
};
