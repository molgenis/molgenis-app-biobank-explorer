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
        v-for="biobank in biobanksShown"
        :key="biobank.id || biobank"
        :biobank="biobank"
        :initCollapsed="!isAnyFilterActive">
      </biobank-card>

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
import { GET_BIOBANKS } from '@/store/actions'

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
      getBiobanks: GET_BIOBANKS
    })
  },
  computed: {
    ...mapGetters([
      'biobanks',
      'foundBiobanks',
      'loading',
      'getActiveFilters'
    ]),
    isAnyFilterActive () {
      return Object.keys(this.getActiveFilters).length > 0
    },
    biobanksShown () {
      return this.loading ? [] : this.biobanks.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage)
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
    biobankIds (newValue, oldValue) {
      if (newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])) {
        this.currentPage = 1
      }
    },
    biobankIdsToFetch (value) {
      if (value.length) {
        this.getBiobanks(value)
      }
    }
  }
}
</script>
