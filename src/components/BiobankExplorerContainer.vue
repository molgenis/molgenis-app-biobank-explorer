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
      v-if="!loading && hasSelection && !podiumModalShown && this.foundCollectionIds.length"
      :cartSelectionText="`${this.foundCollectionIds.length} collection(s) selected`"
      :clickHandler="sendToNegotiator"
      :title="requestButtonTitle"
      toastClass="bg-warning text-white"
    >
      <template v-slot:buttonText>
        REQUEST SAMPLES
        <i class="fa fa-spin fa-spinner" aria-hidden="true" v-if="request"></i>
      </template>
    </cart-selection-toast>

    <b-modal hide-header id="podium-modal" scrollable centered footer-bg-variant="warning" body-class="pb-0" @hide="done">
      <ul v-if="hasPodiumCollections">
        <li :key="cip" v-for="cip in collectionsInPodium">
          {{ cip }}
        </li>
      </ul>
      <p v-if="!hasPodiumCollections">Sorry, none of the samples are currently in Podium.</p>
      <template v-slot:modal-footer>
        <span class="text-white font-weight-bold mr-auto">{{ `${collectionsInPodium.length} collection(s) present in Podium` }}</span>
        <b-button class="btn btn-dark" @click="hideModal">Cancel</b-button>
        <b-button :disabled="!hasPodiumCollections" class="btn btn-secondary" @click="sendRequest">{{ requestButtonTitle }}</b-button>
      </template>
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
      request: false,
      requestButtonTitle: 'Send to the negotiator'
    }
  },
  computed: {
    ...mapGetters(['rsql', 'biobankRsql', 'loading', 'foundCollectionIds', 'collectionsInPodium', 'selectedBiobankQuality', 'selectedCollectionQuality']),
    ...mapState(['isPodium']),
    podiumModalShown () {
      if (this.isPodium) return this.request

      return false
    },
    hasPodiumCollections () {
      return this.collectionsInPodium ? this.collectionsInPodium.length > 0 : false
    },
    hasSelection () {
      if ((this.rsql && this.rsql !== '') || (this.biobankRsql && this.biobankRsql !== '')) return true

      return false
    }
  },
  watch: {
    selectedBiobankQuality: {
      immediate: true,
      handler: 'GetBiobankIdsForQuality'
    },
    selectedCollectionQuality: {
      immediate: true,
      handler: 'GetCollectionIdsForQuality'
    },
    rsql: {
      immediate: true,
      handler: 'GetCollectionInfo'
    },
    biobankRsql: {
      immediate: true,
      handler: 'GetBiobankIds'
    },
    isPodium: {
      immediate: true,
      handler: 'GetPodiumCollections'
    }
  },
  methods: {
    ...mapActions([
      'GetCollectionInfo',
      'GetBiobankIds',
      'GetPodiumCollections',
      'GetBiobankIdsForQuality',
      'GetCollectionIdsForQuality'
    ]),
    hideModal () {
      this.$bvModal.hide('podium-modal')
    },
    done () {
      this.request = false
    },
    sendRequest () {
      this.$bvModal.hide('podium-modal')
      this.$store.dispatch('SendToNegotiator').finally(this.done)
    },
    sendToNegotiator () {
      this.request = true
      if (this.isPodium) {
        this.$bvModal.show('podium-modal')
      } else {
        this.$bvModal.hide('podium-modal')
        this.sendRequest()
      }
    }
  }
}
</script>
