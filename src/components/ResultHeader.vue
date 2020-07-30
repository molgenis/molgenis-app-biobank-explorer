<template>
  <div class="search-box-container">
    <div class="row>">
      <div class="col-md-12">
        <active-filter-list></active-filter-list>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="biobank-number-report-container">
          <small class="biobank-number-report">
          <em>{{foundBiobanks}} organisations with {{foundCollections}} collections matching the search criteria</em>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .biobank-number-report-container {
    border-bottom: solid 1px black;
    width: 100%;
  }

  .search-input-container {
    margin-bottom: 1rem;
  }

  .search-box-container {
    margin-bottom: 1rem;
  }

  .search-input-addon:hover {
    cursor: pointer
  }
</style>

<script>
import ActiveFilterList from './filters/ActiveFilterList'
import { mapGetters } from 'vuex'
import { groupCollectionsByBiobankId } from '../utils/grouping'

export default {
  computed: {
    ...mapGetters(['foundBiobanks', 'getCollectionsWithBiobankId', 'getFoundBiobankIds', 'rsql']),
    foundCollections () {
      if (this.getFoundBiobankIds.length) {
        const biobanksWithCollections = groupCollectionsByBiobankId(this.getCollectionsWithBiobankId)
        let collectionCount = 0
        for (const id of this.getFoundBiobankIds) {
          const collectionsInBiobank = biobanksWithCollections[id]
          if (collectionsInBiobank) collectionCount += collectionsInBiobank.length
        }
        return collectionCount
      } else return this.getCollectionsWithBiobankId.length
    }
  },
  components: {
    ActiveFilterList
  }
}
</script>
