<template>
  <b-card class="filter-card" no-body v-if="options.length">
    <b-card-header class="filter-header" :class="important ? 'bg-warning text-white' : ''" v-b-toggle="'filter-card-'+name">
      <i class="fa fa-caret-right when-closed" aria-hidden="true"></i>
      <i class="fa fa-caret-down when-opened" aria-hidden="true"></i>
      {{label}}
    </b-card-header>
    <b-collapse :visible='!collapsed' :id="'filter-card-'+name">
      <b-card-body>
        <b-form-group class="pt-2">
          <b-form-checkbox-group stacked v-model="selection" :name="name" :options="optionsInternal">
          </b-form-checkbox-group>
        </b-form-group>
        <b-link class="toggle-slice card-link" @click.prevent="toggleSlice" v-if="showToggleSlice">{{toggleSliceText}}</b-link>
        <b-link class="toggle-select card-link" @click.prevent="toggleSelect">{{toggleSelectText}}</b-link>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<style>
  /* Hides inactive caret icon, see https://bootstrap-vue.js.org/docs/components/collapse/ docs. */
  .collapsed > .when-opened, :not(.collapsed) > .when-closed { display: none; }
  .card-link { font-style: italic; font-size: small; }
</style>
<script>
  export default {
    data () {
      return {
        collapsed: this.initiallyCollapsed,
        sliceOptions: this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
      }
    },
    props: {
      name: String,
      label: String,
      options: Array,
      value: Array,
      initiallyCollapsed: Boolean,
      maxVisibleOptions: Number,
      important: Boolean
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
      optionsInternal () {
        return this.visibleOptions.map(o => ({value: o.id, text: o.label}))
      },
      visibleOptions () {
        return this.sliceOptions ? this.options.slice(0, this.maxVisibleOptions) : this.options
      },
      showToggleSlice () {
        return this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
      },
      toggleSelectText () {
        return this.selection.length ? 'Deselect all' : 'Select all'
      },
      toggleSliceText () {
        return this.sliceOptions ? `Show ${this.options.length - this.maxVisibleOptions} more` : 'Show less'
      }
    },
    methods: {
      toggleSelect () {
        this.selection = this.selection && this.selection.length ? [] : this.options.map(option => option.id)
      },
      toggleSlice () {
        this.sliceOptions = !this.sliceOptions
      }
    },
    watch: {
      options () {
        this.sliceOptions = this.showToggleSlice
      },
      maxVisibleOptions () {
        this.sliceOptions = this.showToggleSlice
      }
    }
  }
</script>
