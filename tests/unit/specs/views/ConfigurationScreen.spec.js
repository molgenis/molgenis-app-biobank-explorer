import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ConfigurationScreen from '@/views/ConfigurationScreen'
import { mockState } from '../mockData'

const localVue = createLocalVue()

localVue.use(Vuex)

const GetApplicationConfiguration = jest.fn()
const SaveApplicationConfiguration = jest.fn()

describe('ConfigurationScreen', () => {
  let store
  beforeEach(() => {
    jest.mock('monaco-editor/esm/vs/editor/editor.api', () => {
      return {
        editor: {
          create: jest.fn().mockReturnValue(
            {
              getAction: jest.fn().mockReturnValue({ run: jest.fn() })
            })
        }
      }
    })

    store = new Vuex.Store({
      state: mockState(),
      actions: {
        GetApplicationConfiguration,
        SaveApplicationConfiguration
      }
    })
  })

  it('should get config on mount', () => {
    shallowMount(ConfigurationScreen, { store, localVue })
    expect(GetApplicationConfiguration).toHaveBeenCalled()
  })
})
