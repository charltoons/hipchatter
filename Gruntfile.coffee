module.exports = (grunt)->
  grunt.initConfig
    execute:
      cleanup:
        src: ['utils/cleanup_webhooks.js', 'utils/cleanup_test_rooms_and_users.js']
      webhooks:
        src: ['utils/list_webhooks.js']
      stub:
        src: ['utils/create_test_room.js', 'utils/create_test_user.js']

  grunt.loadNpmTasks 'grunt-execute'
  grunt.registerTask('clean', ['execute:cleanup'])
  grunt.registerTask('webhooks', ['execute:webhooks'])

  # creates a test room based on test/settings.json
  grunt.registerTask('stub', ['clean', 'execute:stub'])
