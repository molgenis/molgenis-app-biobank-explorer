<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12" v-if="!loading">
          <result-header></result-header>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <biobank-cards-container></biobank-cards-container>
        </div>
      </div>
    </div>
    <cart-selection-toast
      v-if="(rsql.length + biobankRsql.length) || !foundBiobanks"
      :cartSelectionText="`${foundCollections} collection(s) selected`"
      :clickHandler="sendToNegotiator"
      title="Send to the negotiator"
    >
      <template v-slot:buttonText>
        REQUEST SAMPLES
        <i class="fa fa-spin fa-spinner" aria-hidden="true" v-if="request"></i>
      </template>
    </cart-selection-toast>
  </div>
</template>

<style>
.biobank-explorer-container {
  padding-top: 1rem;
}
</style>

<script>
import { CartSelectionToast } from '@molgenis-ui/components-library'
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import FilterContainer from './filters/FilterContainer'
import ResultHeader from './ResultHeader'
import { mapGetters, mapActions } from 'vuex'
import {
  GET_COLLECTION_IDS,
  GET_BIOBANK_IDS,
  SEND_TO_NEGOTIATOR
} from '../store/actions'

export default {
  name: 'biobank-explorer-container',
  components: {
    BiobankCardsContainer,
    FilterContainer,
    ResultHeader,
    CartSelectionToast
  },
  data: () => {
    return {
      request: false
    }
  },
  computed: {
    ...mapGetters([
      'rsql',
      'biobankRsql',
      'loading',
      'foundBiobanks',
      'foundCollections'
    ])
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
      getBiobankIds: GET_BIOBANK_IDS
    }),
    done () {
      this.request = false
    },
    sendToNegotiator () {
      this.request = true
      this.$store.dispatch(SEND_TO_NEGOTIATOR).finally(this.done)
    }
  }
}
</script>
