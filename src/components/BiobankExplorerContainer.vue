<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12" v-if="!loading">
          <result-header></result-header>
          <negotiator :disabled="true"></negotiator>
          <b-alert
            id="negotiator-disabled"
            show
            variant="danger"
          >The negotiator link is currently in maintenance</b-alert>
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

#negotiator-disabled {
  display: inline;
  float:right;
}
</style>

<script>
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import FilterContainer from './filters/FilterContainer'
import ResultHeader from './ResultHeader'
import Negotiator from './negotiator/Negotiator'
import { mapGetters, mapActions } from 'vuex'

import {
  GET_INITIAL_BIOBANKS,
  FIND_BIOBANKS,
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
    ...mapGetters(['rsql', 'loading', 'biobanks'])
  },
  watch: {
    rsql () {
      this.findBiobanks()
    }
  },
  methods: {
    ...mapActions({
      loadFirstPage: GET_INITIAL_BIOBANKS,
      findBiobanks: FIND_BIOBANKS,
      getQuery: GET_QUERY
    })
  },
  mounted () {
    this.getQuery()
    this.loadFirstPage()
  }
}
</script>
