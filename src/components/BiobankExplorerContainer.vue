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
      v-if="!loading && hasSelection && !collectionCartShown && this.foundCollectionIds.length"
      :cartSelectionText="`${this.selectedCollections.length} collection(s) selected`"
      :clickHandler="showSelection"
      :title="negotiatorButtonText"
      toastClass="bg-warning text-white"
    >
      <template v-slot:buttonText> Show selection </template>
    </cart-selection-toast>

    <b-modal hide-header id="collectioncart-modal" scrollable centered footer-bg-variant="warning" body-class="pb-0" @hide="closeModal">
      <template v-if="collectionCart.length > 0">
        <div :key="cart.biobankLabel" v-for="cart in collectionCart">
          <h4 >{{ cart.biobankLabel }}</h4>
          <ul>
            <li :key="collection.label" v-for="collection in cart.collections">
              {{ collection.label }}
            </li>
          </ul>
        </div>
      </template>
      <p v-if="isPodium && !hasPodiumCollections">Sorry, none of the samples are currently in Podium.</p>
      <template v-slot:modal-footer>
        <span class="text-white font-weight-bold mr-auto">{{ modalFooterText }}</span>
        <b-button class="btn btn-dark" @click="hideModal">Cancel</b-button>
        <b-button :disabled="isPodium && !hasPodiumCollections" class="btn btn-secondary" @click="sendRequest">{{
          negotiatorButtonText
        }}</b-button>
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
      modalEnabled: false
    }
  },
  computed: {
    ...mapGetters([
      'rsql',
      'biobankRsql',
      'loading',
      'foundCollectionIds',
      'collectionsInPodium',
      'selectedBiobankQuality',
      'selectedCollectionQuality',
      'selectedCollections',
      'collectionBiobankDictionary'
    ]),
    ...mapState(['isPodium']),
    modalFooterText () {
      const collectionCount = this.isPodium ? this.collectionsInPodium.length : this.selectedCollections.length
      return this.isPodium ? `${collectionCount} collection(s) present in Podium` : `${collectionCount} collection(s) selected`
    },
    negotiatorButtonText () {
      return this.isPodium ? 'Send to Podium' : 'Send to the negotiator'
    },
    collectionCartShown () {
      return this.modalEnabled
    },
    collectionCart () {
      const collections = this.isPodium ? this.collectionsInPodium : this.selectedCollections
      return this.groupCollectionsByBiobank(collections)
    },
    hasSelection () {
      return this.selectedCollections.length > 0
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
    ...mapActions(['GetCollectionInfo', 'GetBiobankIds', 'GetPodiumCollections', 'GetBiobankIdsForQuality', 'GetCollectionIdsForQuality']),
    groupCollectionsByBiobank (collectionSelectionArray) {
      const biobankWithSelectedCollections = []
      collectionSelectionArray.forEach(cs => {
        const biobankLabel = this.collectionBiobankDictionary[cs.value]
        const biobankPresent = biobankWithSelectedCollections.find(bsc => bsc.biobankLabel === biobankLabel)

        if (biobankPresent) {
          biobankPresent.collections.push(cs)
        } else {
          biobankWithSelectedCollections.push({
            biobankLabel,
            collections: [cs]
          })
        }
      })
      return biobankWithSelectedCollections
    },
    hideModal () {
      this.$bvModal.hide('collectioncart-modal')
      this.closeModal()
    },
    closeModal () {
      this.modalEnabled = false
    },
    sendRequest () {
      this.$bvModal.hide('collectioncart-modal')
      this.$store.dispatch('SendToNegotiator').finally(this.closeModal)
    },
    showSelection () {
      this.modalEnabled = true
      this.$bvModal.show('collectioncart-modal')
    }
  }
}
</script>
