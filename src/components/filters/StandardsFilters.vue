<template>
  <checkbox-filters v-if="options"
                    :options="options"
                    label="Standards"
                    v-model="filters"
                    :max-visible-options="4"
                    :initially-collapsed="!this.$store.state.route.query.standards"/>
</template>

<script>
  import { GET_STANDARDS_OPTIONS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'
  import CheckboxFilters from './CheckboxFilters'

  export default {
    name: 'standards-filters',
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
    },
    components: { CheckboxFilters }
  }
</script>
