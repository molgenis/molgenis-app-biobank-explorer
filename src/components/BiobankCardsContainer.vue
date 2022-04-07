<template>
  <div class="biobank-cards-container border-bottom p-3">
    <div v-if="!loading && foundBiobanks > 0" class="d-flex justify-content-center flex-wrap">
      <biobank-card
        v-for="biobank in biobanksShown"
        :key="biobank.id || biobank"
        :biobank="biobank">
      </biobank-card>
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
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'biobank-cards-container',
  methods: {
    ...mapActions(['GetBiobanks', 'QueryBiobanks'])
  },
  computed: {
    ...mapState(['pageSize', 'currentPage']),
    ...mapGetters(['biobanks', 'foundBiobanks', 'loading', 'biobankRsql', 'rsql']),
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
    biobankIds () {
      return this.loading ? [] : this.biobanks.map(it => it.id || it)
    },
    biobankIdsToFetch () {
      return this.biobanksShown.filter(it => typeof it === 'string')
    }
  },
  components: {
    BiobankCard
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
.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}
</style>
