<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row mb-3">
          <collection-select-all
          v-if="!loading && foundCollectionIds.length"
          class="mt-1 ml-3"
          router-enabled
          />
        <div class="col-md-8">
          <div v-if="isIE11">
            <input
              class="w-50 mr-2 p-1"
              type="text"
              v-model="ie11BookmarkToApply"
              placeholder="Place your recieved bookmark here"
            /><input
              type="button"
              class="btn btn-sm btn-secondary"
              @click="applyIE11Bookmark"
              value="Apply"
              :disabled="!ie11BookmarkToApply"
            />
            <div class="mt-1">
              <input
                class="w-50 d-inline p-1"
                id="ie11bookmark"
                :value="ie11Bookmark"
                placeholder="Your current bookmark"
              />
              <button
                class="btn btn-sm btn-success ml-2 d-inline"
                @click="copyIE11Bookmark"
                :disabled="!ie11Bookmark"
              >
                Copy<span class="fa fa-copy ml-1"></span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="col-md-4">
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
      v-if="!loading && hasSelection && !collectionCartShown && this.foundCollectionIds.length"
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
        <div :key="`${cart.biobankLabel}-${index}`" v-for="(cart, index) in collectionCart">
          <hr v-if="index > 0">
          <h4 class="my-3 ml-2">{{ cart.biobankLabel }}</h4>
          <div
            class="row ml-3 my-2"
            :key="`${collection.label}-${index}`"
            v-for="(collection, index) in cart.collections"
          >
            <div class="col-md-11 p-0 my-1">
              <font-awesome-icon
                title="Not available for commercial use"
                v-if="isNonCommercialCollection(collection.value)"
                class="text-danger non-commercial mr-1"
                :icon="['fab', 'creative-commons-nc-eu']"
              />
              <span> {{ collection.label }}</span>
            </div>
            <div class="col-md-1">
              <span
                class="fa fa-times text-bold remove-collection"
                title="Remove collection"
                @click="RemoveCollectionFromSelection({ collection, router: $router })"
              ></span>
            </div>
          </div>
        </div>
      </template>
      <p v-if="isPodium && !collectionsInPodium.length">
        Sorry, none of the samples are currently in Podium.
      </p>
      <template v-slot:modal-footer>
        <div class="mr-auto">
          <span class="text-white font-weight-bold d-block">{{ modalFooterText }}</span>
          <span class="text-white" v-if="selectedNonCommercialCollections > 0"
            >
            <font-awesome-icon
                title="Not available for commercial use"
                class="text-white non-commercial mr-1"
                :icon="['fab', 'creative-commons-nc-eu']"
              />
              {{ selectedNonCommercialCollections }} are non-commercial only
            </span>
        </div>
        <b-button class="btn btn-dark" @click="hideModal">Cancel</b-button>
        <b-button
          :disabled="(isPodium && !collectionsInPodium.length) || !selectedCollections.length"
          class="btn btn-secondary"
          @click="sendRequest"
          >{{ negotiatorButtonText }}</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import { CartSelectionToast } from '@molgenis-ui/components-library'
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import FilterContainer from './filters/FilterContainer'
import ResultHeader from './ResultHeader'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { createBookmark } from '../utils/bookmarkMapper'
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll.vue'

export default {
  name: 'biobank-explorer-container',
  components: {
    BiobankCardsContainer,
    FilterContainer,
    ResultHeader,
    CartSelectionToast,
    CollectionSelectAll
  },
  data: () => {
    return {
      modalEnabled: false,
      ie11BookmarkToApply: ''
    }
  },
  computed: {
    ...mapGetters([
      'rsql',
      'biobankRsql',
      'loading',
      'foundCollectionIds',
      'activeFilters',
      'collectionsInPodium',
      'selectedBiobankQuality',
      'selectedCollectionQuality',
      'selectedCollections',
      'collectionBiobankDictionary',
      'foundCollectionsAsSelection',
      'selectedNonCommercialCollections'
    ]),
    ...mapState(['isPodium', 'nonCommercialCollections', 'isIE11', 'ie11Bookmark']),
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
    ...mapMutations([
      'RemoveCollectionFromSelection',
      'MapQueryToState'
    ]),
    ...mapActions([
      'GetCollectionInfo',
      'GetBiobankIds',
      'GetPodiumCollections',
      'GetBiobankIdsForQuality',
      'GetCollectionIdsForQuality'
    ]),
    isNonCommercialCollection (collectionId) {
      return this.nonCommercialCollections.indexOf(collectionId) >= 0
    },
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
    applyIE11Bookmark () {
      const rawQuery = this.ie11BookmarkToApply.split('?')[1]
      const queryParts = rawQuery.split('&')
      const queryObject = {}

      queryParts.forEach(part => {
        const propAndValue = part.split('=')
        queryObject[propAndValue[0]] = propAndValue[1]
      })
      this.MapQueryToState(queryObject)
      this.applyIE11Bookmark = ''
    },
    copyIE11Bookmark () {
      const ie11BookmarkElement = document.getElementById('ie11bookmark')
      ie11BookmarkElement.select()
      ie11BookmarkElement.setSelectionRange(0, 99999)
      document.execCommand('copy')
    }
  },
  mounted () {
    // check if collections have been added off-screen.
    if (this.selectedCollections.length) {
      createBookmark(this.$router, this.activeFilters, this.selectedCollections)
    }
  }
}
</script>

<style>
.non-commercial .fa-times {
  font-size: 1em;
}
.biobank-explorer-container {
  padding-top: 1rem;
}
.remove-collection:hover,
.btn:hover,
#select-all-label:hover {
  cursor: pointer;
}
</style>
