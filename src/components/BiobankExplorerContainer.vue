<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12">
          <result-header></result-header>
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
  import ResultHeader from './ResultHeader'
  import { mapGetters, mapActions } from 'vuex'

  import { GET_ALL_BIOBANKS, GET_COLLECTION_IDENTIFIERS, GET_QUERY } from '../store/actions'

  export default {
    name: 'biobank-explorer-container',
    components: {
      BiobankCardsContainer,
      FilterContainer,
      ResultHeader
    },
    computed: {
      ...mapGetters(['rsql'])
    },
    watch: {
      rsql () {
        this.getBiobankIdentifiers()
      }
    },
    methods: {
      ...mapActions({
        getAllBiobanks: GET_ALL_BIOBANKS,
        getBiobankIdentifiers: GET_COLLECTION_IDENTIFIERS,
        getQuery: GET_QUERY
      })
    },
    mounted () {
      this.getQuery()
      this.getAllBiobanks()
    }
  }
</script>
