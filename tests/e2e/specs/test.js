// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = process.env.VUE_DEV_SERVER_URL

    browser
      .url(devServer)
      .waitForElementVisible('body', 5000)
      .end()
  }
}
