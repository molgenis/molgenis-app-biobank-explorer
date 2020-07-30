import CheckboxFilters from '@/components/filters/CheckboxFilters'
import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('components', () => {
  describe('CheckboxFilters', () => {
    describe('html', () => {
      let wrapper, boxes
      beforeEach(() => {
        // Do a full mount so we can click the actual inputs
        wrapper = mount(CheckboxFilters, {
          propsData: {
            name: 'facet',
            label: 'Label',
            options: [{ id: '1', label: 'option 1' }, { id: '2', label: 'option 2' }],
            value: ['1'],
            initiallyCollapsed: false,
            maxVisibleOptions: 4
          },
          localVue
        })
        boxes = wrapper.findAll('input')
      })

      it('should render the label', () => {
        expect(wrapper.find('.filter-header').text()).toEqual('Label')
      })

      it('should render the body when not collapsed', () => {
        // to be replaced with: yarn add --dev @testing-library/jest-dom, https://github.com/testing-library/jest-dom#tobevisible
        expect(wrapper.find('.card-body').isVisible()).toBeTruthy()
      })

      it('should not render the body when initially collapsed', () => {
        const collapsedWrapper = mount(CheckboxFilters, {
          propsData: {
            label: 'Label',
            options: [],
            value: [],
            initiallyCollapsed: true
          },
          localVue
        })
        expect(collapsedWrapper.find('.card-body').exists()).toEqual(false)
      })

      it('should toggle collapse state when card header is clicked', async (done) => {
        const header = wrapper.find('.card-header')
        header.element.click()
        await wrapper.vm.$nextTick()
        expect(wrapper.find('.card-body').isVisible()).toBeFalsy()
        header.element.click()

        await wrapper.vm.$nextTick()
        expect(wrapper.find('.card-body').isVisible()).toBeTruthy()
        done()
      })

      it('should render the option labels', () => {
        const labels = wrapper.findAll('label')
        expect(labels.at(1).text()).toEqual('option 1')
        expect(labels.at(2).text()).toEqual('option 2')
      })

      it('should select the selected option boxes', () => {
        expect(boxes.at(1).find('input').element.checked).toEqual(true)
        expect(boxes.at(2).find('input').element.checked).toEqual(false)
      })

      it('should emit an event when a checkbox is checked', async () => {
        boxes.at(2).find('input').setChecked()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().input).toStrictEqual([[['1', '2']]])
      })

      it('should emit an event when a checkbox is unchecked', async () => {
        boxes.at(1).find('input').setChecked(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().input).toStrictEqual([[[]]])
      })

      it('should not slice options when there are fewer than max options', () => {
        expect(wrapper.findAll('label').length).toEqual(3) // +1 for satisfy all
        expect(wrapper.vm.$data.sliceOptions).toEqual(false)
      })

      it('should slice options when there are more than max options', async () => {
        wrapper.setProps({ maxVisibleOptions: 1 })
        await wrapper.vm.$nextTick()
        expect(wrapper.findAll('label').length).toEqual(2)
        expect(wrapper.vm.$data.sliceOptions).toEqual(true)
      })

      it('should show expand link when the options are sliced', async () => {
        wrapper.setProps({ maxVisibleOptions: 1 })
        await wrapper.vm.$nextTick()
        const toggler = wrapper.find('.toggle-slice')
        expect(toggler.isVisible()).toEqual(true)
        expect(toggler.text()).toEqual('Show 1 more')
      })

      it('should expand the checkboxes when the toggle link is clicked', async () => {
        wrapper.setProps({ maxVisibleOptions: 1 })
        await wrapper.vm.$nextTick()
        const toggler = wrapper.find('.toggle-slice')
        toggler.trigger('click')
        await wrapper.vm.$nextTick()
        expect(toggler.text()).toEqual('Show less')
        expect(wrapper.findAll('label').length).toEqual(3)
      })

      it('should emit an event when Deselect all is clicked', () => {
        const selectionToggler = wrapper.find('.toggle-select')
        expect(selectionToggler.text()).toEqual('Deselect all')
        selectionToggler.trigger('click')
        expect(wrapper.emitted().input).toStrictEqual([[[]]])
      })

      it('should emit an event when Select all is clicked', () => {
        wrapper = mount(CheckboxFilters, {
          propsData: {
            name: 'facet',
            label: 'Label',
            options: [{ id: '1', label: 'option 1' }, { id: '2', label: 'option 2' }],
            value: [],
            initiallyCollapsed: false,
            maxVisibleOptions: 4
          },
          localVue
        })
        const selectionToggler = wrapper.find('.toggle-select')
        expect(selectionToggler.text()).toEqual('Select all')
        selectionToggler.trigger('click')
        expect(wrapper.emitted().input).toStrictEqual([[['1', '2']]])
      })

      it('moves important options to the top of the list and leaves the order of the other options intact', () => {
        wrapper = mount(CheckboxFilters, {
          propsData: {
            name: 'facet',
            label: 'Label',
            options: [{ id: 'testA', label: 'testLabelA' }, { id: 'testB', label: 'testLabelB', important: true },
              { id: 'testC', label: 'testLabelC', important: true }, { id: 'testD', label: 'testLabelD' }],
            value: [],
            initiallyCollapsed: false,
            maxVisibleOptions: 10
          },
          localVue
        })

        expect(wrapper.vm.visibleOptions).toStrictEqual([{ id: 'testB', value: 'testB', text: 'testLabelB', important: true },
          { id: 'testC', value: 'testC', text: 'testLabelC', important: true },
          { id: 'testA', value: 'testA', text: 'testLabelA', important: undefined },
          { id: 'testD', value: 'testD', text: 'testLabelD', important: undefined }])
      })
    })
  })
})
