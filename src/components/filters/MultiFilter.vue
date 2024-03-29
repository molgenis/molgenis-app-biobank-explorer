<template>
  <div>
    <satisfy-all-radiobutton
      v-if="showSatisfyAllSelector"
      :value="satisfyAllValue"
      :satisfy-all-label="satisfyAllLabel"
      @input="(value) => $emit('satisfy-all', value)"/>
    <b-input-group>
      <b-form-input
        v-model="query"
        :name="name"
        :placeholder="placeholder"
        trim/>
      <b-input-group-append>
        <b-button
          variant="outline-secondary"
          :disabled="isLoading"
          @click.prevent="query = ''">
          <font-awesome-icon
            v-if="isLoading"
            icon="spinner"
            class="fa-spin"
            size="xs"/>
          <font-awesome-icon v-else icon="times" />
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <b-form-checkbox-group
      v-if="slicedOptions.length"
      v-model="selection"
      class="checkbox-list"
      :name="name"
      :options="slicedOptions"
      stacked/>
    <div class="d-flex">
      <b-link
        v-if="showCount < multifilterOptions.length"
        class="card-link"
        @click="showMore">
        {{ showMoreText }}
      </b-link>
      <div
        v-if="foundOptionCount >= optionsWarningCount"
        v-b-popover.hover="
          `There are ${optionsWarningCount} or more results found, only the first ${optionsWarningCount} are available. Please refine your search.`
        "
        class="
          badge badge-warning
          help
          text-white
          ml-auto
          d-flex
          align-items-center
        ">
        <span class="mr-1"> {{ optionsWarningCount }}+ </span>
        <font-awesome-icon icon="exclamation-circle" />
      </div>
    </div>
  </div>
</template>

<script>
import SatisfyAllRadiobutton from '../micro-components/SatisfyAllRadiobutton.vue'

export default {
  name: 'MultiFilter',
  components: {
    SatisfyAllRadiobutton
  },
  props: {
    /**
     * Toggle to switch between returning an array with values or an array with the full option
     */
    returnTypeAsObject: {
      type: Boolean,
      required: false,
      default: () => false
    },
    /**
     * The HTML input element name.
     */
    name: {
      type: String,
      required: true
    },
    /**
     * The HTML input element placeholder.
     */
    placeholder: {
      type: String,
      required: false,
      default: () => 'Type to search more'
    },
    /**
     * The async method returning filter options.
     */
    options: {
      type: Function,
      required: true
    },
    /**
     * The amount of initial options to show.
     */
    initialDisplayItems: {
      type: Number,
      required: false,
      default: () => 1
    },
    /**
     * The amount of options available at one time
     * per search request
     */
    optionsWarningCount: {
      type: Number,
      required: false,
      default: 100
    },
    /**
     * @model
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * This is the satisfyAll property value. It is true if the satisfyAll property has been set (satisfyAll button checked),
     * false if not.
     */
    satisfyAllValue: {
      type: Boolean,
      default: () => false
    },
    /**
     * The amount of options to show after filtering the checkbox options.
     */
    maxVisibleOptions: {
      type: Number,
      default: () => 10
    },
    /**
     * Whether to show the SatisfyAll checkbox or not.
     * If checked it emits 'satisfyAll' with a boolean
     */
    showSatisfyAllSelector: {
      type: Boolean,
      required: false,
      default: () => false
    },
    /**
     * The label to show on the left of the satisfy all Checkbox
     */
    satisfyAllLabel: {
      type: String,
      required: false,
      default: () => 'Satisfy all'
    }
  },
  data () {
    return {
      satisfyAll: false,
      externalUpdate: false,
      showCount: 0,
      isLoading: false,
      triggerQuery: Number,
      inputOptions: [],
      initialOptions: [],
      selection: [],
      query: ''
    }
  },
  computed: {
    multifilterOptions () {
      return this.inputOptions || []
    },
    slicedOptions () {
      return this.multifilterOptions.slice(0, this.showCount)
    },
    foundOptionCount () {
      return this.multifilterOptions.length
    },
    showMoreText () {
      const remaining = this.foundOptionCount - this.showCount
      if (remaining <= this.maxVisibleOptions) {
        return `Show remaining ${remaining}`
      } else {
        return `Show ${this.maxVisibleOptions} more`
      }
    }
  },
  watch: {
    async selection (newValue) {
      let newSelection
      if (this.externalUpdate) {
        this.externalUpdate = false
        return
      }

      if (this.returnTypeAsObject) {
        await this.checkMissingOptions()

        newSelection = Object.assign(
          newValue,
          this.multifilterOptions.filter(mfo => newValue.includes(mfo.value))
        )
      } else {
        newSelection = [...newValue]
      }

      this.$emit('input', newSelection)
    },
    value () {
      this.setSelection()
    },
    async query (queryValue) {
      if (this.triggerQuery) {
        clearTimeout(this.triggerQuery)
      }

      if (!queryValue || !queryValue.length) {
        this.inputOptions = this.sort(
          this.initialOptions.concat(this.inputOptions)
        )
        return
      }

      this.triggerQuery = setTimeout(async () => {
        clearTimeout(this.triggerQuery)
        this.showCount = this.maxVisibleOptions
        this.isLoading = true

        this.inputOptions = await this.options({
          nameAttribute: 'label',
          query: this.query
        })

        this.isLoading = false
      }, 500)
    }
  },
  created () {
    this.showCount = this.maxVisibleOptions
  },
  beforeMount () {
    this.initializeFilter()
  },
  methods: {
    sort (optionsArray) {
      const notSelectedOptions = optionsArray.filter(
        option => !this.selection.includes(option.value)
      )
      const selectedOptions = optionsArray.filter(option =>
        this.selection.includes(option.value)
      )

      const allOptions = selectedOptions.concat(notSelectedOptions)
      return this.deduplicateOptions(allOptions)
    },
    deduplicateOptions (optionArray) {
      const addedValues = []
      const uniqueOptions = []
      const optionSize = optionArray.length

      for (let index = 0; index < optionSize; index++) {
        const option = optionArray[index]

        if (!addedValues.includes(option.value)) {
          addedValues.push(option.value)
          uniqueOptions.push(option)
        }
      }

      return uniqueOptions
    },
    async checkMissingOptions () {
      let values
      if (
        this.value &&
        Array.isArray(this.value) &&
        this.value.length &&
        typeof this.value[0] === 'object'
      ) {
        values = this.value.map(s => s.value)
      } else {
        values = this.value
      }

      const comparison = this.inputOptions.map(io => io.value)
      const newValues = values.filter(value => !comparison.includes(value))
      if (newValues.length) {
        const newOptions = await this.options({
          nameAttribute: 'id',
          queryType: 'in',
          query: newValues.join(',')
        })
        this.inputOptions = this.sort(newOptions.concat(this.inputOptions))
      }
    },
    setSelection () {
      this.externalUpdate = true
      this.selection =
        typeof this.value[0] === 'object'
          ? this.value.map(vo => vo.value)
          : this.value
    },
    showMore () {
      this.showCount += this.maxVisibleOptions
    },
    async initializeFilter () {
      let selectedOptions = []

      if (this.value && this.value.length) {
        this.setSelection()
        // Get the initial selected
        selectedOptions = await this.options({
          nameAttribute: 'id',
          queryType: 'in',
          query: this.selection.join(',')
        })
      }

      // fetch the other options and concat
      const completeInitialOptions = selectedOptions.concat(
        await this.options({
          nameAttribute: 'label',
          count: this.initialDisplayItems
        })
      )

      this.inputOptions = this.deduplicateOptions(
        this.sort(completeInitialOptions)
      )

      this.initialOptions = this.inputOptions
    }
  }
}
</script>

<style scoped>
.help:hover {
  cursor: help;
}

.checkbox-list {
  margin: 0.75rem 0;
  max-height: 16rem;
  overflow-y: auto;
}

.card-link {
  font-size: small;
  font-style: italic;
}

/* the focus on checkbox was cut off, this fixes it */
::v-deep .custom-control {
  padding-left: 1.65rem;
}
</style>
