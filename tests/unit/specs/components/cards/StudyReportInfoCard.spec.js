import { createLocalVue, shallowMount } from '@vue/test-utils'
import StudyReportInfoCard from '@/components/cards/StudyReportInfoCard'

const localVue = createLocalVue()

describe('StudyReportInfoCard', () => {
  let propsData

  beforeEach(() => {
    propsData = {
      info: {
        id: 's-001',
        name: 'Dummy study',
        also_known: [{
          id: 'extcat-s-001',
          url: 'http://external-catalog/study/extcat-s-001',
          system: 'External Catalog'
        }, {
          id: 'anextcat-s-001',
          url: 'http://another-external-catalog/study/ak-s-001',
          system: 'Another External Catalog'
        }]
      }
    }
  })

  it('shows link to external catalogues', () => {
    const wrapper = shallowMount(StudyReportInfoCard, { localVue, propsData })
    expect(wrapper.html()).toContain('class="col-md-4')
    expect(wrapper.html()).toContain('class="card')
    expect(wrapper.html()).toContain('class="card-body')
    expect(wrapper.html()).toContain('class="card-text')
    // expect(wrapper.html()).toContain('class="mt-4">External Link')
    expect(wrapper.findAll('ul')).toHaveLength(2) // one for each also known
    expect(wrapper.findAll('a')).toHaveLength(2) // one for each also known
  })
})
