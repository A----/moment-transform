module.exports = function (grunt) {

  var banner = '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['dist/*']
    },

    jshint: {
      options: {
        bitwise: true,
        curly: true,
        globals: {
          require: true,
          moment: true
        },
        eqeqeq: true,
        forin: true,
        freeze: true,
        futurehostile: true,
        latedef: true,
        maxcomplexity: 10,
        maxdepth: 5,
        maxparams: 4,
        maxstatements: 30,
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        undef: true,
        unused: true
      },
      prebuild: {
        src: 'src/<%= pkg.name %>.js'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js'
      }
    },

    karma: {
      test: {
        configFile: 'karma.conf.js',
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
      }
    },

    concat: {
      options: {
        banner: banner
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: banner,
        sourceMap: true
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('build', ['clean', 'concat', 'jshint', 'karma', 'uglify']);
  grunt.registerTask('test', ['jshint:prebuild', 'karma']);
};
