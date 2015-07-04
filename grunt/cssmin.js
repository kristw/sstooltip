module.exports = {
  dist: {
    files: {
      '<%= yeoman.dist %>/<%= yeoman.outputName %>.min.css': [
        '<%= yeoman.dist %>/<%= yeoman.outputName %>.css'
      ]
    }
  }
};