<template>
  <div>
    <collection-selector
      class="mb-2"
      v-if="isTopLevelCollection"
      :collectionData="collection"/>

    <report-description
      :description="collection.description"
      :maxLength="500"></report-description>

    <!-- collection information -->
    <collection-view-generator :collection="collectionModel" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getCollectionDetails } from '../../utils/templateMapper'
import CollectionSelector from '../buttons/CollectionSelector.vue'
import ReportDescription from '../report-components/ReportDescription.vue'
import CollectionViewGenerator from '../generators/CollectionViewGenerator.vue'

export default {
  name: 'ReportCollectionDetails',
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  components: {
    CollectionSelector,
    ReportDescription,
    CollectionViewGenerator
  },
  computed: {
    ...mapState(['collectionColumns']),
    collectionModel () {
      return this.collection
        ? getCollectionDetails(this.collection)
        : {}
    },
    isTopLevelCollection () {
      return this.collection.parent_collection === undefined
    }
  }
}
</script>
