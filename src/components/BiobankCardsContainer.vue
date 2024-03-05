<template>
  <div class="border-bottom p-3">
    <!-- set the view to Biobank card view if not initialized -->
    <div v-if="!savedBiobanksCollectionsView">
      {{ this.savedBiobanksCollectionsView = 'biobank-cards' }}
    </div>
      <h2>Biobanks</h2>
    <div v-if="!loading && foundBiobanks > 0">
      <!-- Buttons to switch the Biobank card view and the collection list view -->
      <div class="text-end my-2">
        <!-- Button to switch to Biobank card view, active by default -->
        <button
          type="button"
          class="btn btn-outline-secondary"
          :class="savedBiobanksCollectionsView === 'biobank-cards' ? 'btn-light':'bg-body'"
          @click="savedBiobanksCollectionsView = 'biobank-cards', setSavedBiobanksCollectionsView({biobankscollectionsView:'biobank-cards'})">
          <i class="bi bi-list" />
        </button>
        <!-- Button to switch to list view of collections -->
        <button
              type="button"
              class="btn btn-outline-secondary"
              :class="savedBiobanksCollectionsView === 'collection-table' ? 'btn-light':'bg-body'"
              @click="savedBiobanksCollectionsView = 'collection-table', setSavedBiobanksCollectionsView({biobankscollectionsView:'collection-table'})">
              <i class="bi bi-grid" />
        </button>
      </div>
      <div class="d-flex mb-4 justify-content-between">
        <result-header v-if="!loading" class="w-25" />

        <pagination class="align-self-center" />
        <!-- Alignment block -->
        <div class="w-25"></div>
      </div>

      <div
        class="d-flex justify-content-center flex-wrap biobank-cards-container">
        <!-- Show the Biobank cards view if selected -->
        <div v-if="savedBiobanksCollectionsView === 'biobank-cards'">
          <biobank-card
            v-for="biobank in biobanksShown"
            :key="biobank.id || biobank"
            :biobank="biobank"
            :fullSize="biobanksShown.length === 1">
          </biobank-card>
        </div>
        <!-- Show the Biobank cards view if selected -->
        <!-- Pivot the view of biobank cards to a table of collections: -->
        <div v-if="savedBiobanksCollectionsView === 'collection-table'">
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
            <template #cell(name)="data">
              <b class="text-info">
                <router-link :to="'/collection/' + data.item.collectionid">{{ data.item.collectionname }}</router-link>
              </b>
            </template>

            <!-- Link to the biobank report card -->
            <template #cell(provider)="data">
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
  beforeMount () {
    // Initialize the Biobank Card view as default if nothing else stored previously
    if (this.savedBiobanksCollectionsView === undefined) {
      this.setSavedBiobanksCollectionsView({ biobanksCollectionsView: 'biobank-cards' })
    }
    if (this.savedBiobanksCollectionsView === '') {
      this.setSavedBiobanksCollectionsView({ biobanksCollectionsView: 'biobank-cards' })
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
