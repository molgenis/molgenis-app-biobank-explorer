<template>
  <div class="card filter-card">
    <div class="card-header filter-header" @click.prevent="collapsed = !collapsed">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      {{label}}
    </div>
    <div class="card-body" v-if="!collapsed">
      <p class="text-right toggle-select" @click.prevent="toggleSelect">
        <small v-if="value.length"><a href=""><i>Deselect all</i></a></small>
        <small v-else><a href=""><i>Select all</i></a></small>
      </p>

      <div v-if="options.length" v-for="option in visibleOptions" class="form-check">
        <label class="form-check-label">
          <input class="form-check-input"
                 type="checkbox"
                 v-model="selection"
                 :id="option.id"
                 :value="option.id">
          {{ option.label }}
        </label>
      </div>

      <p class="toggle-slice text-right" @click.prevent="toggleSliceOptions" v-if="showToggle">
        <small v-if="sliceOptions"><a href=""><i v-if="options"><i class="fa fa-caret-down"></i> {{ options.length - maxVisibleOptions }} more</i></a></small>
        <small v-else><a href=""><i>Show less</i></a></small>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        collapsed: this.initiallyCollapsed,
        sliceOptions: this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
      }
    },
    props: {
      label: String,
      options: Array,
      value: Array,
      initiallyCollapsed: Boolean,
      maxVisibleOptions: Number
    },
    computed: {
      selection: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      visibleOptions () {
        return this.sliceOptions ? this.options.slice(0, this.maxVisibleOptions) : this.options
      },
      showToggle () {
        return this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
      }
    },
    methods: {
      toggleSelect () {
        this.selection = this.selection && this.selection.length ? [] : this.options.map(option => option.id)
      },
      toggleSliceOptions () {
        this.sliceOptions = !this.sliceOptions
      },
      updateSliceOptions () {
        this.sliceOptions = this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
      }
    },
    watch: {
      options () { this.updateSliceOptions() },
      maxVisibleOptions () { this.updateSliceOptions() }
    }
  }
</script>
