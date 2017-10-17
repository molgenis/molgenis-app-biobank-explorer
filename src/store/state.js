export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

const state = {
  error: undefined,
  biobanks: null,
  filters: {
    countries: {
      entityTypeName: 'eu_bbmri_eric_biobanks',
      attributeName: 'country',
      label: 'Country',
      options: [],
      selectedOptions: []
    },
    material_types: {
      entityTypeName: 'eu_bbmri_eric_collections',
      attributeName: 'materials',
      label: 'Material type',
      options: [],
      selectedOptions: []
    },
    quality: {
      entityTypeName: 'eu_bbmri_eric_collections',
      attributeName: 'standards',
      label: 'Quality',
      options: [],
      selectedOptions: []
    },
    disease_types: {
      entityTypeName: 'eu_bbmri_eric_disease_types',
      attributeName: 'diseases',
      label: 'Disease type',
      options: [],
      selectedOptions: []
    }
  },
  search: '',
  nToken: null,
  loading: false
}

export default state
