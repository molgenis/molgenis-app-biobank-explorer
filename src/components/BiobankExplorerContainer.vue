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

  import { GET_BIOBANKS_AND_COLLECTIONS } from '../store/actions'

  export default {
    name: 'biobank-explorer-container',
    components: {
      BiobankCardsContainer,
      FilterContainer,
      Negotiator,
      SearchBox
    },
    beforeCreate () {
      this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
    }
  }
</script>
