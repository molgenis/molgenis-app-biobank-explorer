<template>
  <div class="border-bottom p-3">
    <div v-if="!loading && foundBiobanks > 0">
      <div class="d-flex mb-4 justify-content-between">
        <result-header v-if="!loading" class="w-25" />

        <pagination class="align-self-center" />
        <!-- Alignment block -->
        <div class="w-25"></div>
      </div>

      <div
        class="d-flex justify-content-center flex-wrap biobank-cards-container">
        <biobank-card
          v-for="biobank in biobanksShown"
          :key="biobank.id || biobank"
          :biobank="biobank"
          :fullSize="biobanksShown.length === 1">
        </biobank-card>
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
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'biobank-cards-container',
  components: {
    BiobankCard,
    Pagination,
    ResultHeader
  },
  methods: {
    ...mapActions(['GetBiobanks', 'QueryBiobanks'])
  },
  computed: {
    ...mapState(['pageSize', 'currentPage']),
    ...mapGetters([
      'biobanks',
      'foundBiobanks',
      'loading',
      'biobankRsql',
      'rsql'
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
