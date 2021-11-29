<template>
  <div :class="{'m-n1': activeValues.length > 0}">
    <button
      v-for="(item, key) in activeValues"
      :key="key"
      type="button"
      class="active-filter btn btn-light m-1 btn-outline-secondary"
      @click="removeFilter(item)">
      {{ item.label }}: {{ item.value }}
      <font-awesome-icon
        icon="times"
        class="ml-1"/>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ActiveFilters',
  props: {
    /**
     * List of filter objects
     */
    filters: {
      type: Array,
      required: true
    },
    /**
     * Active filter values
     * @model
     */
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeValues: []
    }
  },
  watch: {
    value: {
      handler (newValue) {
        this.buildActiveValues(newValue)
      },
      immediate: true
    }
  },
  methods: {
    async buildActiveValues (newValue) {
      const activeValues = []
      Object.entries(newValue).forEach(async ([key, current]) => {
        const filter = this.selectFilter(key)

        // Clean op the values by removing undefined entry's
        if (current === undefined || (Array.isArray(current) && !current.length)) {
          return
        }

        // Unpack array
        if (Array.isArray(current)) {
          // Checkbox
          if (filter.type === 'checkbox-filter') {
            // resolve options function/promise and show results later
            const option = await filter.options()
            current.forEach(subKey => {
              const findTextFromValue = option.filter(
                filterOption => filterOption.value === subKey
              )[0]
              activeValues.push({
                key,
                subKey,
                value: findTextFromValue ? findTextFromValue.text : '',
                label: filter.label
              })
            })
          }

          if (filter.type === 'multi-filter') {
            const options = await filter.options({ nameAttribute: false, queryType: 'in', query: current.join(',') })
            current.forEach(subKey => {
              const findTextFromValue = options.filter(
                filterOption => filterOption.value === subKey
              )[0]
              activeValues.push({
                key,
                subKey,
                value: findTextFromValue.text,
                label: filter.label
              })
            })
          }
        } else {
          // Single item
          activeValues.push({ key, value: current, label: filter.label })
        }
      })
      if (this.value === newValue) {
        this.activeValues = activeValues
      }
    },
    selectFilter (key) {
      return this.filters.filter(filter => filter.name === key)[0]
    },
    removeFilter ({ key, subKey }) {
      const selections = { ...this.value }
      if (subKey === undefined) {
        delete selections[key]
      } else {
        selections[key] = selections[key].filter(selectionKey => selectionKey !== subKey)
      }
      this.$emit('input', selections)
    }
  }
}
</script>

<style scoped>
button svg path {
  transition: fill 0.3s;
}

button:hover svg path {
  fill: var(--danger);
}
</style>
