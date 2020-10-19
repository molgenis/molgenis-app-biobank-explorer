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
      v-if="((!loading && rsql) || biobankRsql) && !podiumModalShown"
      :cartSelectionText="`${foundCollectionIds.length} collection(s) selected`"
      :clickHandler="sendToNegotiator"
      title="Send to the negotiator"
      toastClass="bg-warning text-white"
    >
      <template v-slot:buttonText>
        REQUEST SAMPLES
        <i class="fa fa-spin fa-spinner" aria-hidden="true" v-if="request"></i>
      </template>
    </cart-selection-toast>

    <b-modal id="podium-modal" centered :title="`${collectionsInPodium.length} selection(s) present in Podium`" @ok="sendRequest" @close="request = false" @cancel="request = false">
      <div class="overflow-auto overflow-max-300">
        <ul>
          <li :key="cip" v-for="cip in collectionsInPodium">{{ cip }}</li>
        </ul>
      </div>
    </b-modal>
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
import { mapGetters, mapActions, mapState } from 'vuex'
import { GET_COLLECTION_INFO, GET_BIOBANK_IDS, SEND_TO_NEGOTIATOR, GET_PODIUM_COLLECTIONS } from '../store/actions'

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
    ...mapGetters(['rsql', 'biobankRsql', 'loading', 'foundBiobanks', 'foundCollectionIds', 'collectionsInPodium']),
    ...mapState(['isPodium']),
    podiumModalShown () {
      if (this.isPodium) return this.request
      else return false
    }
  },
  watch: {
    rsql: {
      immediate: true,
      handler: 'getCollectionInfo'
    },
    biobankRsql: {
      immediate: true,
      handler: 'getBiobankIds'
    },
    isPodium: {
      immediate: true,
      handler: 'getPodiumCollections'
    }
  },
  methods: {
    ...mapActions({
      getCollectionInfo: GET_COLLECTION_INFO,
      getBiobankIds: GET_BIOBANK_IDS,
      getPodiumCollections: GET_PODIUM_COLLECTIONS
    }),
    done () {
      this.request = false
    },
    sendRequest () {
      this.$store.dispatch(SEND_TO_NEGOTIATOR).finally(this.done)
    },
    sendToNegotiator () {
      this.request = true
      if (this.isPodium) {
        this.$bvModal.show('podium-modal')
      } else {
        this.sendRequest()
      }
    }
  }
}
</script>

<style scoped>
.overflow-max-300 {
  max-height: 300px;
}
</style>
