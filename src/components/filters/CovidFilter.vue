<template>
  <div>
    <div class="query-type-selector">
      <label class="label-disabled">
        Satisfy all
        <input type="checkbox" v-model="satisfyAllSelection"/>
      </label>
    </div>
    <div>
      <b-form-checkbox-group v-model="selection" stacked :options="visibleOptions" />
      <span v-if="bulkOperation">
        <b-link v-if="showToggleSlice" class="toggle-slice card-link" @click.prevent="toggleSlice">
          {{ toggleSliceText }}
        </b-link>
        <b-link class="toggle-select card-link" @click.prevent="toggleSelect">
          {{ toggleSelectText }}
        </b-link>
      </span>
    </div>
  </div>
</template>

<script>
/* istanbul ignore file */

export default {
  name: 'CovidFilter',
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
     * A Promise-function that resolves with an array of options.
     * {text: 'foo', value: 'bar'}
     */
    options: {
      type: [Function],
      required: true
    },
    /**
     * This is the v-model value; an array of selected options.
     * Can also be a { text, value } object array
     */
    value: {
      type: Array,
      default: () => []
    },

    satisfyAllValue: {
      type: Boolean,
      default: () => false
    },
    /**
     * Whether to use (De)Select All or not.
     */
    bulkOperation: {
      type: Boolean,
      required: false,
      default: () => true
    },
    /**
     * Limit the maximum number of visible items.
     */
    maxVisibleOptions: {
      type: Number,
      default: () => undefined
    }
  },
  data () {
    return {
      satisfyAllSelection: undefined,
      externalUpdate: false,
      satisfyAllExternalUpdate: false,
      selection: [],
      resolvedOptions: [],
      sliceOptions: this.maxVisibleOptions && this.resolvedOptions && this.maxVisibleOptions < this.resolvedOptions.length
    }
  },
  computed: {
    visibleOptions () {
      return this.sliceOptions ? this.resolvedOptions.slice(0, this.maxVisibleOptions) : (typeof this.resolvedOptions === 'function' ? [] : this.resolvedOptions)
    },
    showToggleSlice () {
      return this.maxVisibleOptions && this.maxVisibleOptions < this.resolvedOptions.length
    },
    toggleSelectText () {
      return this.value.length ? 'Deselect all' : 'Select all'
    },
    toggleSliceText () {
      return this.sliceOptions ? `Show ${this.resolvedOptions.length - this.maxVisibleOptions} more` : 'Show less'
    }
  },
  watch: {
    value () {
      this.setValue()
    },
    resolvedOptions () {
      this.sliceOptions = this.showToggleSlice
    },
    selection (newValue) {
      if (!this.externalUpdate) {
        let newSelection = []

        if (this.returnTypeAsObject) {
          newSelection = Object.assign(newSelection, this.resolvedOptions.filter(of => newValue.includes(of.value)))
        } else {
          newSelection = [...newValue]
        }
        this.$emit('input', newSelection)
      }
      this.externalUpdate = false
    },
    satisfyAllSelection (newSatisfyAllSelectionValue) {
      if (!this.satisfyAllExternalUpdate) {
        this.$emit('satisfyAll', newSatisfyAllSelectionValue)
      }
      this.satisfyAllExternalUpdate = false
    }
  },
  created () {
    this.options().then(response => {
      this.resolvedOptions = response
    })
    this.setValue()
    this.setSatisfyAllValue()
  },
  methods: {
    toggleSelect () {
      if (this.selection && this.selection.length > 0) {
        this.selection = []
      } else {
        this.selection = this.resolvedOptions.map(option => option.value)
      }
    },
    toggleSlice () {
      this.sliceOptions = !this.sliceOptions
    },
    setValue () {
      this.externalUpdate = true
      if (this.value && this.value.length > 0 && typeof this.value[0] === 'object') {
        this.selection = this.value.map(vo => vo.value)
      } else {
        this.selection = this.value
      }
    },
    setSatisfyAllValue () {
      this.satisfyAllExternalUpdate = true
      this.satisfyAllSelection = this.satisfyAllValue
    }
  }
}
</script>

<style>
.card-link {
  font-style: italic;
  font-size: small;
}
.query-type-selector {
  text-align: right;
}

.query-type-selector label {
  position: relative;
  margin: 0;
  top: -0.5rem;
}

.query-type-selector label:hover {
  cursor: not-allowed;
}

.query-type-selector input {
  margin-left: 0.5rem;
  background-color: black;
}

.query-type-selector input::checked {
  color: #fff !important;
  background-color: #28a745 !important;
  border-color: #28a745 !important;
}
</style>
