<template>
  <div class="biobank-cards-container">
    <div v-if="!loading && foundBiobanks > 0">
      <b-pagination
        v-if="foundBiobanks > pageSize"
        size="md"
        align="center"
        :total-rows="foundBiobanks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination>
      <biobank-card
        v-for="(biobank, index) in currentBiobanks"
        :key="biobank.id + index"
        :biobank="biobank"
        :initCollapsed="!isAnyFilterActive"
      ></biobank-card>

      <b-pagination
        v-if="foundBiobanks > pageSize"
        size="md"
        align="center"
        :total-rows="foundBiobanks"
        v-model="currentPage"
        :per-page="pageSize"
      ></b-pagination>
    </div>

    <div v-else-if="!loading && foundBiobanks === 0" class="status-text">
      <h4>No biobanks were found</h4>
    </div>

    <div v-else class="status-text">
      <h4>
        Loading Biobanks...
        <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
      </h4>
    </div>
  </div>
</template>

<style>
.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}

.biobank-cards-container {
  width: 100%;
}
</style>

<script>
import BiobankCard from './BiobankCard'
import { mapGetters, mapActions } from 'vuex'
import { GET_NEXT_BIOBANKS, GET_ALL_BIOBANKS } from '../../store/actions'

export default {
  name: 'biobank-cards-container',
  data () {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    ...mapActions({
      nextPage: GET_NEXT_BIOBANKS,
      getAllBiobanks: GET_ALL_BIOBANKS
    })
  },
  computed: {
    ...mapGetters(['biobanks', 'foundBiobanks', 'loading', 'getActiveFilters']),
    isAnyFilterActive () {
      return Object.keys(this.getActiveFilters).length > 0
    },
    currentBiobanks () {
      return this.biobanks.slice(
        this.pageSize * (this.currentPage - 1),
        this.pageSize * this.currentPage
      )
    }
  },
  components: {
    BiobankCard
  },
  watch: {
    currentPage (newVal, oldVal) {
      const newPage = parseInt(newVal)
      const prevPage = parseInt(oldVal)

      // if (!this.newResult) { // TODO: check when someone searches
      if (newPage > prevPage) {
        // user navigated a page within range
        if (newPage - 1 === prevPage || newPage - prevPage < 4) this.nextPage()
        // user navigated to the end (will not work on biobanks > 10k)
        else this.getAllBiobanks()
      }
    }
  }
}
</script>
