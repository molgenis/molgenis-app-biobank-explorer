const webpack = require('webpack')
const BannerPlugin = require('webpack').BannerPlugin
const ZipPlugin = require('zip-webpack-plugin')
const packageJson = require('./package.json')
const GenerateJsonWebpackPlugin = require('generate-json-webpack-plugin')
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const pkgVersion = packageJson.version
const pkgName = packageJson.name

const now = new Date()
const buildDate = now.toUTCString()
const bannerText = `
package-name: ${pkgName}
package-version: ${pkgVersion}
build-date: ${buildDate}`

const previewText = `
package-name: ${pkgName}
build-date: ${buildDate}
PR: ${process.env.CHANGE_ID}
BUILD: ${process.env.BUILD_NUMBER}`

const initialCollectionColumns = require('./src/config/initialCollectionColumns')
const initialBiobankColumns = require('./src/config/initialBiobankColumns')
const initialFilterFacets = require('./src/config/initialFilterFacets')
const i18n = require('./src/config/i18n')

const htmlTemplate = () => {
  if (process.env.NODE_ENV === 'production') return 'apptemplate/app-template.html'
  if (process.env.NODE_ENV === 'development') return 'public/index.html'
  if (process.env.NODE_ENV === 'test') return 'public/preview.html'
}

const PROXY_TARGET = 'https://jelmer.gcc.rug.nl'

const apiDevServerProxyConf = {
  target: PROXY_TARGET,
  keepOrigin: true
}

if (process.env.DATA_EXPLORER_DEV_PW) {
  apiDevServerProxyConf.auth = 'admin:' + process.env.DATA_EXPLORER_DEV_PW
}

module.exports = {
  runtimeCompiler: true,
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/plugin/app/' + packageJson.name
    : '/',
  chainWebpack: config => {
    config.resolve.symlinks(false)
    config
      .plugin('html')
      .tap(args => {
        args[0].template = htmlTemplate()
        args[0].version = process.env.NODE_ENV !== 'production' ? previewText : ''
        return args
      })
  },
  configureWebpack: config => {
    config.plugins.push(
      new MonacoEditorWebpackPlugin({
        publicPath: process.env.NODE_ENV !== 'development'
          ? '/plugin/app/' + pkgName + '/js/' // we need to change this path for webworkers to work on molgenis app
          : '/',
        languages: ['json'],
        features: []
      }),
      new BannerPlugin({
        banner: bannerText
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      }),
      new GenerateJsonWebpackPlugin('config.json', {
        name: packageJson.name,
        label: packageJson.name,
        description: packageJson.description,
        version: packageJson.version,
        apiDependency: 'v2',
        includeMenuAndFooter: true,
        runtimeOptions: {
          language: 'en',
          negotiatorType: 'eric-negotiator',
          filterFacets: initialFilterFacets,
          collectionColumns: initialCollectionColumns,
          biobankColumns: initialBiobankColumns,
          biobankCardShowCollections: true,
          googleAnalyticsKey: '',
          removeFreemarkerMargin: true,
          filterMenuInitiallyFolded: false,
          applicationNotification: '',
          menuHeight: 50,
          i18n: i18n
        }
      }, null, 4),
      new CopyPlugin({
        patterns: [
          { from: 'monaco-files/', to: 'js' } // this is a hack, because we can't load js files from the home dir as app
        ]
      }),
      new ZipPlugin({
        filename: `${packageJson.name}.v${packageJson.version}`
      })
    )
  },
  devServer: {
    // In CI mode, Safari cannot contact "localhost", so as a workaround, run the dev server using the jenkins agent pod dns instead.
    host: process.env.JENKINS_AGENT_NAME || 'localhost',
    // Used to proxy a external API server to have someone to talk to during development
    proxy: process.env.NODE_ENV !== 'development' ? undefined : {
      '/login': {
        target: PROXY_TARGET,
        changeOrigin: true
      },
      // Don't do this on production
      '/plugin/directory/export': {
        target: 'https://bbmri.accept.molgenis.org/',
        changeOrigin: true
      },
      '/api': {
        target: PROXY_TARGET,
        changeOrigin: true
      },
      '/app-ui-context': {
        target: PROXY_TARGET,
        changeOrigin: true
      },
      '/logout': {
        target: PROXY_TARGET,
        changeOrigin: true
      }
    },
    // Used as mock in e2e tests
    before: process.env.NODE_ENV !== 'test' ? undefined : function (app) {
      app.get('/app-ui-context', function (req, res) {
        res.json(require('./tests/e2e/resources/uiContext.js'))
      })
      app.get('/api/metadata/root_hospital_diagnosis', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_hospital_diagnosis.js'))
      })
      app.get('/api/metadata/root_hospital_lab_results', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_hospital_lab_results.js'))
      })
      app.get('/api/metadata/root_cities', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_cities.js'))
      })
      app.get('/api/metadata/root_gender', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_gender.js'))
      })
      app.get('/api/metadata/root_hospital_users', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_hospital_users.js'))
      })
      app.get('/api/metadata/root_hospital_patients', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_hospital_patients_flat.js'))
      })
      app.get('/api/metadata/TableWithCustomCard', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/metadata_root_hospital_patients_flat.js'))
      })
      app.get('/api/data/root_hospital_patients/p000000001', function (req, res) {
        res.json(require('./tests/e2e/resources/v3/data_p00001'))
      })

      app.get('/api/data/root_hospital_patients', function (req, res) {
        res.json(require('./tests/e2e/resources/typeTestData.js'))
      })
      app.get('/api/data/de_dataexplorer_table_settings', function (req, res) {
        if (req.url.includes('TableWithMoreColumns')) {
          res.json({ items: [] })
        } else if (req.url.includes('TableWithCustomCard')) {
          res.json(require('./tests/e2e/resources/tableSettingsWithCustom'))
        } else {
          res.json(require('./tests/e2e/resources/tableSettings.js'))
        }
      })
      app.get('/api/data/TableWithCustomCard', function (req, res) {
        res.json(require('./tests/e2e/resources/tableWithMoreColumns.js'))
      })
    }
  }
}
