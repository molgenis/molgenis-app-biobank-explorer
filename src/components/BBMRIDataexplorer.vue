<template>
  <div class="row">
    <div class="col-md-3" id="filters">
      <filters></filters>
    </div>
    <div class="col-md-9">
      <div class="row">
        <div class="col-md" id="plots">
          <!--[Statistics Placeholder]-->
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" id="search">
          <search-box></search-box>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12" id="results">
          <biobanks></biobanks>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Filters from './Filters'
  import Biobanks from './Biobanks'
  import SearchBox from './SearchBox'
  import { MAP_QUERY_TO_STATE } from '../store/mutations'
  import {
    GET_COUNTRIES,
    GET_MATERIAL_TYPES,
    GET_QUALITY,
    GET_BIOBANKS_AND_COLLECTIONS
  } from '../store/actions'

  import { mapGetters } from 'vuex'

  export default {
    name: 'bbmri-dataexplorer',
    computed: {
      ...mapGetters({query: 'getCompleteQuery'})
    },
    created: function () {
      const state = this.$store.state

      if (state.biobanks === null) this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
      if (state.filters.countries.options.length === 0) this.$store.dispatch(GET_COUNTRIES)
      if (state.filters.material_types.options.length === 0) this.$store.dispatch(GET_MATERIAL_TYPES)
      if (state.filters.quality.options.length === 0) this.$store.dispatch(GET_QUALITY)

      if (state.route.query) {
        this.$store.commit(MAP_QUERY_TO_STATE, state.route.query)
        this.$router.push({query: state.route.query})
      }
    },
    watch: {
      query (query) {
        this.$router.push({query: query})
      }
    },
    components: {
      Filters,
      Biobanks,
      SearchBox
    }
  }
</script>
