<template>
  <checkbox-filters v-if="options"
                    :options="options"
                    label="Countries"
                    v-model="filters"
                    :initially-collapsed="!this.$store.state.route.query.country"/>
</template>

<script>
  import { GET_COUNTRY_OPTIONS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'
  import CheckboxFilters from './CheckboxFilters'

  export default {
    name: 'country-filters',
    computed: {
      ...mapGetters({
        options: 'getCountryOptions'
      }),
      filters: {
        get () {
          return this.$store.state.country.filters
        },
        set (filters) {
          this.$store.commit(UPDATE_FILTER, {name: 'country', filters: filters})
        }
      }
    },
    watch: {
      filters (filters) {
        const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {country: filters.length === 0 ? undefined : filters.join(',')})
        this.$router.push({query: updatedRouteQuery})
      }
    },
    mounted () {
      this.$store.dispatch(GET_COUNTRY_OPTIONS)
    },
    components: { CheckboxFilters }
  }
</script>
