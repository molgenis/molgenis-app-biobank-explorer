<template>
  <div>
    <collection-selector
      class="mb-2"
      v-if="isTopLevelCollection"
      :collectionData="collection"/>

    <report-description
      :description="collection.description"
      :maxLength="500"></report-description>

    <!-- main collection information -->
    <table class="mg-report-details-list mb-3">
      <tr>
        <th scope="row" class="pr-1">Id:</th>
        <td>{{ collection.id }}</td>
      </tr>
      <tr v-if="collection.url">
        <th scope="row" class="pr-1">Website:</th>
        <td>
          <span><a target="_blank" :href="collection.url">
            {{ collection.url }}
          </a></span>
        </td>
      </tr>
      <report-list-row :data="mainContent.Size">Size:</report-list-row>
      <tr v-if="mainContent.Age && mainContent.Age.value">
        <th scope="row" class="pr-1">Age:</th>
        <td>{{ mainContent.Age.value }}</td>
      </tr>
      <create-collection-details
        v-for="(property, prop_index) in properties"
        :key="property.label + prop_index" :property="property"
        :collection="mainContent" :badgeColor="generateBadgeColor()" />
    </table>

    <!-- Recursive set of subcollections -->
    <div
      v-if="collection.sub_collections && collection.sub_collections.length"
      class="mt-2">
      <h5>Sub collections</h5>
      <report-sub-collection
        v-for="subCollection in collection.sub_collections"
        :collection="subCollection"
        :key="subCollection.id"
        :level="1"></report-sub-collection>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapCollectionsDetailsTableContent } from '../../utils/templateMapper'
import CollectionSelector from '../buttons/CollectionSelector.vue'
import CreateCollectionDetails from '../generators/CreateCollectionDetails.vue'
import ReportDescription from '../report-components/ReportDescription.vue'
import ReportListRow from '../report-components/ReportListRow.vue'
import ReportSubCollection from '../report-components/ReportSubCollection.vue'
import { createColumnKey } from '../../utils/generatorUtils'

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
    ReportListRow,
    ReportSubCollection,
    CreateCollectionDetails
  },
  computed: {
    ...mapState(['collectionColumns']),
    mainContent () {
      return this.collection
        ? mapCollectionsDetailsTableContent(this.collection)
        : {}
    },
    isTopLevelCollection () {
      return this.collection.parent_collection === undefined
    },
    properties () {
      const collectionKeys = Object.keys(this.mainContent)

      // filter out anything we don't have value for, so we dont mess up the badge-colors
      return this.collectionColumns.filter(prop => collectionKeys
        .includes(createColumnKey(prop.column)) &&
        this.mainContent[createColumnKey(prop.column)].value &&
        this.mainContent[createColumnKey(prop.column)].value.length)
    }
  },
  methods: {
    generateBadgeColor () {
      const badgeColors = ['info', 'secondary', 'danger', 'primary', 'success']
      let nextBadgeColor = 0

      if (this.prevBadgeColor === -1) {
        this.prevBadgeColor = 0
      } else {
        nextBadgeColor = this.prevBadgeColor === 4 ? 0 : this.prevBadgeColor + 1
      }
      this.prevBadgeColor = nextBadgeColor

      return badgeColors[nextBadgeColor]
    }
  },
  created () {
    this.prevBadgeColor = -1
  }
}
</script>

<style scoped>
::v-deep .mg-report-details-list th {
  vertical-align: top;
}
</style>
