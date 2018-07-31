# BBMRI-ERIC Biobank Explorer
Vue application for the biobank explorer; A card detail view on BBMRI-ERIC biobank / collection data

## Preparing your MOLGENIS instance
The biobank explorer is built on a specific data model. 
This is the BBMRI-ERIC model and consists of the following tables:

- eu_bbmri_eric_biobanks
- eu_bbmri_eric_collections
- eu_bbmri_eric_material_types
- eu_bbmri_eric_disease_types
- eu_bbmri_eric_lab_standards

Test model + data can be found [here](sample-data/bbmri-eric.xlsx)
Import metadata first, then data

## Configure the Biobank Explorer
You can configure 2 main settings in the Biobank Explorer.

- Google Analytics
- Negotiator

### Enable Google Analytics
We use the [Vue Analytics library](https://github.com/MatteoGabriele/vue-analytics) to connect to Google Analytics.
Add the GA_KEY parameter: 

```js
  window.__INITIAL_STATE__ = {
    GA_KEY: 'UA-XXXXXXXX-X'
  }
```

to your index.html or freemarker template to start tracking your biobank explorer app.

### Configuring Negotiator

This version of the biobank explorer is 
compatible with the Negotiator API in MOLGENIS version 5.2.0

## Contributing
There are 2 ways to test and develop in apps for MOLGENIS.

- locally without MOLGENIS
- locally with MOLGENIS

### Test locally without a running MOLGENIS instance

For local testing you can execute the following commands:

```bash
# To install the application
yarn install

# To run develop mode
yarn dev
```

It will render a local version of the core variable catalogue.

#### Run unit tests
You can run unit tests by executing this command:

```bash
# Run once
yarn unit

# Run in watch-mode
yarn debug
```

#### Run end-to-end tests
You can run edn-to-end test locally by running the following command:

```bash
yarn e2e
```

### Test with a running MOLGENIS instance
For local testing with a running MOLGENIS instance you have to alter the config of the app:

Comment in the following block

```src/main/frontend/config/index.js```

```javascript
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // Beginning of block
    proxyTable: {
      '/login': {
        target: 'http://localhost:8080'
      },
      '/plugin/directory/export': {
        target: 'http://localhost:8080'
      },
      '/api': {
        target: 'http://localhost:8080'
      }
    },
    // End of block
```

And comment out this block in the same file.


```javascript
/**
 * GET and POST interceptors
 * Removes the need for a running backend during development
 */
No mock data available
```

That is it. Run a molgenis instance on localhost:8080 and start the core variable catalogue with:

```javascript
yarn dev
```

## Build your MOLGENIS app

See: [App developement documentation](https://molgenis.gitbooks.io/molgenis/content/developer_documentation/app-development.html)

You can now create a working application that can be imported in MOLGENIS directly by executing:

```bash
yarn build
```
