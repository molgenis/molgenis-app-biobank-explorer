<template>
  <div class="row">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12">
          <negotiator></negotiator>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <search-box></search-box>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <biobank-cards-container></biobank-cards-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BiobankCardsContainer from './cards/BiobankCardsContainer'
  import FilterContainer from './filters/FilterContainer'
  import Negotiator from './negotiator/Negotiator'
  import SearchBox from './SearchBox'

  import { GET_BIOBANKS_AND_COLLECTIONS, GET_DIAGNOSIS_AVAILABLE, GET_BIOBANK_IDENTIFIERS } from '../store/actions'
  import { MAP_QUERY_TO_STATE } from '../store/mutations'
  import { mapGetters } from 'vuex'

  export default {
    name: 'biobank-explorer-container',
    computed: {
      ...mapGetters({
        query: 'getRouteQueryParams'
      })
    },
    components: {
      BiobankCardsContainer,
      FilterContainer,
      Negotiator,
      SearchBox
    },
    watch: {
      query (query) {
        this.$router.push({query: query})
      },
      '$route' (to, from) {
        // React to route changes by calling the
        const queryParams = to.query
        if (Object.keys(queryParams).length > 0) {
          this.$store.dispatch(GET_BIOBANK_IDENTIFIERS)
        } else {
          this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
        }
      }
    },
    beforeCreate () {
      const queryParams = this.$store.state.route.query
      if (Object.keys(queryParams).length > 0) {
        if (queryParams.diagnosis_available) {
          this.$store.dispatch(GET_DIAGNOSIS_AVAILABLE, queryParams.diagnosis_available)
        }
        this.$store.commit(MAP_QUERY_TO_STATE, queryParams)
        this.$store.dispatch(GET_BIOBANK_IDENTIFIERS)
      } else {
        this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
      }
    }
  }
</script>
