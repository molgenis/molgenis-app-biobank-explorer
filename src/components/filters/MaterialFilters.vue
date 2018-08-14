<template>
  <checkbox-filters v-if="options"
                    :options="options"
                    label="Materials"
                    v-model="filters"
                    :max-visible-options="4"
                    :initially-collapsed="!this.$store.state.route.query.materials"/>
</template>

<script>
  import { GET_MATERIALS_OPTIONS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'
  import CheckboxFilters from './CheckboxFilters'

  export default {
    name: 'material-filters',
    computed: {
      ...mapGetters({
        options: 'getMaterialOptions'
      }),
      filters: {
        get () {
          return this.$store.state.materials.filters
        },
        set (filters) {
          this.$store.commit(UPDATE_FILTER, {name: 'materials', filters: filters})
        }
      }
    },
    watch: {
      filters (filters) {
        if (filters) {
          const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {materials: filters.length === 0 ? undefined : filters.join(',')})
          this.$router.push({query: updatedRouteQuery})
        }
      }
    },
    mounted () {
      this.$store.dispatch(GET_MATERIALS_OPTIONS)
    },
    components: { CheckboxFilters }
  }
</script>
