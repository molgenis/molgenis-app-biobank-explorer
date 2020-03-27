'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const packageJson = require('../package')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {
      '/login': {
       target: 'https://directory.bbmri-eric.eu',
       changeOrigin: true
       },
      // Don't do this on production
      // '/plugin/directory/export': {
      //   target: 'https://bbmri.accept.molgenis.org/',
      //   changeOrigin: true
      // },
      '/api': {
        target: 'https://directory.bbmri-eric.eu',
        changeOrigin: true
      },
      '/logout': {
        target: 'https://directory.bbmri-eric.eu',
        changeOrigin: true
      }
    },

    // Various Dev Server settings
    host: process.env.JENKINS_AGENT_NAME || 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true

    /**
     * GET and POST interceptors
     * Removes the need for a running backend during development
     */
    //TODO: add mock data to run locally
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: `/plugin/app/${packageJson.name}/`,

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
