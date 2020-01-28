/* global describe it expect beforeEach */
import { expect, mount, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankExplorerContainer from '../../../../src/components/BiobankExplorerContainer'

describe('BiobankExplorerContainer', () => {
  describe('ON MOUNT', () => {
    it('should trigger getquery and load the first page', () => {
      const store = new Vuex.Store({
        dispatch: () => true,
        getters: {
          loading: () => false,
          rsql: () => '',
          foundBiobanks: () => 1000,
          getActiveFilters: () => []
        },
        actions: {
          '__GET_INITIAL_BIOBANKS__': () => {},
          '__FIND_BIOBANKS__': () => {},
          '__GET_QUERY__': () => {}
        },
        state: {
          route: {
            query: ''
          },
          country: {
            filters: [],
            options: []
          },
          materials: {
            filters: [],
            options: []
          },
          collection_quality: {
            filters: [],
            options: [],
            collections: []
          },
          biobank_quality: {
            filters: [],
            options: [],
            biobanks: []
          },
          diagnosis_available: {
            filters: [],
            options: []
          },
          type: {
            filters: [],
            options: []
          },
          dataType: {
            filters: [],
            options: []
          }
        }
      })
      const componentStubs = ['filter-container', 'result-Headers', 'negotiator', 'biobank-cards-container']
      const wrapper = shallowMount(BiobankExplorerContainer, {stubs: componentStubs, store})
      wrapper.setMethods({
        findBiobanks: () => {},
        getQuery: () => ''
      })
      console.log(wrapper.vm)
      expect(wrapper.vm._watchers).toHaveBeenCalled()
    })
  })
})
