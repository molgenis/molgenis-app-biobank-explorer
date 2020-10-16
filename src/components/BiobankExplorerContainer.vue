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
      v-if="(!loading && rsql || biobankRsql) && !podiumModalShown"
      :cartSelectionText="`${foundCollections} collection(s) selected`"
      :clickHandler="sendToNegotiator"
      title="Send to the negotiator"
      toastClass="bg-warning text-white"
    >
      <template v-slot:buttonText>
        REQUEST SAMPLES
        <i class="fa fa-spin fa-spinner" aria-hidden="true" v-if="request"></i>
      </template>
    </cart-selection-toast>

    <b-modal id="podium-modal" centered title="Podium" @ok="sendRequest" @cancel="request = false">
      <p class="my-4">Hello podium!</p>
      <p>Todo: podium tellingen vs niet podium tellingen?</p>
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
import {
  GET_COLLECTION_IDS,
  GET_BIOBANK_IDS,
  SEND_TO_NEGOTIATOR,
  GET_PODIUM_COLLECTIONS
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
    ]),
    ...mapState(['isPodium']),
    podiumModalShown () {
      if (this.isPodium) return this.request
      else return false
    }
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
        this.getPodiumCollections()
      } else {
        this.sendRequest()
      }
    }
  }
}
</script>
