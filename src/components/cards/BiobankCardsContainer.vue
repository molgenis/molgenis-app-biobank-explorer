<template>
  <div class="biobank-cards-container">
    <div aria-label="action-bar">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-3 pl-0">
            <collection-select-all
              v-if="!loading && foundCollectionIds.length"
              router-enabled
            />
          </div>
          <div class="col-md-5 pl-0">
            <search-filter />
          </div>
          <div class="col-md-4 pr-0">
            <b-pagination
              v-if="foundBiobanks > pageSize && !loading && foundBiobanks > 0"
              size="md"
              align="right"
              :total-rows="foundBiobanks"
              v-model="currentPage"
              :per-page="pageSize"
            ></b-pagination>
          </div>
        </div>
      </div>
    </div>

    <div class="biobank-cards border" v-if="!loading && foundBiobanks > 0">
      <biobank-card
        v-for="biobank in biobanksShown"
        :key="biobank.id || biobank"
        :biobank="biobank"
        :initCollapsed="
          biobanksShown[0].id !== biobank.id || biobanksShown[0] !== biobank
        "
      >
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

<style>
.status-text {
  text-align: center;
  justify-content: center;
  padding: 1rem;
}

.biobank-cards-container {
  width: 100%;
}

.biobank-cards {
  height: 60vh;
  overflow: auto;
}
</style>

<script>
import BiobankCard from './BiobankCard'
import { mapGetters, mapActions } from 'vuex'
import SearchFilter from '../filters/SearchFilter.vue'
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll.vue'

export default {
  name: 'biobank-cards-container',
  data () {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    ...mapActions(['GetBiobanks'])
  },
  computed: {
    ...mapGetters([
      'biobanks',
      'foundBiobanks',
      'loading',
      'foundCollectionIds'
    ]),
    biobanksShown () {
      return this.loading
        ? []
        : this.biobanks.slice(
          this.pageSize * (this.currentPage - 1),
          this.pageSize * this.currentPage
        )
    },
    biobankIds () {
      return this.loading ? [] : this.biobanks.map((it) => it.id || it)
    },
    biobankIdsToFetch () {
      return this.biobanksShown.filter((it) => typeof it === 'string')
    }
  },
  components: {
    BiobankCard,
    SearchFilter,
    CollectionSelectAll
  },
  watch: {
    biobankIds (newValue, oldValue) {
      if (
        newValue.length !== oldValue.length ||
        !newValue.every((element, index) => element === oldValue[index])
      ) {
        this.currentPage = 1
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
