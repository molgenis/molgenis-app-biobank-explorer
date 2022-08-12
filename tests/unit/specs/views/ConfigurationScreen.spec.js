import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ConfigurationScreen from '@/views/ConfigurationScreen'
import { mockState } from '../mockData'
import flushPromises from 'flush-promises'

jest.useFakeTimers()
const localVue = createLocalVue()

localVue.use(Vuex)

const mockAppConfig = JSON.stringify({ test: 'data' })
const mockDiffText = JSON.stringify({ text: 'Diff editor test data' })

const GetApplicationConfiguration = jest.fn().mockReturnValue(mockAppConfig)
const SaveApplicationConfiguration = jest.fn()
const editorGetValue = jest.fn().mockReturnValue(JSON.stringify(mockAppConfig))
const editorSetValue = jest.fn()

const mockEditor = {
  create: jest.fn().mockReturnValue(
    {
      getAction: jest.fn().mockReturnValue({ run: jest.fn() }),
      getValue: editorGetValue,
      getModel: jest.fn().mockReturnValue({ setValue: editorSetValue })
    })
}

describe('ConfigurationScreen', () => {
  let store
  beforeEach(() => {
    jest.mock('monaco-editor/esm/vs/editor/editor.api', () => {
      return {
        editor: mockEditor
      }
    })

    store = new Vuex.Store({
      state: { ...mockState(), appConfig: mockAppConfig },
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

  it('should set statusClosed to false, get the editor value and call save when saving, so that notification can be shown', async () => {
    const wrapper = shallowMount(ConfigurationScreen, { store, localVue, data: () => ({ editorType: 'editor' }) })
    await flushPromises() // needed for async mounted.
    wrapper.vm.save()

    expect(wrapper.vm.$data.statusClosed).toBeFalsy()
    expect(editorGetValue).toHaveBeenCalled()
    expect(SaveApplicationConfiguration).toHaveBeenCalled()
  })

  it('calls setvalue on editor and sets the appconfig back on cancel', async () => {
    const wrapper = shallowMount(ConfigurationScreen, { store, localVue })
    await flushPromises()
    wrapper.vm.switchView('editor')
    jest.runAllTimers()

    expect(editorSetValue).toHaveBeenCalledWith(mockAppConfig)
  })

  it('calls saveDiff when diff-editor emits save and sets the value on the regular editor', async () => {
    const wrapper = shallowMount(ConfigurationScreen, { store, localVue })
    await flushPromises()
    wrapper.vm.saveDiff(mockDiffText)

    expect(SaveApplicationConfiguration).toHaveBeenCalledWith(expect.anything(), mockDiffText)
    expect(editorSetValue).toHaveBeenCalledWith(mockDiffText)
  })
})
