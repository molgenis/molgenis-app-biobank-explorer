<template>
  <div id="filter-container">
    <FilterCard name="search" label="Search" description="Search by name, id, acronym" :collapsed="!this.$store.state.route.query.search">
      <StringFilter name="Search" v-model="search"> </StringFilter>
    </FilterCard>

    <FilterCard
      v-for="filter in filters"
      :key="filter.name"
      :name="filter.name"
      :label="filter.label"
      :collapsed="filter.initiallyCollapsed"
    >
      <component
        :is="filter.component"
        :value="$store.state.filters.selections[filter.name]"
        v-bind="filter"
        @input="(value) => filterChange(filter.name, value)"
        :maxVisibleOptions="25"
        :bulkOperation="true"
      >
      </component>
    </FilterCard>
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
import { StringFilter, FilterCard, CheckboxFilter } from '@molgenis-ui/components-library'
import DiagnosisAvailableFilters from './DiagnosisAvailableFilters.vue'
import { mapGetters, mapMutations } from 'vuex'
import { covid19NetworkFacetName } from '../../store/helpers/covid19Helper'
import { genericFilterOptions, covid19NetworkFilterOptions } from '../../utils/filterOptions'

export default {
  components: { StringFilter, CheckboxFilter, DiagnosisAvailableFilters, FilterCard },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapGetters({
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
    filters () {
      return [
        {
          component: 'CheckboxFilter',
          name: covid19NetworkFacetName,
          label: 'COVID-19',
          options: covid19NetworkFilterOptions,
          initiallyCollapsed: !this.$store.state.route.query.covid19network,
          filters: this.$store.state.covid19network.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'covid19',
          label: 'COVID-19 Services',
          options: genericFilterOptions('eu_bbmri_eric_COVID_19'),
          initiallyCollapsed: !this.$store.state.route.query.covid19,
          filters: this.$store.state.covid19.filters,
          maxVisibleOptions: 25,
          all: true
        },
        {
          component: 'diagnosis-available-filters',
          name: 'diagnosis_available',
          label: 'Diagnosis available',
          initiallyCollapsed: false
        },
        {
          component: 'CheckboxFilter',
          name: 'materials',
          label: 'Materials',
          options: genericFilterOptions('eu_bbmri_eric_material_types'),
          initiallyCollapsed: !this.$store.state.route.query.materials,
          filters: this.$store.state.materials.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'country',
          label: 'Countries',
          options: genericFilterOptions('eu_bbmri_eric_countries'),
          initiallyCollapsed: !this.$store.state.route.query.country,
          filters: this.$store.state.country.filters
        },
        {
          component: 'CheckboxFilter',
          name: 'biobank_quality',
          label: 'Biobank quality marks',
          options: genericFilterOptions('eu_bbmri_eric_assess_level_bio'),
          initiallyCollapsed: !this.$store.state.route.query.biobank_quality,
          filters: this.$store.state.biobank_quality.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'collection_quality',
          label: 'Collection quality marks',
          options: genericFilterOptions('eu_bbmri_eric_assess_level_col'),
          initiallyCollapsed: !this.$store.state.route.query.collection_quality,
          filters: this.$store.state.collection_quality.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'type',
          label: 'Collection types',
          options: genericFilterOptions('eu_bbmri_eric_collection_types'),
          initiallyCollapsed: !this.$store.state.route.query.type,
          filters: this.$store.state.type.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'biobank_network',
          label: 'Biobank network',
          options: genericFilterOptions('eu_bbmri_eric_networks'),
          initiallyCollapsed: !this.$store.state.route.query.biobank_network,
          filters: this.$store.state.biobank_network.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'collection_network',
          label: 'Collection network',
          options: genericFilterOptions('eu_bbmri_eric_networks'),
          initiallyCollapsed: !this.$store.state.route.query.collection_network,
          filters: this.$store.state.collection_network.filters,
          maxVisibleOptions: 25
        },
        {
          component: 'CheckboxFilter',
          name: 'dataType',
          label: 'Data types',
          options: genericFilterOptions('eu_bbmri_eric_data_types'),
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
    genericFilterOptions,
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
    this.$store.dispatch('GetCovid19Options')
  }
}
</script>
