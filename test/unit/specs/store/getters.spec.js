import { expect } from 'chai'
import getters from '../../../../src/store/getters'

describe('store', () => {
  describe('getters', () => {
    describe('rsql', () => {
      it('should transform the collection filters to rsql', () => {
        const state = {
          search: 'Cell&Co',
          country: {filters: ['AT', 'BE']},
          materials: {filters: []},
          standards: {filters: []},
          diagnosis_available: {filters: []},
          collection_quality: {filters: [], collections: []},
          biobank_quality: {filters: [], biobanks: []},
          type: {filters: []},
          dataType: {filters: []},
          covid19: {filters: ['covid19']},
          showCountryFacet: true
        }
        expect(getters.rsql(state)).to.equal('country=in=(AT,BE);(name=q=Cell&Co,id=q=Cell&Co,acronym=q=Cell&Co,biobank.name=q=Cell&Co,biobank.id=q=Cell&Co,biobank.acronym=q=Cell&Co)')
      })
      it('should return the empty string if no filters are selected', () => {
        const state = {
          search: '',
          country: {filters: []},
          materials: {filters: []},
          standards: {filters: []},
          diagnosis_available: {filters: []},
          collection_quality: {filters: [], collections: []},
          biobank_quality: {filters: [], biobanks: []},
          type: {filters: []},
          dataType: {filters: []},
          covid19: {filters: []},
          showCountryFacet: true
        }
        expect(getters.rsql(state)).to.equal('')
      })
      it('should include the default country code if showCountryFacet is set to false', () => {
        const state = {
          search: '',
          country: {filters: []},
          materials: {filters: []},
          standards: {filters: []},
          diagnosis_available: {filters: []},
          collection_quality: {filters: [], collections: []},
          biobank_quality: {filters: [], biobanks: []},
          type: {filters: []},
          dataType: {filters: []},
          covid19: {filters: []},
          showCountryFacet: false,
          preConfiguredCountyCode: 'BE'
        }
        expect(getters.rsql(state)).to.equal('country=in=BE')
      })
    })
    describe('biobankRsql', () => {
      it('should transform the biobank filters to rsql', () => {
        const state = {
          search: 'Cell&Co',
          country: {filters: ['AT', 'BE']},
          biobank_quality: {filters: [], biobanks: []},
          covid19: {filters: ['covid19']},
          showCountryFacet: true
        }
        expect(getters.biobankRsql(state)).to.equal('country=in=(AT,BE);covid19biobank==covid19')
      })
      it('should create AND filter for covid19 biobank filter values', () => {
        const state = {
          search: 'Cell&Co',
          country: {filters: []},
          biobank_quality: {filters: [], biobanks: []},
          covid19: {filters: ['covid19', 'covid19a']},
          showCountryFacet: true
        }
        expect(getters.biobankRsql(state)).to.equal('covid19biobank==covid19;covid19biobank==covid19a')
      })
      it('should return the empty string if no filters are selected', () => {
        const state = {
          search: '',
          country: {filters: []},
          biobank_quality: {filters: [], biobanks: []},
          covid19: {filters: []},
          showCountryFacet: true
        }
        expect(getters.biobankRsql(state)).to.equal('')
      })
      it('should include the default country code if showCountryFacet is set to false', () => {
        const state = {
          search: '',
          country: {filters: []},
          materials: {filters: []},
          standards: {filters: []},
          diagnosis_available: {filters: []},
          collection_quality: {filters: [], collections: []},
          biobank_quality: {filters: [], biobanks: []},
          type: {filters: []},
          dataType: {filters: []},
          covid19: {filters: []},
          showCountryFacet: false,
          preConfiguredCountyCode: 'BE'
        }
        expect(getters.biobankRsql(state)).to.equal('country=in=BE')
      })
    })
    describe('biobanks', () => {
      it('should return empty list when loading', () => {
        const state = {}
        expect(getters.biobanks(state, {loading: true})).to.deep.equal([])
      })
      it('should look up the biobanks for matching collection ids and filter the biobank\'s collections', () => {
        const state = {
          biobanks: {
            '1': {id: '1', name: 'one', collections: [{id: 'col-1', sub_collections: []}]},
            '2': {id: '2', name: 'two', collections: [{id: 'col-2', sub_collections: []}, {id: 'col-3', sub_collections: []}]}
          },
          biobankIds: ['1', '2'],
          collectionIds: [{collectionId: 'col-2', biobankId: '2'}]
        }
        const otherGetters = {loading: false, rsql: 'type=in=(type1)'}
        expect(getters.biobanks(state, otherGetters)).to.deep.equal([{id: '2', name: 'two', collections: [{id: 'col-2', sub_collections: []}]}])
      })
      it('should return all biobanks if the collections are not filtered', () => {
        const state = {
          biobanks: {
            '2': {id: '2', name: 'two', collections: [{id: 'col-2', sub_collections: []}]}
          },
          biobankIds: ['1', '2'],
          collectionIds: [{collectionId: 'col-2', biobankId: '2'}]
        }
        const otherGetters = {loading: false, rsql: ''}
        expect(getters.biobanks(state, otherGetters)).to.deep.equal([
          '1',
          {id: '2', name: 'two', collections: [{id: 'col-2', sub_collections: []}]}
        ])
      })
      it('should not filter out collections with matching subcollections',
        () => {
          const biobank1 = {
            id: '1',
            name: 'one',
            collections: [{id: 'col-1', sub_collections: []}]
          }
          const biobank2 = {
            id: '2',
            name: 'two',
            collections: [
              {id: 'col-2', sub_collections: []},
              {id: 'col-3', sub_collections: [{id: 'col-4', sub_collections: []}]}]
          }
          const state = {
            biobanks: {'1': biobank1, '2': biobank2},
            biobankIds: ['1', '2'],
            collectionIds: [{collectionId: 'col-4', biobankId: '2'}]
          }
          const otherGetters = {loading: false, rsql: 'type=in=(type1)'}
          expect(getters.biobanks(state, otherGetters)).to.deep.equal([{
            id: '2',
            name: 'two',
            collections: [{id: 'col-3', sub_collections: [{id: 'col-4', sub_collections: []}]}]}])
        })

      it('should return the biobanks in the order they appear in collectionIds', () => {
        const state = {
          biobanks: {
            '1': {id: '1', name: 'B', collections: [{id: 'col-1', sub_collections: []}]},
            '2': {id: '2', name: 'A', collections: [{id: 'col-2', sub_collections: []}]}
          },
          biobankIds: ['1', '2'],
          collectionIds: [
            {collectionId: 'col-1', biobankId: '2'},
            {collectionId: 'col-2', biobankId: '1'}
          ]
        }
        const otherGetters = {loading: false, rsql: 'type=in=(type1)'}
        expect(getters.biobanks(state, otherGetters)).to.deep.equal([
          {id: '2', name: 'A', collections: [{id: 'col-2', sub_collections: []}]},
          {id: '1', name: 'B', collections: [{id: 'col-1', sub_collections: []}]}
        ])
      })
    })
    describe('loading', () => {
      it('should be false if both biobankIds and collectionIds are present', () => {
        const state = {
          biobankIds: ['biobank1'],
          collectionIds: [{collectionId: 'col-2', biobankId: 'biobank1'}]
        }
        expect(getters.loading(state)).to.eq(false)
      })

      it('should be true if biobankIds are missing', () => {
        const state = {
          biobankIds: undefined,
          collectionIds: [{collectionId: 'col-2', biobankId: 'biobank1'}]
        }
        expect(getters.loading(state)).to.eq(true)
      })

      it('should be true if collectionIds are missing', () => {
        const state = {
          biobankIds: ['biobank1'],
          collectionIds: undefined
        }
        expect(getters.loading(state)).to.eq(true)
      })
    })

    describe('getTypesOptions', () => {
      it('should retrieve the type options', () => {
        const state = {type: {options: [{id: 'id', label: 'label'}]}}
        expect(state.type.options).to.deep.equal(getters.getTypesOptions(state))
      })
    })

    describe('getDataTypeOptions', () => {
      it('should retrieve the type options', () => {
        const state = {dataType: {options: [{id: 'id', label: 'label'}]}}
        expect(state.dataType.options).to.deep.equal(getters.getDataTypeOptions(state))
      })
    })

    describe('getCountryOptions', () => {
      it('should retrieve the options that are available for the country filter', () => {
        const state = {
          country: {
            options: ['AT', 'BE']
          }
        }

        const actual = getters.getCountryOptions(state)
        const expected = ['AT', 'BE']

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getMaterialOptions', () => {
      it('should retrieve the options that are available for the material type filter', () => {
        const state = {
          materials: {
            options: ['RNA', 'DNA']
          }
        }

        const actual = getters.getMaterialOptions(state)
        const expected = ['RNA', 'DNA']

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getCollectionQualityOptions', () => {
      it('should retrieve the options that are available for the collection standards filter', () => {
        const state = {
          collection_quality: {
            options: ['self', 'eric']
          }
        }

        const actual = getters.getCollectionQualityOptions(state)
        const expected = ['self', 'eric']

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getBiobankQualityOptions', () => {
      it('should retrieve the options that are available for the biobank standards filter', () => {
        const state = {
          biobank_quality: {
            options: ['accredited', 'eric']
          }
        }

        const actual = getters.getBiobankQualityOptions(state)
        const expected = ['accredited', 'eric']

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getDiagnosisAvailableOptions', () => {
      it('should retrieve the options that are available for the disease type filter', () => {
        const state = {
          diagnosis_available: {
            options: [
              {id: '1', label: 'small disease'},
              {id: '2', label: 'big disease'}
            ]
          }
        }

        const actual = getters.getDiagnosisAvailableOptions(state)
        const expected = [
          {id: '1', label: 'small disease'},
          {id: '2', label: 'big disease'}
        ]

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getCovid19Options', () => {
      it('should retrieve the options that are available for the covid19 filter', () => {
        const state = {
          covid19: {
            options: [
              {id: 'covid19', label: 'Member of the COVID-19 network'}
            ]
          }
        }

        const actual = getters.getCovid19Options(state)
        const expected = [
          {id: 'covid19', label: 'Member of the COVID-19 network'}
        ]

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getActiveFilters', () => {
      it('should retrieve an object of filter name <-> filters', () => {
        const state = {
          country: {
            filters: ['AT'],
            options: [{id: 'AT', name: 'Austria'}]
          },
          materials: {
            filters: ['PLASMA'],
            options: [{id: 'PLASMA', label: 'Plasma'}]
          },
          diagnosis_available: {
            filters: [],
            options: []
          },
          collection_quality: {
            filters: ['eric'],
            collections: [],
            options: [{
              'id': 'eric',
              'label': 'BBMRI-ERIC audited'
            }, {
              'id': 'self',
              'label': 'Self assessment (BBMRI-ERIC remote audited)'
            }, {
              'id': 'self_dev',
              'label': 'Self assessment (BBMRI-ERIC remote audited) with documented deviations'
            }]
          },
          biobank_quality: {
            filters: ['eric'],
            options: [{
              'id': 'eric',
              'label': 'BBMRI-ERIC audited'
            }, {
              'id': 'accredited',
              'label': 'Certified by accredited body'
            }]
          },
          type: {
            filters: ['BIRTH_COHORT', 'CASE_CONTROL'],
            options: [
              {id: 'BIRTH_COHORT', label: 'Birth cohort'},
              {id: 'CASE_CONTROL', label: 'Case control'}
            ]
          },
          covid19: {
            filters: ['covid19'],
            options: [{id: 'covid19', label: 'Member of the COVID-19 network'}]
          },
          dataType: {
            filters: ['BIOLOGICAL_SAMPLES', 'GENEALOGICAL_RECORDS'],
            options: [
              {id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples'},
              {id: 'GENEALOGICAL_RECORDS', label: 'Genealogical records'}
            ]
          }
        }

        const actual = getters.getActiveFilters(state)
        const expected = {
          'materials': [
            {id: 'PLASMA', label: 'Plasma'}
          ],
          'country': [
            {id: 'AT', label: 'Austria'}
          ],
          'type': [
            {id: 'BIRTH_COHORT', label: 'Birth cohort'},
            {id: 'CASE_CONTROL', label: 'Case control'}
          ],
          'covid19': [
            {
              id: 'covid19',
              label: 'Member of the COVID-19 network'
            }
          ],
          'dataType': [
            {id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples'},
            {id: 'GENEALOGICAL_RECORDS', label: 'Genealogical records'}
          ],
          'collection_quality': [{
            id: 'eric',
            label: 'BBMRI-ERIC audited'
          }],
          'biobank_quality': [{
            id: 'eric',
            label: 'BBMRI-ERIC audited'
          }]
        }

        expect(actual).to.deep.equal(expected)
      })

      it('should retrieve an object of filters with diagnosis_available in it', () => {
        const state = {
          country: {
            filters: [],
            options: []
          },
          materials: {
            filters: [],
            options: []
          },
          diagnosis_available: {
            filters: [
              {
                '_href': '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:C00-C97',
                'id': 'urn:miriam:icd:C00-C97',
                'code': 'C00-C97',
                'label': 'C00-C97 - Malignant neoplasms',
                'ontology': 'ICD-10'
              }
            ],
            options: []
          },
          collection_quality: {
            filters: [],
            collections: [],
            options: []
          },
          biobank_quality: {
            filters: [],
            biobanks: [],
            options: []
          },
          type: {
            filters: [],
            options: []
          },
          covid19: {
            filters: [],
            options: []
          },
          dataType: {
            filters: [],
            options: []
          }
        }
        const actual = getters.getActiveFilters(state)
        const expected = {
          diagnosis_available: [
            {
              '_href': '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:C00-C97',
              'id': 'urn:miriam:icd:C00-C97',
              'code': 'C00-C97',
              'label': 'C00-C97 - Malignant neoplasms',
              'ontology': 'ICD-10'
            }
          ]
        }
        expect(actual).to.deep.equal(expected)
      })
    })

    describe('showCountryFacet', () => {
      it('should return true if showCountryFacet setting is set to true', () => {
        const state = {showCountryFacet: true}
        expect(getters.showCountryFacet(state)).to.equal(true)
      })
      it('should return false if showCountryFacet setting is set to false', () => {
        const state = {showCountryFacet: false}
        expect(getters.showCountryFacet(state)).to.equal(false)
      })
    })

    describe('getErrorMessage', () => {
      it('should return undefined if no error is set', () => {
        const state = {error: undefined}
        expect(getters.getErrorMessage(state)).to.equal(undefined)
      })
      it('should return message of first error', () => {
        const state = {error: {errors: [{message: 'this is the first error'}]}}
        expect(getters.getErrorMessage(state)).to.equal('this is the first error')
      })
      it('should return message of first error', () => {
        const state = {error: new Error('Beautiful message')}
        expect(getters.getErrorMessage(state)).to.equal('Beautiful message')
      })
      it('should return that something went wrong', () => {
        const state = {error: {}}
        expect(getters.getErrorMessage(state)).to.equal('Something went wrong')
      })
    })
  })
})
