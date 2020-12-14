<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row mb-3">
        <div class="col-md-8"></div>
        <div
          class="col-md-4 text-right"
          v-if="
            !loading && foundCollectionIds.length && (rsql.length || biobankRsql.length)
          "
        >
          <label id="select-all-label" for="select-all-collections">
            <u> {{ collectionSelectionLabel }} </u>
          </label>
          <b-form-checkbox
            class="d-inline ml-4"
            id="select-all-collections"
            v-model="selectAllCollections"
            @input="handleCollectionStatus"
            name="check-button"
            size="lg"
            switch
          >
          </b-form-checkbox>
        </div>
      </div>
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
      v-if="
        !loading && hasSelection && !collectionCartShown && this.foundCollectionIds.length
      "
      :cartSelectionText="`${this.selectedCollections.length} collection(s) selected`"
      :clickHandler="showSelection"
      :title="negotiatorButtonText"
      toastClass="bg-warning text-white"
    >
      <template v-slot:buttonText> Show selection </template>
    </cart-selection-toast>

    <b-modal
      hide-header
      id="collectioncart-modal"
      scrollable
      centered
      footer-bg-variant="warning"
      body-class="pb-0"
      @hide="closeModal"
    >
      <template v-if="collectionCart.length > 0">
        <div
          :key="`${cart.biobankLabel}-${index}`"
          v-for="(cart, index) in collectionCart"
        >
          <h4 class="mt-2 ml-2">{{ cart.biobankLabel }}</h4>
          <div
            class="row ml-3 my-2"
            :key="`${collection.label}-${index}`"
            v-for="(collection, index) in cart.collections"
          >
            <div class="col-md-11 p-0">
              <span> {{ collection.label }}</span>
            </div>
            <div class="col-md-1">
              <span
                class="fa fa-times text-danger remove-collection"
                title="Remove collection"
                @click="RemoveCollectionFromSelection(collection)"
              ></span>
            </div>
          </div>
        </div>
      </template>
      <p v-if="isPodium && !collectionsInPodium.length">
        Sorry, none of the samples are currently in Podium.
      </p>
      <template v-slot:modal-footer>
        <span class="text-white font-weight-bold mr-auto">{{ modalFooterText }}</span>
        <b-button class="btn btn-dark" @click="hideModal">Cancel</b-button>
        <b-button
          :disabled="isPodium && !collectionsInPodium.length"
          class="btn btn-secondary"
          @click="sendRequest"
          >{{ negotiatorButtonText }}</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<style>
.biobank-explorer-container {
  padding-top: 1rem;
}
#select-all-label {
  line-height: 2;
}

#select-all-label:hover {
  cursor: pointer;
}

.remove-collection:hover {
  cursor: pointer;
}
</style>
<script>
import { CartSelectionToast } from '@molgenis-ui/components-library'
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import FilterContainer from './filters/FilterContainer'
import ResultHeader from './ResultHeader'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { createBookmark } from '../utils/bookmarkMapper'

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
      initialize: true,
      selectAllCollections: false,
      modalEnabled: false
    }
  },
  computed: {
    ...mapGetters([
      'rsql',
      'biobankRsql',
      'loading',
      'activeFilters',
      'foundCollectionIds',
      'collectionsInPodium',
      'selectedBiobankQuality',
      'selectedCollectionQuality',
      'selectedCollections',
      'collectionBiobankDictionary',
      'foundCollectionsAsSelection'
    ]),
    ...mapState(['isPodium']),
    modalFooterText () {
      const collectionCount = this.isPodium
        ? this.collectionsInPodium.length
        : this.selectedCollections.length
      return this.isPodium
        ? `${collectionCount} collection(s) present in Podium`
        : `${collectionCount} collection(s) selected`
    },
    negotiatorButtonText () {
      return this.isPodium ? 'Send to Podium' : 'Send to the negotiator'
    },
    collectionCartShown () {
      return this.modalEnabled
    },
    collectionCart () {
      const collections = this.isPodium
        ? this.collectionsInPodium
        : this.selectedCollections
      return this.groupCollectionsByBiobank(collections)
    },
    hasSelection () {
      return this.selectedCollections.length > 0
    },
    collectionSelectionLabel () {
      return this.selectAllCollections
        ? 'Deselect all collections'
        : 'Select all collections'
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
    },
    selectedCollections (newValue) {
      this.selectAllCollections = this.selectedCollections.length && this.selectedCollections.filter(f => !this.foundCollectionIds.includes(f.value)).length === 0
      createBookmark(this.$router, this.activeFilters, newValue)
    }
  },
  methods: {
    ...mapMutations(['AddCollectionToSelection', 'RemoveCollectionFromSelection']),
    ...mapActions([
      'GetCollectionInfo',
      'GetBiobankIds',
      'GetPodiumCollections',
      'GetBiobankIdsForQuality',
      'GetCollectionIdsForQuality'
    ]),
    groupCollectionsByBiobank (collectionSelectionArray) {
      const biobankWithSelectedCollections = []
      collectionSelectionArray.forEach(cs => {
        const biobankLabel = this.collectionBiobankDictionary[cs.value]
        const biobankPresent = biobankWithSelectedCollections.find(
          bsc => bsc.biobankLabel === biobankLabel
        )

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
      this.$bvModal.show('collectioncart-modal')
      this.modalEnabled = true
    },
    collectionSelected (collectionId) {
      return this.selectedCollections.map(sc => sc.value).indexOf(collectionId) >= 0
    },
    handleCollectionStatus () {
      if (this.selectAllCollections) {
        this.AddCollectionToSelection(this.foundCollectionsAsSelection)
      } else {
        this.RemoveCollectionFromSelection(this.foundCollectionsAsSelection)
      }
    }
  }
}
</script>
