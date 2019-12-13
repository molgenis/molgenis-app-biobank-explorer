<template>
  <div :class="'mt-3 ml-'+(level)">
    <strong><a :href='"/collection/"+collection.id'>{{collection.name}}</a></strong>
    <report-details-list :reportDetails="collection.content"></report-details-list>
    <div v-if="collection.subCollections && collection.subCollections.length > 0" class="m-3">
      <strong>Sub collections</strong>
      <report-sub-collection v-for="subCollection in collection.subCollections"
                                     :collection="subCollection"
                                     :key="subCollection.id"
                                     :level="level + 1"></report-sub-collection>
    </div>
  </div>
</template>

<script>
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'

  export default {
    name: 'ReportSubCollection',
    components: {ReportDetailsList},
    props: {
      level: Number,
      collection: {
        description: String,
        parentCollection: Object,
        subCollections: Array,
        name: String,
        id: String,
        content: {
          [String]: {
            value: String,
            type: 'string' | 'email' | 'url' | 'bool' | 'list' | 'phone' | 'report' | 'string-with-key',
            batchColor: {
              type: 'success' | 'warning' | 'info' | 'secondary' | 'danger' | 'light' | 'dark',
              required: false
            }
          }
        }
      }
    }
  }
</script>
