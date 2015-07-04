module.exports = {
  options: {
    sourceMap: false
  },
  dist: {
    files: [{
      expand: true,
      cwd: '<%= yeoman.src %>',
      src: '*.scss',
      dest: '<%= yeoman.dist %>',
      ext: '.css'
    }]
  }
};