<template>
  <b-pagination
    v-if="foundBiobanks > pageSize && !loading"
    class="m-0"
    size="md"
    align="center"
    :total-rows="foundBiobanks"
    v-model="pageNumber"
    :per-page="pageSize"></b-pagination>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['currentPage', 'pageSize']),
    ...mapGetters(['foundBiobanks', 'loading']),
    pageNumber: {
      get () {
        return this.currentPage
      },
      set (pageNumber) {
        this.SetCurrentPage(pageNumber)
        this.QueryBiobanks()
      }
    }
  },
  methods: {
    ...mapMutations(['SetCurrentPage']),
    ...mapActions(['QueryBiobanks'])
  }
}
</script>
