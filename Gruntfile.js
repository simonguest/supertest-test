module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    notify: {
      server: {
        options: {
          message: 'Service is now running!'
        }
      }
    },
    mochaTest: {
      all: {
      },
      src:['test/*.js']
    },
    mocha_istanbul: {
      coverage:{
        src:'test'
      }
    },
    open:{
      coverage:{
        path:'coverage/lcov-report/index.html'
      }
    },
    nodemon: {
      dev: {
        script: 'main.js'
      }
    }
  });

  // Default task(s).
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['mochaTest','mocha_istanbul','open:coverage']);
  grunt.registerTask('default', ['mochaTest', 'notify:server', 'nodemon:dev']);
};