var packageJson = require('./package.json')

const buildName = packageJson.name + '#PR-' + process.env.CHANGE_ID + '-build-' + process.env.BUILD_NUMBER

module.exports = {

  test_settings: {
    ci_chrome: {
      silent: true,
      username: process.env.SAUCE_CRED_USR,
      access_key: process.env.SAUCE_CRED_PSW,
      selenium: {
        start_process: false,
        host: 'ondemand.us-west-1.saucelabs.com',
        port: '80',
        timeout_options: {
          timeout: 120000,
          retry_attempts: 1
        }
      },
      desiredCapabilities: {
        name: packageJson.name,
        build: buildName,
        tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
        browserName: 'chrome'
      }
    },
    ci_firefox: {
      silent: true,
      username: process.env.SAUCE_CRED_USR,
      access_key: process.env.SAUCE_CRED_PSW,
      selenium: {
        start_process: false,
        host: 'ondemand.us-west-1.saucelabs.com',
        port: '80',
        timeout_options: {
          timeout: 120000,
          retry_attempts: 1
        }
      },
      desiredCapabilities: {
        name: packageJson.name,
        build: buildName,
        tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
        browserName: 'firefox'
      }
    },
    ci_safari: {
      silent: true,
      username: process.env.SAUCE_CRED_USR,
      access_key: process.env.SAUCE_CRED_PSW,
      selenium: {
        start_process: false,
        host: 'ondemand.us-west-1.saucelabs.com',
        port: '80',
        timeout_options: {
          timeout: 120000,
          retry_attempts: 1
        }
      },
      desiredCapabilities: {
        name: packageJson.name,
        build: buildName,
        tunnelIdentifier: process.env.TUNNEL_IDENTIFIER,
        browserName: 'safari'
      }
    },
    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true,
        marionette: true
      },
      selenium: {
        cli_args: {
          'webdriver.firefox.driver': require('geckodriver').path
        }
      }
    },
    safari: {
      desiredCapabilities: {
        browserName: 'safari',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
