<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-12">
      <div class="row mt-0">
        <div class="col-md-8">
          <div v-if="isIE11">
            <input
              class="w-50 mr-2 p-1"
              type="text"
              v-model="ie11BookmarkToApply"
              placeholder="Place your recieved bookmark here"/><input
              type="button"
              class="btn btn-sm btn-secondary"
              @click="applyIE11Bookmark"
              value="Apply"
              :disabled="!ie11BookmarkToApply"/>
            <div class="mt-1">
              <input
                class="w-50 d-inline p-1"
                id="ie11bookmark"
                :value="ie11Bookmark"
                placeholder="Your current bookmark"/>
              <button
                class="btn btn-sm btn-success ml-2 d-inline"
                @click="copyIE11Bookmark"
                :disabled="!ie11Bookmark">
                Copy<span class="fa fa-copy ml-1"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <application-header />
      </div>

      <div class="row">
        <div class="col-md-12 px-0 py-3 mb-3">
          <biobank-cards-container></biobank-cards-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import { createBookmark } from '../utils/bookmarkMapper'
import ApplicationHeader from './ApplicationHeader.vue'

export default {
  name: 'biobank-explorer-container',
  components: {
    BiobankCardsContainer,
    ApplicationHeader
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
      'activeFilters',
      'selectedBiobankQuality',
      'selectedCollectionQuality',
      'satisfyAllBiobankQuality',
      'satisfyAllCollectionQuality'
    ]),
    ...mapState([
      'isPodium',
      'isIE11',
      'ie11Bookmark'
    ])
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
    satisfyAllBiobankQuality: {
      immediate: true,
      handler: 'GetBiobankIdsForQuality'
    },
    satisfyAllCollectionQuality: {
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
    ...mapMutations(['MapQueryToState']),
    ...mapActions([
      'GetCollectionInfo',
      'GetBiobankIds',
      'GetPodiumCollections',
      'GetBiobankIdsForQuality',
      'GetCollectionIdsForQuality'
    ]),
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
    createBookmark(this.activeFilters, this.selectedCollections)
  }
}
</script>

<style>
.non-commercial .fa-times {
  font-size: 1em;
}

.remove-collection:hover,
.btn:hover,
#select-all-label:hover {
  cursor: pointer;
}

</style>
