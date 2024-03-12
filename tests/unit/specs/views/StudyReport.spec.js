import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Loading from 'vue-loading-overlay'
import StudyReport from '@/views/StudyReport'
import ReportTitle from '@/components/report-components/ReportTitle'
import CollectionTitle from '@/components/report-components/CollectionTitle'
import ReportStudyDetails from '@/components/report-components/ReportStudyDetails'
import StudyReportInfoCard from '@/components/cards/StudyReportInfoCard'
import { baseGetters } from '../mockData'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('StudyReport', () => {
  let store
  let stubs
  let mocks
  let studyReport

  beforeEach(() => {
    studyReport = {
      _meta: {
        name: 'meta'
      },
      id: 's-001',
      title: 'Important study',
      description: 'An important clinical study',
      type: 'Observational',
      age_unit: [
        {
          _href: '/api/v2/eu_bbmri_eric_age_units/YEAR',
          id: 'YEAR',
          label: 'Year'
        }
      ],
      also_known: [
        {
          _href: '/api/v2/eu_bbmri_eric_also_known_in/s001-aka-cs-001',
          id: 'id:001',
          name_system: 'Another catalog',
          pid: 'cs-001',
          url: 'https://another-catalog.eu/study/cs-001',
          withdrawn: false,
          label: 'Another Catalog'
        }
      ],
      collections: [
        {
          id: 'c-001',
          name: 'beautiful collection',
          description: 'beautiful samples',
          order_of_magnitude: {
            _href: '/api/v2/eu_bbmri_eric_biobank_size/3',
            size: '777'
          },
          country: {
            name: 'Genovia'
          },
          network: [
            {
              id: 'network-x',
              name: 'Network x'
            },
            {
              id: 'network-y',
              name: 'Network y'
            }
          ],
          biobank: {
            id: 'b-001',
            name: 'beautiful biobank',
            juridical_person: 'Is this even a person?',
            email: 'info@beautiful-biobank.gnv',
            url: 'https://beautiful-biobank.gnv'
          }
        }
      ],
      age_low: 16,
      number_of_subjects: 373,
      sex: [
        {
          _href: '/api/v2/eu_bbmri_eric_sex_types/MALE',
          id: 'MALE',
          label: 'Male'
        },
        {
          _href: '/api/v2/eu_bbmri_eric_sex_types/FEMALE',
          id: 'FEMALE',
          label: 'Female'
        }
      ]
    }

    store = new Vuex.Store({
      state: {
        studyReport,
        isLoading: false
      },
      actions: {
        GetStudyReport: () => { }
      },
      getters: {
        ...baseGetters
      }
    })
    mocks = {
      $route: {
        fullPath: '/study/s-001'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
    expect(wrapper.html()).toContain('class="container mg-collection-report-card')
  })

  it('checks for components if loaded', () => {
    const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
    expect(wrapper.findComponent(Loading).exists())
    expect(wrapper.findComponent(Loading).props().active).toBe(false)
    expect(wrapper.findComponent(ReportTitle).exists()).toBe(true)
    expect(wrapper.findComponent(ReportStudyDetails).exists()).toBe(true)
    expect(wrapper.findComponent(CollectionTitle).exists()).toBe(true)
    expect(wrapper.findComponent(StudyReportInfoCard).exists()).toBe(true)
  })

  it('checks for components when loading', () => {
    store.state.isLoading = true
    const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
    expect(wrapper.findComponent(Loading).props().active).toBe(true)
    expect(wrapper.findComponent(ReportTitle).exists()).toBe(false)
    expect(wrapper.findComponent(ReportStudyDetails).exists()).toBe(false)
    expect(wrapper.findComponent(CollectionTitle).exists()).toBe(false)
    expect(wrapper.findComponent(StudyReportInfoCard).exists()).toBe(false)
  })

  describe('computed', () => {
    describe('studyId', () => {
      it('computes the study id based on URL', () => {
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.studyId).toBe('s-001')
      })
    })

    describe('studyDataAvailable', () => {
      it('computes study data availability to true when the study is loaded', () => {
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.studyDataAvailable).toBe(true)
      })

      it('computes study data availability to false when the study is loaded', () => {
        store.state.studyReport = {}
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.studyDataAvailable).toBe(false)
      })
    })

    describe('info', () => {
      it('computes the info to pass to StudyReportInfoCard', () => {
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.info).toStrictEqual({
          also_known: [{
            label: studyReport.also_known[0].label,
            system: studyReport.also_known[0].name_system,
            url: studyReport.also_known[0].url
          }]
        })
      })
    })

    describe('collectionsData', () => {
      it('computes the collectionsData based on the data in the study', () => {
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toHaveLength(1)
        expect(wrapper.vm.collectionsData[0]).toHaveProperty('viewmodel')
      })

      it('checks that subcollections are not included', () => {
        const collections = [
          {
            id: 'c-001',
            name: 'beautiful collection'
          },
          {
            id: 'c-001',
            name: 'beautiful collection',
            parent_collection: {
              _href: '/var/v2/eu_bbmri_collections/c-001'
            }
          }
        ]
        store.state.studyReport.collections = collections
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toHaveLength(1)
        expect(wrapper.vm.collectionsData[0]).toHaveProperty('viewmodel')
      })

      it('checks that collections are sorted by name', () => {
        const collections = [
          {
            id: 'c-001',
            name: 'beautiful collection'
          },
          {
            id: 'c-002',
            name: 'Another beautiful collection'
          }
        ]
        store.state.studyReport.collections = collections
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toHaveLength(2)
        expect(wrapper.vm.collectionsData[0].id).toBe('c-002')
        expect(wrapper.vm.collectionsData[1].id).toBe('c-001')
      })

      it('computes the collectionsData to empty list when study data is not available', () => {
        store.state.studyReport = {}
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toStrictEqual([])
      })

      it('computes the collectionsData to empty list when study data does not contain collections', () => {
        delete store.state.studyReport.collections
        const wrapper = shallowMount(StudyReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toStrictEqual([])
      })
    })
  })
})
