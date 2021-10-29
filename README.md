[![codecov](https://codecov.io/gh/molgenis/molgenis-app-biobank-explorer-vue-cli4/branch/master/graph/badge.svg)](https://codecov.io/gh/molgenis/molgenis-app-biobank-explorer-vue-cli4)
# BBMRI-ERIC Biobank Explorer Version 2
Vue CLI 4 application for the biobank explorer; A card detail view on BBMRI-ERIC biobank / collection data

## Preparing your MOLGENIS instance
The biobank explorer is built on a specific data model. 
This is the BBMRI-ERIC model and consists of the following tables:

- eu_bbmri_eric_biobanks
- eu_bbmri_eric_collections
- eu_bbmri_eric_material_types
- eu_bbmri_eric_disease_types
- eu_bbmri_eric_lab_standards

Test model + data can be found in the 'sample-data' folder of this repository. Upload the data via the [Advanced data import](https://molgenis.gitbooks.io/molgenis/content/user_documentation/import-data/guide-upload.html)

## Configure the Biobank Explorer
You can configure 2 main settings in the Biobank Explorer.

- Google Analytics
- Negotiator

### Enable Google Analytics
We use the [Vue Analytics library](https://github.com/MatteoGabriele/vue-analytics) to connect to Google Analytics.
As administrator go to the application settings (/menu/admin/settings/sys_set_app)

Scroll down to Tracking and fill in the fields and add the GA_KEY to:

> Google analytics tracking ID


### Configuring Negotiator

This version of the biobank explorer is compatible with the Negotiator API in MOLGENIS version 8.3.10.

### Disabling filter facets

Facets (except search) can be removed from the list of facets by adding the facet name to an array in the config.
This setting can be toggled using the runtimeOptions section in the webpack.prod.conf.js or at runtime using the config entity

`runtimeOptions.disabledFilters` should contain an array with facet names that should be hidden.

You can find the names here in [the filter definitions on github.](https://github.com/molgenis/molgenis-app-biobank-explorer/blob/master/src/utils/filterDefinitions.js)

```js
"appOptions": {
    ...
    "disabledFilters": ["country"],
    ...
  }
```

## Collection entity (table)

If you want to customize the collection table with additional columns containing an (categorical) mref,
you can add these to the view using the following configuration:

```js
"appOptions": {
    ...
    "collectionColumns": [{ "label": "Type:", "column": "type" }],
    ...
  }
```

Label is the label to show and column is the column name of the collection entity.

You can find the complete default list [here](https://github.com/molgenis/molgenis-app-biobank-explorer/blob/master/src/config/initialCollectionColumns.js) or in the runtimeOptions

> mind the correctness in the config using " around the key and value

### Configuring filter facets for collections

If you want to customize the collection table with additional columns containing an (categorical) mref,
you can add these to the view using the following configuration:

```js
"appOptions": {
    ...
    "customCollectionFilterFacets": [{
    "tableName": "eu_bbmri_eric_data_types",
    "columnName": "data_categories",
    "negotiatorDescription": "Where data category is: ",
    "facetTitle": "Data Categories",
    "insertBefore": "dataType"
    }]
    ...
```
**tableName** is the table where the (categorical) mref is declared
> The table needs to have a unique id per row and either a name and/or a label

**columnName** the column name in the collection entity (table) that refers to the (categorical) mref.

**negotiatorDescription** when sending the query to the negotiator or podium this will be sent as a header along with a comma separated list with the selected id's

**facetTitle** is the text on top of the filter facet.

**insertBefore** *(optional)* the name of the facet where you want this to be in front of.
You can find the names here in [the filter definitions on github.](https://github.com/molgenis/molgenis-app-biobank-explorer/blob/master/src/utils/filterDefinitions.js)

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
yarn serve
```

It will render a local version of the core variable catalogue.

#### Run unit tests
You can run unit tests by executing this command:

```bash
# Run once
yarn test:unit

# Run in watch-mode
yarn debug
```

#### Run end-to-end tests
You can run end-to-end test locally by running the following command:

```bash
yarn test:e2e
```


### Test with a running MOLGENIS instance
For local testing with a running MOLGENIS instance you have to alter the config of the app:

Comment in the following block

```config/index.js```

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

You can now create a working application that can be imported in MOLGENIS directly, by executing:

```bash
yarn build
```

You can find the zip-file in the ```dist/molgenis-app-biobank-explorer_v2.zip```.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Create a docker image | Molgenis Dev Team
To make a standalone docker image that can be run from the Rancher Cluster perform the following steps:

```
yarn build:preview
```

Then build the image with Docker (you have to have Docker running) with the following (tag is required):

```
docker build -t {tag} .
```

Then login to the registry

```
docker login {registry-adress}:{port}

```

Create a registry tag for the image

```
docker tag {tag} {registry-adress}:{port}/{imagename}:{optional tag}
```

Then upload the image to the registry
(now you need the tag)

```
docker push {registry-adress}:{port}/{imagename}:{optional tag}
```

Now it's available from Rancher.

Go to Rancher, select correct cluster

* workloads > deploy
* Name > name for your workload
* image > {registry-adress}/{imagename}:{optional tag}
* select correct namespace
* Add port > portname: http, publish port: 80, as a: cluster-ip
* env variable: API {molgenis instance you want e.g. molgenis1}
* launch

* workloads > loadbalancing
* add ingress
* website name {description}
* specify hostname: {logicalname}.dev.molgenis.org
* path /, target your created workload, port 80
* save

Done!