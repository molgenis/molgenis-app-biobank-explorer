<template>
  <div id="filter-container">
    <string-filter
      label="Search"
      v-model="search"
      :initiallyCollapsed="!$store.state.route.query.search"
      placeholder
      description="search by name, id, acronym and press enter"
    ></string-filter>
    <checkbox-filters
      class="covid-filter"
      :key="covidFilter.name"
      v-bind="covidFilter"
      :value="covidFilter.filters"
      :important="true"
      @input="value => filterChange(covidFilter.name, value)"
    />
    <diagnosis-available-filters></diagnosis-available-filters>
    <checkbox-filters
      v-for="filter in filters"
      :key="filter.name"
      v-bind="filter"
      :value="filter.filters"
      @input="value => filterChange(filter.name, value)"
    />
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
  GET_BIOBANK_QUALITY_OPTIONS,
  GET_TYPES_OPTIONS,
  GET_DATA_TYPE_OPTIONS,
  GET_COLLECTION_QUALITY_COLLECTIONS,
  GET_BIOBANK_QUALITY_BIOBANKS,
  GET_COVID_19_OPTIONS
} from '../../store/actions'
import { mapGetters, mapMutations } from 'vuex'
import CheckboxFilters from './CheckboxFilters'

export default {
  computed: {
    ...mapGetters({
      countryOptions: 'getCountryOptions',
      materialOptions: 'getMaterialOptions',
      collectionQualityOptions: 'getCollectionQualityOptions',
      biobankQualityOptions: 'getBiobankQualityOptions',
      typesOptions: 'getTypesOptions',
      dataTypeOptions: 'getDataTypeOptions',
      showCountryFacet: 'showCountryFacet',
      covid19Options: 'getCovid19Options'
    }),
    search: {
      get () {
        return this.$store.state.search
      },
      set (search) {
        const updatedRouteQuery = Object.assign(
          {},
          this.$store.state.route.query,
          { search: search.length === 0 ? undefined : search }
        )
        this.$router.push({ query: updatedRouteQuery })
        this.$store.commit(SET_SEARCH, search)
      }
    },
    covidFilter () {
      return {
        name: 'covid19',
        label: 'COVID-19',
        options: this.covid19Options,
        initiallyCollapsed: !this.$store.state.route.query.covid19,
        filters: this.$store.state.covid19.filters,
        maxVisibleOptions: 4
      }
    },
    filters () {
      return [
        {
          name: 'materials',
          label: 'Materials',
          options: this.materialOptions,
          initiallyCollapsed: !this.$store.state.route.query.materials,
          filters: this.$store.state.materials.filters,
          maxVisibleOptions: 4
        },
        {
          name: 'country',
          label: 'Countries',
          options: this.countryOptions,
          initiallyCollapsed: !this.$store.state.route.query.country,
          filters: this.$store.state.country.filters
        },
        {
          name: 'biobank_quality',
          label: 'Biobank quality marks',
          options: this.biobankQualityOptions,
          initiallyCollapsed: !this.$store.state.route.query.biobank_quality,
          filters: this.$store.state.biobank_quality.filters,
          maxVisibleOptions: 4
        },
        {
          name: 'collection_quality',
          label: 'Collection quality marks',
          options: this.collectionQualityOptions,
          initiallyCollapsed: !this.$store.state.route.query.collection_quality,
          filters: this.$store.state.collection_quality.filters,
          maxVisibleOptions: 4
        },
        {
          name: 'type',
          label: 'Collection Types',
          options: this.typesOptions,
          initiallyCollapsed: !this.$store.state.route.query.type,
          filters: this.$store.state.type.filters,
          maxVisibleOptions: 4
        },
        {
          name: 'dataType',
          label: 'Data types',
          options: this.dataTypeOptions,
          initiallyCollapsed: !this.$store.state.route.query.dataType,
          filters: this.$store.state.dataType.filters,
          maxVisibleOptions: 4
        }
      ].filter(facet => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      })
    }
  },
  methods: {
    ...mapMutations({ updateFilter: UPDATE_FILTER }),
    filterChange (name, filters) {
      this.updateFilter({ name, filters })
      const value = filters.length === 0 ? undefined : filters.join(',')
      this.$router.push({
        query: { ...this.$store.state.route.query, [name]: value }
      })
      if (name === 'collection_quality') {
        this.$store.dispatch(GET_COLLECTION_QUALITY_COLLECTIONS)
      }
      if (name === 'biobank_quality') {
        this.$store.dispatch(GET_BIOBANK_QUALITY_BIOBANKS)
      }
    }
  },
  mounted () {
    this.$store.dispatch(GET_COUNTRY_OPTIONS)
    this.$store.dispatch(GET_MATERIALS_OPTIONS)
    this.$store.dispatch(GET_COLLECTION_QUALITY_OPTIONS)
    this.$store.dispatch(GET_BIOBANK_QUALITY_OPTIONS)
    this.$store.dispatch(GET_TYPES_OPTIONS)
    this.$store.dispatch(GET_DATA_TYPE_OPTIONS)
    this.$store.dispatch(GET_COVID_19_OPTIONS)
  },
  components: { StringFilter, CheckboxFilters, DiagnosisAvailableFilters }
}
</script>
