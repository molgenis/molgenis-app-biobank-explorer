import { mount, createLocalVue } from '@vue/test-utils'
import SubCollectionsTable from '@/components/tables/SubCollectionsTable'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { mockState } from '../../mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

describe('SubCollectionsTable', () => {
  let stubs, mocks, wrapper, store

  beforeEach(() => {
    const subCollections = [
      {
        id: 'bbmri-eric:ID:NL_2',
        name: '2',
        type: [{
          id: 'POPULATION_BASED',
          label: 'Population-based'
        }, { id: 'SAMPLE', label: 'Sample collection' }],
        size: 11149,
        sub_collections: [{
          id: 'bbmri-eric:ID:NL_2_DNA',
          name: 'DNA',
          type: [{
            id: 'SAMPLE',
            label: 'Sample collection'
          }],
          size: 362,
          sub_collections: [],
          materials: [{ id: 'DNA', label: 'DNA' }],
          quality: []
        }, {
          id: 'bbmri-eric:ID:NL_2_PLASMA',
          name: 'PLASMA',
          type: [{
            id: 'SAMPLE',
            label: 'Sample collection'
          }],
          size: 4787,
          sub_collections: [],
          materials: [{ id: 'PLASMA', label: 'Plasma' }],
          quality: []
        }, {
          id: 'bbmri-eric:ID:NL_2_SERUM',
          name: 'SERUM',
          type: [{
            id: 'SAMPLE',
            label: 'Sample collection'
          }],
          size: 2282,
          sub_collections: [],
          materials: [{ id: 'SERUM', label: 'Serum' }],
          quality: []
        }, {
          id: 'bbmri-eric:ID:NL_2_URINE',
          name: 'URINE',
          type: [{
            id: 'SAMPLE',
            label: 'Sample collection'
          }],
          size: 3718,
          sub_collections: [],
          materials: [{ id: 'URINE', label: 'Urine' }],
          quality: []
        }],
        materials: [{
          id: 'DNA',
          label: 'DNA'
        }, {
          id: 'SERUM',
          label: 'Serum'
        }, {
          id: 'PLASMA',
          label: 'Plasma'
        }, { id: 'URINE', label: 'Urine' }],
        quality: []
      }
    ]
    mocks = {
      $route: {
        fullPath: '/collection/bbmri-eric:ID:NL_2'
      }
    }
    stubs = ['router-link']

    store = new Vuex.Store({
      state: mockState()
    })

    wrapper = mount(SubCollectionsTable, { propsData: { subCollections }, stubs, mocks, store, localVue })
  })
  describe('methods', () => {
    describe('getCollectionMaterials', () => {
      it('should get joined string of materials for collection', () => {
        const subCollection = {
          materials: [{ id: 'DNA', label: 'DNA' }, { id: 'SERUM', label: 'SERUM' }]
        }
        const materials = wrapper.vm.getCollectionMaterials(subCollection)
        expect(materials).toStrictEqual('DNA, SERUM')
      })
    })
    describe('getCollectionType', () => {
      it('should get joined string of types for collection', () => {
        const subCollection = {
          type: [{
            id: 'SAMPLE',
            label: 'Sample collection'
          }, {
            id: 'POPULATION_BASED', label: 'Population based'
          }]
        }
        const materials = wrapper.vm.getCollectionType(subCollection)
        expect(materials).toStrictEqual('Sample collection, Population based')
      })
    })
    describe('toggleVisible', () => {
      it('should toggle visibility of sub collection', () => {
        expect(wrapper.vm.visible).toStrictEqual({ 'bbmri-eric:ID:NL_2': false })
        wrapper.vm.toggleVisible('bbmri-eric:ID:NL_2')
        expect(wrapper.vm.visible).toStrictEqual({ 'bbmri-eric:ID:NL_2': true })
      })
    })
  })
})
