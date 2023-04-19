import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import App from '@/App'
import { mockState } from './mockData'
import mutations from '@/store/mutations'
import getters from '@/store/getters'
import actions from '@/store/actions'
import BootstrapVue from 'bootstrap-vue'

/** need to mock this because it is imported in filteroptions but does not load completely due to test environment */
import store from '@/store'
import api from '@molgenis/molgenis-api-client'

jest.mock('@/store')
store.commit = jest.fn()

jest.mock('@molgenis/molgenis-api-client')
api.get = () => new Promise(resolve => resolve('finished'))

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(BootstrapVue)

describe('App', () => {
  let store
  const GetQualityStandardInformation = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      state: { ...mockState() },
      actions: {
        GetQualityStandardInformation: GetQualityStandardInformation,
        GetApplicationContext: jest.fn()
      },
      mutations,
      getters
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(App, { store, localVue })
    expect(wrapper.findComponent({ name: 'b-alert' }).exists()).toBeFalsy()
    expect(wrapper.html()).not.toContain('class="toast-container toast-container-top-center mt-1 alert-info')
    expect(wrapper.findComponent({ name: 'router-view' }).exists())
  })

  it('should show notification when it is not undefined', () => {
    store.commit('SetNotification', 'something happened')
    const wrapper = shallowMount(App, { store, localVue })
    expect(wrapper.vm.notificationMessage).toEqual('something happened')
    expect(wrapper.html()).toContain('class="toast-container toast-container-top-center mt-1 alert-info')
  })

  it('should start a timer when the notification is set and reset the notification after the timer ', async () => {
    jest.spyOn(global, 'setTimeout')
    jest.spyOn(global, 'clearTimeout')
    jest.useFakeTimers()
    const SetNotification = jest.fn()
    store = new Vuex.Store({
      state: { ...mockState() },
      actions,
      mutations: {
        ...mutations,
        SetNotification: SetNotification,
        ConfigureFilters: jest.fn(),
        MapQueryToState: jest.fn(),
        SetQualityStandardDictionary: jest.fn(),
        SetAppContext: jest.fn()
      },
      getters
    })
    const wrapper = shallowMount(App, { store, localVue })
    wrapper.vm.$options.watch.notificationMessage.call(wrapper.vm, null)
    jest.runAllTimers()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    await wrapper.vm.$nextTick()
    expect(clearTimeout).toHaveBeenCalledTimes(1)
    expect(SetNotification).toHaveBeenCalledWith(expect.anything(), undefined)
    jest.useRealTimers()
  })

  it('should call MapQueryState when loading is done', () => {
    const MapQueryToState = jest.fn()
    store = new Vuex.Store({
      state: { ...mockState() },
      actions,
      mutations: {
        ...mutations,
        MapQueryToState: MapQueryToState
      },
      getters
    })
    const wrapper = shallowMount(App, { store, localVue })
    wrapper.vm.$options.watch.loading.call(wrapper.vm, false)
    expect(MapQueryToState).toHaveBeenCalledTimes(2) // First call is in beforeMount
  })

  it('should not call MapQueryState when loading is true', () => {
    const MapQueryToState = jest.fn()
    store = new Vuex.Store({
      state: { ...mockState() },
      actions,
      mutations: {
        ...mutations,
        MapQueryToState: MapQueryToState
      },
      getters
    })
    const wrapper = shallowMount(App, { store, localVue })
    wrapper.vm.$options.watch.loading.call(wrapper.vm, true)
    expect(MapQueryToState).toHaveBeenCalledTimes(1) // Only first call during beforeMount
  })

  it('should call MapQueryState when $route changes', () => {
    const MapQueryToState = jest.fn()
    store = new Vuex.Store({
      state: { ...mockState() },
      actions,
      mutations: {
        ...mutations,
        MapQueryToState: MapQueryToState
      },
      getters
    })
    const wrapper = shallowMount(App, { store, localVue })
    wrapper.vm.$options.watch.$route.call(wrapper.vm, '')
    expect(MapQueryToState).toHaveBeenCalledTimes(2) // First call is in beforeMount
  })

  it('should show error when it is not undefined', () => {
    store.commit('SetError', { message: 'error' })
    const wrapper = shallowMount(App, { store, localVue })
    expect(wrapper.vm.errorMessage).toEqual('error')
    expect(wrapper.findComponent({ name: 'b-alert' }).exists()).toBeTruthy()
  })
})
