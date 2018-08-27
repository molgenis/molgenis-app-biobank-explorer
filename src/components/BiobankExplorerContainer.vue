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
  import { mapGetters, mapActions, mapMutations } from 'vuex'

  import {
    MAP_QUERY_TO_STATE
  } from '../store/actions'
  import { SET_ALL_BIOBANKS, SET_BIOBANK_IDS } from '../store/mutations'
  import {$rsql, $biobankIds, $allBiobanks} from '../client/reactive-biobank-client'

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
        $rsql.push(this.rsql)
      }
    },
    methods: {
      ...mapActions({
        mapQueryToState: MAP_QUERY_TO_STATE
      }),
      ...mapMutations({
        setAllBiobanks: SET_ALL_BIOBANKS,
        setBiobankIds: SET_BIOBANK_IDS
      })
    },
    mounted () {
      this.mapQueryToState()
      $biobankIds.onValue(this.setBiobankIds)
      $allBiobanks.onValue(this.setAllBiobanks)
      $rsql.push(this.rsql)
    }
  }
</script>
