<template>
  <div class="border-bottom p-3">
    <!-- set the view to Biobank card view if not initialized -->
    <div v-if="!savedBiobanksCollectionsView">
      {{ this.savedBiobanksCollectionsView = 'biobank-cards' }}
    </div>
    <div v-if="!loading && foundBiobanks > 0">
      <!-- Buttons to switch the Biobank card view and the collection list view -->
      <div class="text-end my-2">
        <!-- Button to switch to Biobank card view, active by default -->
        <button
          type="button"
          class="btn mb-1 mr-2 btn-outline-secondary"
          :class="savedBiobanksCollectionsView === 'biobank-cards' ? 'btn-outline-warning':'bg-body'"
          @click="savedBiobanksCollectionsView = 'biobank-cards', setSavedBiobanksCollectionsView({biobankscollectionsView:'biobank-cards'})">
          <!-- Icon from https://icons.getbootstrap.com/icons/table/ -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
          </svg>
          Card View
        </button>
        <!-- Button to switch to list view of collections -->
        <button
              type="button"
              class="btn mb-1 mr-2 btn-outline-secondary"
              :class="savedBiobanksCollectionsView === 'collection-table' ? 'btn-outline-warning':'bg-body'"
              @click="savedBiobanksCollectionsView = 'collection-table', setSavedBiobanksCollectionsView({biobankscollectionsView:'collection-table'})">
              <!-- Icon from https://icons.getbootstrap.com/icons/card-list/ -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
              </svg>
              Table View
        </button>
      </div>
      <div class="d-flex mb-4 justify-content-between">
        <result-header v-if="!loading" class="w-25" />

        <pagination class="align-self-center" />
        <!-- Alignment block -->
        <div class="w-25"></div>
      </div>

      <div>
        <!-- Show the Biobank cards view if selected -->
        <div v-if="savedBiobanksCollectionsView === 'biobank-cards'" class="d-flex justify-content-center flex-wrap biobank-cards-container">
          <biobank-card
            v-for="biobank in biobanksShown"
            :key="biobank.id || biobank"
            :biobank="biobank"
            :fullSize="biobanksShown.length === 1">
          </biobank-card>
        </div>

        <!-- Show the Biobank cards view if selected -->
        <!-- Pivot the view of biobank cards to a table of collections: -->
        <div v-if="savedBiobanksCollectionsView === 'collection-table'" class="d-flex justify-content-center flex-wrap biobank-cards-container">
          <!-- information on custom rendering:
            https://bootstrap-vue.org/docs/components/table#custom-data-rendering -->

          <b-table small :fields="collectiontablefields" :items="createCollectionTable" :key="biobanksShown" responsive="sm">
            <template v-slot:cell(selected)="data">
              <!-- TODO: center checkbox -->
              <b-form-group>
                <collection-selector
                        class="ml-auto"
                        :collectionData=data.item.collection
                        iconOnly
                        bookmark>
                </collection-selector>
              </b-form-group>
            </template>

            <!-- Link to the collection detail card -->
            <template #cell(collectionname)="data">
                <router-link :to="'/collection/' + data.item.collectionid">{{ data.item.collectionname }}</router-link>
            </template>

            <!-- Link to the biobank report card -->
            <template #cell(biobankname)="data">
              <b class="text-info">
                <router-link :to="'/biobank/' + data.item.biobankid">{{ data.item.biobankname }}</router-link>
              </b>
            </template>

          </b-table>
        </div>
      </div>
      <pagination class="mt-4" />
    </div>
    <div v-else-if="!loading && foundBiobanks === 0" class="status-text">
      <h4>No biobanks were found</h4>
    </div>

    <div v-else class="status-text">
      <h4>
        Loading data...
        <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
      </h4>
    </div>
  </div>
</template>

<script>
import BiobankCard from './cards/BiobankCard.vue'
import Pagination from './buttons/Pagination.vue'
import ResultHeader from './ResultHeader.vue'
// Pivot the view of biobank cards:
// Add the selector for collections to be added to negotiation to the collection table:
import CollectionSelector from './buttons/CollectionSelector.vue'

import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'biobank-cards-container',
  components: {
    BiobankCard,
    Pagination,
    ResultHeader,
    CollectionSelector
  },
  data () {
    return {
      // Pivot the view of biobank cards to a table of collection:
      // create a the fields to be displayed in the colleciton table
      collectiontablefields: [
        { key: 'selected', label: 'Request', sortable: false },
        { key: 'biobankname', label: 'Biobank', sortable: false },
        { key: 'collectionname', label: 'Collection', sortable: false },
        { key: 'description', label: 'Description', sortable: false }
      ],
      savedBiobanksCollectionsView: this.getSavedBiobanksCollectionsView
    }
  },
  beforeMount () {
    // Initialize the Biobank Card view as default if nothing else stored previously
    if (this.savedBiobanksCollectionsView === undefined) {
      this.setSavedBiobanksCollectionsView({ biobanksCollectionsView: 'biobank-cards' })
    }
    if (this.savedBiobanksCollectionsView === '') {
      this.setSavedBiobanksCollectionsView({ biobanksCollectionsView: 'biobank-cards' })
    }
  },
  methods: {
    ...mapActions(['GetBiobanks', 'QueryBiobanks', 'setSavedBiobanksCollectionsView']),
    // Pivot the view of biobank cards to a table of collections:
    // create a table of collections to be used in the display of collections
    createCollectionTable () {
      const collectionReturn = []
      for (let k = 0; k < this.biobanksShown.length; k++) {
        for (let i = 0; i < this.biobanksShown[k].collections.length; i++) {
          var retVal = {
            biobankname: this.biobanksShown[k].name,
            biobankid: this.biobanksShown[k].id,
            collection: this.biobanksShown[k].collections[i],
            collectionname: this.biobanksShown[k].collections[i].name,
            description: this.biobanksShown[k].collections[i].description,
            collectionid: this.biobanksShown[k].collections[i].id
          }
          collectionReturn.push(retVal)
        }
      }
      return collectionReturn
    }
  },
  computed: {
    ...mapState(['pageSize', 'currentPage']),
    ...mapGetters([
      'biobanks',
      'foundBiobanks',
      'loading',
      'biobankRsql',
      'rsql',
      'getSavedBiobanksCollectionsView'
    ]),
    biobanksShown () {
      if (this.loading) return []

      if (this.biobankRsql || this.rsql) {
        return this.biobanks.slice(
          this.pageSize * (this.currentPage - 1),
          this.pageSize * this.currentPage
        )
      } else {
        return this.biobanks
      }
    },
    biobankIdsToFetch () {
      return this.biobanksShown.filter(it => typeof it === 'string')
    }
  },
  watch: {
    currentPage () {
      if (!this.biobankRsql && !this.rsql) {
        this.QueryBiobanks()
      }
    },
    biobankIdsToFetch (value) {
      if (value.length) {
        this.GetBiobanks(value)
      }
    }
  }
}
</script>

<style>
.biobank-cards-container {
  gap: 2rem;
}

.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}
</style>
