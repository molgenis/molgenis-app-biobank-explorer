import { studyMutations } from '@/store/study/studyMutations'
import { mockStudyResponse, mockState } from '../../mockData'
let state

describe('Study mutations', () => {
  beforeEach(() => {
    state = mockState()
  })

  it('can SetStudyReport', () => {
    studyMutations.SetStudyReport(state, mockStudyResponse)
  })
})
