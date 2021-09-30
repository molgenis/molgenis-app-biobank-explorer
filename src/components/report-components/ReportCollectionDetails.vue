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
          <span><a target="_blank" :href="collection.url">{{
              collection.url
            }}</a></span>
        </td>
      </tr>
      <report-list-row :data="mainContent.Size">Size:</report-list-row>
      <tr v-if="mainContent.Age && mainContent.Age.value">
        <th scope="row" class="pr-1">Age:</th>
        <td>{{ mainContent.Age.value }}</td>
      </tr>
      <report-list-row :data="mainContent.Type">Type:</report-list-row>
      <report-list-row :data="mainContent.Sex">Sex:</report-list-row>
      <report-list-row :data="mainContent.Materials">
        Materials:
      </report-list-row>
      <report-list-row :data="mainContent.Storage">Storage:</report-list-row>
      <report-list-row :data="mainContent.Data">Data:</report-list-row>
      <report-list-row :data="mainContent.Diagnosis">Diagnosis:
      </report-list-row>
      <report-list-row :data="mainContent.DataUse">
        Data use conditions:
      </report-list-row>
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
import { mapCollectionsDetailsTableContent } from '../../utils/templateMapper'
import CollectionSelector from '../buttons/CollectionSelector.vue'
import ReportDescription from '../report-components/ReportDescription.vue'
import ReportListRow from '../report-components/ReportListRow.vue'
import ReportSubCollection from '../report-components/ReportSubCollection.vue'

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
    ReportSubCollection
  },
  computed: {
    mainContent () {
      return this.collection
        ? mapCollectionsDetailsTableContent(this.collection)
        : {}
    },
    isTopLevelCollection () {
      return this.collection.parent_collection === undefined
    }
  }
}
</script>

<style scoped>
::v-deep .mg-report-details-list th {
  vertical-align: top;
}
</style>
