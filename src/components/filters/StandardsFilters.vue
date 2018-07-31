<template>
  <div class="card filter-card">
    <div class="card-header filter-header" @click.prevent="collapsed = !collapsed">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      Standards
    </div>
    <div class="card-body" v-if="!collapsed">
      <p class="text-right" @click.prevent="toggleSelect">
        <small v-if="filters && filters.length === 0"><a href=""><i>Select all</i></a></small>
        <small v-if="filters && filters.length > 0"><a href=""><i>Deselect all</i></a></small>
      </p>

      <div v-if="options && options.length > 0" v-for="(option, index) in options" class="form-check"
           v-show="index < 4 | showAllOptions">

        <label class="form-check-label">
          <input class="form-check-input" type="checkbox" :id="option.id" :value="option.id" v-model="filters">
          {{ option.label }}
        </label>
      </div>

      <p class="text-right" @click.prevent="toggleAllOptions">
        <small v-if="!showAllOptions"><a href=""><i v-if="options"><i class="fa fa-caret-down"></i> {{ options.length - 4 }} more</i></a></small>
        <small v-else><a href=""><i>Show less</i></a></small>
      </p>
    </div>
  </div>
</template>

<script>
  import { GET_STANDARDS_OPTIONS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'

  export default {
    name: 'standards-filters',
    data () {
      return {
        collapsed: true,
        showAllOptions: false
      }
    },
    methods: {
      toggleSelect () {
        this.filters = this.filters.length > 0 ? [] : this.$store.state.standards.options.map(option => option.id)
      },
      toggleAllOptions () {
        this.showAllOptions = !this.showAllOptions
      }
    },
    computed: {
      ...mapGetters({
        options: 'getStandardsOptions'
      }),
      filters: {
        get () {
          return this.$store.state.standards.filters
        },
        set (filters) {
          this.$store.commit(UPDATE_FILTER, {name: 'standards', filters: filters})
        }
      }
    },
    watch: {
      filters (filters) {
        const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {standards: filters.length === 0 ? undefined : filters.join(',')})
        this.$router.push({query: updatedRouteQuery})
      }
    },
    mounted () {
      this.$store.dispatch(GET_STANDARDS_OPTIONS)
      this.collapsed = !this.$store.state.route.query.standards
    }
  }
</script>
