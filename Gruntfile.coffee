module.exports = (grunt)->
  grunt.initConfig
    execute:
      cleanup:
        src: ['utils/cleanup_webhooks.js']
      webhooks:
        src: ['utils/list_webhooks.js']

  grunt.loadNpmTasks 'grunt-execute'
  grunt.registerTask('clean', ['execute:cleanup'])
  grunt.registerTask('webhooks', ['execute:webhooks'])
