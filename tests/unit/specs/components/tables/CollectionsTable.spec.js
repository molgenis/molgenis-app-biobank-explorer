import { expect } from 'chai'
import CollectionsTable from '@/components/tables/CollectionsTable'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('components', () => {
  describe('CollectionsTable', () => {
    const collections = [{
      _href: '/api/v2/eu_bbmri_eric_collections/bbmri-eric:ID:CZ_MMCI:collection:LTS:tissue-RNAlater',
      id: 'bbmri-eric:ID:CZ_MMCI:collection:LTS:tissue-RNAlater',
      name: 'Tissues in RNAlater in Long Term Storage Collection',
      type: [{ _href: '/api/v2/eu_bbmri_eric_collection_types/HOSPITAL', id: 'HOSPITAL', label: 'Hospital' }],
      standards: [],
      order_of_magnitude: {
        _href: '/api/v2/eu_bbmri_eric_biobank_size/4',
        id: 4,
        size: '10.000 - 100.000 Samples'
      },
      size: 0,
      sub_collections: [],
      diagnosis_available: [{
        _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:D37-D48',
        id: 'urn:miriam:icd:D37-D48'
      }, {
        _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:D00-D09',
        id: 'urn:miriam:icd:D00-D09'
      }, {
        _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:D10-D36',
        id: 'urn:miriam:icd:D10-D36'
      }, { _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:C00-C97', id: 'urn:miriam:icd:C00-C97' }],
      materials: [{
        _href: '/api/v2/eu_bbmri_eric_material_types/TISSUE_FROZEN',
        id: 'TISSUE_FROZEN',
        label: 'Tissue (frozen)'
      }]
    }, {
      _href: '/api/v2/eu_bbmri_eric_collections/bbmri-eric:ID:CZ_MMCI:collection:STS',
      id: 'bbmri-eric:ID:CZ_MMCI:collection:STS',
      name: 'Short Term Storage Collection',
      type: [{ _href: '/api/v2/eu_bbmri_eric_collection_types/HOSPITAL', id: 'HOSPITAL', label: 'Hospital' }],
      standards: [],
      order_of_magnitude: {
        _href: '/api/v2/eu_bbmri_eric_biobank_size/4',
        id: 4,
        size: '10.000 - 100.000 Samples'
      },
      size: 46000,
      sub_collections: [],
      diagnosis_available: [{
        _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:D37-D48',
        id: 'urn:miriam:icd:D37-D48'
      }, {
        _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:D00-D09',
        id: 'urn:miriam:icd:D00-D09'
      }, {
        _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:D10-D36',
        id: 'urn:miriam:icd:D10-D36'
      }, { _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:C00-C97', id: 'urn:miriam:icd:C00-C97' }],
      materials: [{ _href: '/api/v2/eu_bbmri_eric_material_types/SERUM', id: 'SERUM', label: 'Serum' }, {
        _href: '/api/v2/eu_bbmri_eric_material_types/TISSUE_FROZEN',
        id: 'TISSUE_FROZEN',
        label: 'Tissue (frozen)'
      }]
    }, { parent_collection: { id: 5 } }]

    let wrapper, store

    beforeEach(() => {
      store = new Vuex.Store({
        state: {},
        getters: {
          selectedCollections: jest.fn(() => [])
        },
        mutations: {
          RemoveCollectionFromSelection: jest.fn(),
          AddCollectionToSelection: jest.fn()
        }
      })

      wrapper = shallowMount(CollectionsTable, { store, propsData: { collections }, stubs: ['router-link'] })
    })

    describe('html', () => {
      it('should render collection name', () => {
        expect(wrapper.findAll('tr').at(2).findAll('td').at(0).text()).eq('Short Term Storage Collection')
      })

      it('should render collection type', () => {
        expect(wrapper.findAll('tr').at(2).findAll('td').at(1).text()).eq('Hospital')
      })

      it('should render available material types', () => {
        expect(wrapper.findAll('tr').at(2).findAll('td').at(2).text()).eq('Serum, Tissue (frozen)')
      })

      it('should render collection\'s size', () => {
        expect(wrapper.findAll('tr').at(2).findAll('td').at(4).text()).eq('46000')
      })
    })

    describe('topLevelElements', () => {
      it('should filter subcollections', () => {
        expect(wrapper.vm.topLevelElements.size === 2)
      })
    })

    describe('getCollectionSize', () => {
      it('should return size if size is present', () => {
        expect(CollectionsTable.methods.getCollectionSize({ size: 3, order_of_magnitude: { size: '10.000 - 100.000 Samples' } })).eq(3)
      })

      it('should return order of magnitude if size is null', () => {
        expect(CollectionsTable.methods.getCollectionSize({ size: null, order_of_magnitude: { size: '10.000 - 100.000 Samples' } })).eq('10.000 - 100.000 Samples')
      })

      it('should return order of magnitude if size is 0', () => {
        expect(CollectionsTable.methods.getCollectionSize({ size: 0, order_of_magnitude: { size: '10.000 - 100.000 Samples' } })).eq('10.000 - 100.000 Samples')
      })
    })
  })
})
