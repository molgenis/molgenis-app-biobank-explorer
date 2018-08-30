<template>
  <div id="filter-container">
    <string-filter label="Search"
                   v-model="search"
                   :initiallyCollapsed="!$store.state.route.query.search"
                   placeholder=""
                   description="search by name, id, acronym and press enter"></string-filter>
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
  import StringFilter from './StringFilter'
  import DiagnosisAvailableFilters from './DiagnosisAvailableFilters.vue'
  import { UPDATE_FILTER, SET_SEARCH } from '../../store/mutations'
  import {
    GET_COUNTRY_OPTIONS,
    GET_MATERIALS_OPTIONS,
    GET_COLLECTION_QUALITY_OPTIONS,
    GET_TYPES_OPTIONS,
    GET_DATA_TYPE_OPTIONS,
    GET_COLLECTION_QUALITY_COLLECTIONS
  } from '../../store/actions'
  import { mapGetters, mapMutations } from 'vuex'
  import CheckboxFilters from './CheckboxFilters'

  export default {
    computed: {
      ...mapGetters({
        countryOptions: 'getCountryOptions',
        materialOptions: 'getMaterialOptions',
        collectionQualityOptions: 'getCollectionQualityOptions',
        typesOptions: 'getTypesOptions',
        dataTypeOptions: 'getDataTypeOptions'
      }),
      search: {
        get () {
          return this.$store.state.search
        },
        set (search) {
          const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {search: search.length === 0 ? undefined : search})
          this.$router.push({query: updatedRouteQuery})
          this.$store.commit(SET_SEARCH, search)
        }
      },
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
          //   name: 'biobank_quality',
          //   label: 'Quality marks - Biobank',
          //   options: this.standardsOptions,
          //   initiallyCollapsed: !this.$store.state.route.query.standards,
          //   filters: this.$store.state.biobankQuality.filters,
          //   maxVisibleOptions: 4
          // }, {
          name: 'collection_quality',
          label: 'Collection quality marks',
          options: this.collectionQualityOptions,
          initiallyCollapsed: !this.$store.state.route.query.collection_quality,
          filters: this.$store.state.collection_quality.filters,
          maxVisibleOptions: 4
        }, {
          name: 'type',
          label: 'Collection Types',
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
      ...mapMutations({updateFilter: UPDATE_FILTER}),
      filterChange (name, filters) {
        this.updateFilter({name, filters})
        const value = filters.length === 0 ? undefined : filters.join(',')
        this.$router.push({query: {...this.$store.state.route.query, [name]: value}})
        if (name === 'collection_quality') {
          this.$store.dispatch(GET_COLLECTION_QUALITY_COLLECTIONS)
        }
      }
    },
    mounted () {
      this.$store.dispatch(GET_COUNTRY_OPTIONS)
      this.$store.dispatch(GET_MATERIALS_OPTIONS)
      this.$store.dispatch(GET_COLLECTION_QUALITY_OPTIONS)
      this.$store.dispatch(GET_TYPES_OPTIONS)
      this.$store.dispatch(GET_DATA_TYPE_OPTIONS)
    },
    components: {StringFilter, CheckboxFilters, DiagnosisAvailableFilters}
  }
</script>
