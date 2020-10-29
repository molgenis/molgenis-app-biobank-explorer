<template>
  <b-card class="filter-card" no-body v-if="options.length">
    <b-card-header
      class="filter-header"
      :class="important ? 'bg-warning text-white' : ''"
      v-b-toggle="'filter-card-'+name"
    >
      <span class="fa fa-caret-right when-closed mr-2" aria-hidden="true"></span>
      <span class="fa fa-caret-down when-opened mr-2" aria-hidden="true"></span>
      {{ label }}
    </b-card-header>
    <b-collapse :visible="!collapsed" :id="'filter-card-'+name">
      <b-card-body>
        <div class="query-type-selector">
          <label class="label-disabled">
            Satisfy all
            <input type="checkbox" :checked="all" disabled />
          </label>
        </div>
        <b-form-group class="pt-2">
          <b-form-checkbox-group stacked :name="name" v-model="selection">
            <div v-if="importantOptions.length > 0" class="important bg-warning text-white">
              <b-form-checkbox
                v-for="(option,index) in importantOptions"
                :value="option.id"
                :key="index + option.text"
              >{{option.text}}</b-form-checkbox>
            </div>
            <b-form-checkbox
              v-for="(option,index) in normalOptions"
              :value="option.id"
              :key="index + option.text"
            >{{option.text}}</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-link
          class="toggle-slice card-link"
          @click.prevent="toggleSlice"
          v-if="showToggleSlice"
        >{{toggleSliceText}}</b-link>
        <b-link class="toggle-select card-link" @click.prevent="toggleSelect">{{toggleSelectText}}</b-link>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<style>
/* Hides inactive caret icon, see https://bootstrap-vue.js.org/docs/components/collapse/ docs. */
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.card-link {
  font-style: italic;
  font-size: small;
}
</style>

<script>
export default {
  data () {
    return {
      collapsed: this.initiallyCollapsed,
      sliceOptions:
        this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
    }
  },
  props: {
    name: String,
    label: String,
    options: Array,
    value: Array,
    initiallyCollapsed: Boolean,
    maxVisibleOptions: Number,
    important: Boolean,
    all: Boolean
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
    importantOptions () {
      return this.visibleOptions.filter(o => o.important)
    },
    normalOptions () {
      return this.visibleOptions.filter(o => !o.important)
    },
    visibleOptions () {
      // make it so that importants always start above the cut
      const allOptions = this.options
        .map(o => ({
          value: o.id,
          text: o.label || o.name,
          id: o.id,
          important: o.important
        }))
        .sort((a, b) => {
          if (!a.important && !b.important) return 0
          else if (a.important && !b.important) return -1
          else return 1
        })
      return this.sliceOptions
        ? allOptions.slice(0, this.maxVisibleOptions)
        : allOptions
    },
    showToggleSlice () {
      return (
        this.maxVisibleOptions && this.maxVisibleOptions < this.options.length
      )
    },
    toggleSelectText () {
      return this.selection.length ? 'Deselect all' : 'Select all'
    },
    toggleSliceText () {
      return this.sliceOptions
        ? `Show ${this.options.length - this.maxVisibleOptions} more`
        : 'Show less'
    }
  },
  methods: {
    toggleSelect () {
      this.selection =
        this.selection && this.selection.length
          ? []
          : this.options.map(option => option.id)
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

<style scoped>
.important {
  position: relative;
  width: calc(
    100% + 2.5rem
  ); /* to adjust for the bootstrap width of the column */
  left: -1.25rem; /* To offset the background to occupy the entire width */
  padding-left: 1.25rem; /* adjust checkbox to be inline */
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
