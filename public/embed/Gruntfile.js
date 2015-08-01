module.exports = function(grunt) {

  // Configuration
  grunt.initConfig({
    /*------- PackageJSON -------*/
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'embed.js']
    },
    
    copy: {
      main: {
        files: [{
          src: ['embed.js'],
          dest: 'v/<%= pkg.versiondashed %>/'
        }],
      },
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> (by socialsurf) - version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>(yyyy-mm-dd) */\n'
      },
      build: {
        src: 'embed.js',
        dest: 'v/<%= pkg.versiondashed %>/<%= pkg.name %>.min.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', [
    //'jshint',
    'copy',
    'uglify'
    ]);

};