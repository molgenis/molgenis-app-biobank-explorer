<template>
  <div id="filter-container">
    <FilterCard
    name="search"
    label="Search"
    description="Search by name, id, acronym and press enter"
    :collapsed="!this.$store.state.route.query.search" >
      <StringFilter name="Search" v-model="search"> </StringFilter>
    </FilterCard>

    <checkbox-filters
      class="covid-filter"
      :key="covidNetworkFilter.name"
      v-bind="covidNetworkFilter"
      :value="covidNetworkFilter.filters"
      :important="true"
      @input="(value) => filterChange(covidNetworkFilter.name, value)"
    />
    <checkbox-filters
      class="covid-filter"
      :key="covidFilter.name"
      v-bind="covidFilter"
      :value="covidFilter.filters"
      :important="true"
      @input="(value) => filterChange(covidFilter.name, value)"
    />
    <diagnosis-available-filters></diagnosis-available-filters>
    <checkbox-filters
      v-for="filter in filters"
      :key="filter.name"
      v-bind="filter"
      :value="filter.filters"
      @input="(value) => filterChange(filter.name, value)"
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
import { StringFilter, FilterCard } from '@molgenis-ui/components-library'
import DiagnosisAvailableFilters from './DiagnosisAvailableFilters.vue'
import { mapGetters, mapMutations } from 'vuex'
import CheckboxFilters from './CheckboxFilters'
import { covid19NetworkFacetName } from '../../store/helpers/covid19Helper'

export default {
  components: { StringFilter, CheckboxFilters, DiagnosisAvailableFilters, FilterCard },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapGetters({
      countryOptions: 'getCountryOptions',
      materialOptions: 'getMaterialOptions',
      collectionQualityOptions: 'getCollectionQualityOptions',
      biobankQualityOptions: 'getBiobankQualityOptions',
      typesOptions: 'getTypesOptions',
      biobankNetworkOptions: 'getBiobankNetworkOptions',
      collectionNetworkOptions: 'getCollectionNetworkOptions',
      dataTypeOptions: 'getDataTypeOptions',
      showCountryFacet: 'showCountryFacet',
      covid19Options: 'getCovid19Options',
      covid19NetworkOptions: 'getCovid19NetworkOptions'
    }),
    search: {
      get () {
        return this.$store.state.search
      },
      set (search) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }

        this.debounce = setTimeout(async () => {
          clearTimeout(this.debounce)
          const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {
            search
          })
          this.$router.push({ query: updatedRouteQuery })
          this.SetSearch(search || '')
        }, 500)
      }
    },
    covidNetworkFilter () {
      return {
        name: covid19NetworkFacetName,
        label: 'COVID-19',
        options: this.covid19NetworkOptions,
        initiallyCollapsed: !this.$store.state.route.query.covid19network,
        filters: this.$store.state.covid19network.filters,
        maxVisibleOptions: 25
      }
    },
    covidFilter () {
      return {
        name: 'covid19',
        label: 'COVID-19 Services',
        options: this.covid19Options,
        initiallyCollapsed: !this.$store.state.route.query.covid19,
        filters: this.$store.state.covid19.filters,
        maxVisibleOptions: 25,
        all: true
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
          maxVisibleOptions: 25
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
          maxVisibleOptions: 25
        },
        {
          name: 'collection_quality',
          label: 'Collection quality marks',
          options: this.collectionQualityOptions,
          initiallyCollapsed: !this.$store.state.route.query.collection_quality,
          filters: this.$store.state.collection_quality.filters,
          maxVisibleOptions: 25
        },
        {
          name: 'type',
          label: 'Collection types',
          options: this.typesOptions,
          initiallyCollapsed: !this.$store.state.route.query.type,
          filters: this.$store.state.type.filters,
          maxVisibleOptions: 25
        },
        {
          name: 'biobank_network',
          label: 'Biobank network',
          options: this.biobankNetworkOptions,
          initiallyCollapsed: !this.$store.state.route.query.biobank_network,
          filters: this.$store.state.biobank_network.filters,
          maxVisibleOptions: 25
        },
        {
          name: 'collection_network',
          label: 'Collection network',
          options: this.collectionNetworkOptions,
          initiallyCollapsed: !this.$store.state.route.query.collection_network,
          filters: this.$store.state.collection_network.filters,
          maxVisibleOptions: 25
        },
        {
          name: 'dataType',
          label: 'Data types',
          options: this.dataTypeOptions,
          initiallyCollapsed: !this.$store.state.route.query.dataType,
          filters: this.$store.state.dataType.filters,
          maxVisibleOptions: 25
        }
      ].filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      })
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter', 'SetSearch']),
    filterChange (name, filters) {
      this.UpdateFilter({ name, filters })
      const value = filters.length === 0 ? undefined : filters.join(',')
      this.$router.push({
        query: { ...this.$store.state.route.query, [name]: value }
      })
      if (name === 'collection_quality') {
        this.$store.dispatch('GetCollectionQualityCollections')
      }
      if (name === 'biobank_quality') {
        this.$store.dispatch('GetBiobankQualityBiobanks')
      }
    }
  },
  mounted () {
    this.$store.dispatch('GetCountryOptions')
    this.$store.dispatch('GetMaterialsOptions')
    this.$store.dispatch('GetCollectionQualityOptions')
    this.$store.dispatch('GetBiobankQualityOptions')
    this.$store.dispatch('GetTypesOptions')
    this.$store.dispatch('GetDataTypeOptions')
    this.$store.dispatch('GetCovid19Options')
    this.$store.dispatch('GetNetworkOptions')
  }
}
</script>
