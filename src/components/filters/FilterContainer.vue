<template>
  <div id="filter-container">
    <diagnosis-available-filters></diagnosis-available-filters>
    <checkbox-filters v-for="filter in filters"
                      :key="filter.name"
                      v-bind="filter"
                      :value="filter.filters"
                      @input="value => filterChange(filter.name, value)"/>
  </div>
</template>

<style>
  .filter-card {
    margin-bottom: 1rem;
  }

  .filter-header {
    /* Same color as BiobankCard */
    background-color: #f5f5f5;
  }

  .filter-header:hover {
    cursor: pointer;
  }
</style>


<script>
  import DiagnosisAvailableFilters from './DiagnosisAvailableFilters.vue'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { GET_COUNTRY_OPTIONS, GET_MATERIALS_OPTIONS, GET_STANDARDS_OPTIONS, GET_TYPES_OPTIONS, GET_DATA_TYPE_OPTIONS } from '../../store/actions'
  import { mapGetters, mapMutations } from 'vuex'
  import CheckboxFilters from './CheckboxFilters'

  export default {
    computed: {
      ...mapGetters({countryOptions: 'getCountryOptions',
        materialOptions: 'getMaterialOptions',
        standardsOptions: 'getStandardsOptions',
        typesOptions: 'getTypesOptions',
        dataTypeOptions: 'getDataTypeOptions'
      }),
      filters () {
        return [{
          name: 'materials',
          label: 'Materials',
          options: this.materialOptions,
          initiallyCollapsed: !this.$store.state.route.query.materials,
          filters: this.$store.state.materials.filters,
          maxVisibleOptions: 4
        }, {
          name: 'country',
          label: 'Countries',
          options: this.countryOptions,
          initiallyCollapsed: !this.$store.state.route.query.country,
          filters: this.$store.state.country.filters
        }, {
          name: 'standards',
          label: 'Standards',
          options: this.standardsOptions,
          initiallyCollapsed: !this.$store.state.route.query.standards,
          filters: this.$store.state.standards.filters,
          maxVisibleOptions: 4
        }, {
          name: 'type',
          label: 'Types',
          options: this.typesOptions,
          initiallyCollapsed: !this.$store.state.route.query.type,
          filters: this.$store.state.type.filters,
          maxVisibleOptions: 4
        }, {
          name: 'dataType',
          label: 'Data types',
          options: this.dataTypeOptions,
          initiallyCollapsed: !this.$store.state.route.query.dataType,
          filters: this.$store.state.dataType.filters,
          maxVisibleOptions: 4
        }]
      }
    },
    methods: {
      ...mapMutations({ updateFilter: UPDATE_FILTER }),
      filterChange (name, filters) {
        this.updateFilter({name, filters})
        const value = filters.length === 0 ? undefined : filters.join(',')
        this.$router.push({query: {...this.$store.state.route.query, [name]: value}})
      }
    },
    mounted () {
      this.$store.dispatch(GET_COUNTRY_OPTIONS)
      this.$store.dispatch(GET_MATERIALS_OPTIONS)
      this.$store.dispatch(GET_STANDARDS_OPTIONS)
      this.$store.dispatch(GET_TYPES_OPTIONS)
      this.$store.dispatch(GET_DATA_TYPE_OPTIONS)
    },
    components: { CheckboxFilters, DiagnosisAvailableFilters }
  }
</script>
