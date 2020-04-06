<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12" v-if="!loading">
          <result-header></result-header>
          <negotiator :disabled="!(rsql.length + biobankRsql.length) || !foundBiobanks"></negotiator>
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
import Negotiator from './negotiator/Negotiator'
import { mapGetters, mapActions } from 'vuex'
import {
  GET_COLLECTION_IDS,
  GET_BIOBANK_IDS,
  GET_QUERY
} from '../store/actions'

export default {
  name: 'biobank-explorer-container',
  components: {
    BiobankCardsContainer,
    FilterContainer,
    ResultHeader,
    Negotiator
  },
  computed: {
    ...mapGetters(['rsql', 'biobankRsql', 'loading', 'foundBiobanks'])
  },
  watch: {
    rsql: {
      immediate: true,
      handler: 'getCollectionIds'
    },
    biobankRsql: {
      immediate: true,
      handler: 'getBiobankIds'
    }
  },
  methods: {
    ...mapActions({
      getCollectionIds: GET_COLLECTION_IDS,
      getBiobankIds: GET_BIOBANK_IDS,
      getQuery: GET_QUERY
    })
  },
  mounted () {
    this.getQuery()
  }
}
</script>
