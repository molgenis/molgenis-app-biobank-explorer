<template>
  <div class="search-box-container">
    <div class="biobank-number-report-container">
      <small class="biobank-number-report">
        <em>
          {{ foundBiobanks }} organisations with
          {{ parentCollections.length }} collection(s)
          <template v-if="subCollections.length > 0">
            and {{ subCollections.length }} subcollection(s)
          </template>
          matching the search criteria
        </em>
      </small>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['foundBiobanks', 'subcollections', 'parentCollections'])
  }
}
</script>

<style>
.biobank-number-report-container {
  border-bottom: solid 1px black;
  width: 100%;
}
</style>
