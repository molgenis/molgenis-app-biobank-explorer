<template>
  <div class="row biobank-explorer-container">
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

<style>
  .biobank-explorer-container {
    padding-top: 1rem;
  }
</style>

<script>
  import BiobankCardsContainer from './cards/BiobankCardsContainer'
  import FilterContainer from './filters/FilterContainer'
  import Negotiator from './negotiator/Negotiator'
  import SearchBox from './SearchBox'

  import { GET_BIOBANK_IDENTIFIERS, MAP_QUERY_TO_STATE } from '../store/actions'
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
        this.$store.dispatch(GET_BIOBANK_IDENTIFIERS)
      }
    },
    mounted () {
      this.$store.dispatch(MAP_QUERY_TO_STATE)
    }
  }
</script>
