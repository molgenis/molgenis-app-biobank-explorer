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

Test model + data can be found [here](https://drive.google.com/open?id=0B-ElyQryGh-OSlRISVI1MkhhbVU)
Import metadata first, then data

## Deploying to the MOLGENIS appstore

_TODO..._

## Configuring Negotiator

This version of the biobank explorer is 
compatible with the Negotiator API in MOLGENIS version 5.2.0

## Contributing

yarn install

yarn run dev

yarn build

yarn test

yarn test:watch
