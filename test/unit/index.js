import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.

// see comment section of https://eddyerburgh.me/stub-$route-in-vue-unit-tests for $route issue
const srcContext = require.context('../../src/', true, /^(?!.*(?:assets|main|router)).*\.*$/)

srcContext.keys().forEach(srcContext)
