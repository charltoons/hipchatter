module.exports = (grunt)->
  grunt.initConfig
    execute:
      cleanup:
        src: ['utils/cleanup_webhooks.js']
      webhooks:
        src: ['utils/list_webhooks.js']
      stub:
        src: ['utils/create_test_room.js']

  grunt.loadNpmTasks 'grunt-execute'
  grunt.registerTask('clean', ['execute:cleanup'])
  grunt.registerTask('webhooks', ['execute:webhooks'])

  # creates a test room for the tests to operate on based on test/settings.json
  grunt.registerTask('stub', ['execute:stub'])
