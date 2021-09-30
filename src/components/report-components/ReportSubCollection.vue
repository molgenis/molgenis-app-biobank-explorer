<template>
  <div :class="'mt-3 ml-'+(level)">
    <b>
      <router-link :to='"/collection/"+collection.id'>{{collection.name}}</router-link>
    </b>

    <table class="mg-report-details-list mb-3">
      <report-list-row :data="collection.Size">Size:</report-list-row>
      <report-list-row :data="collection.Materials">Materials:</report-list-row>
      <report-list-row :data="collection.Data">Data:</report-list-row>
    </table>

    <div v-if="collection.sub_collections && collection.sub_collections.length > 0" class="m-3">
      <b>Sub collections</b>
      <report-sub-collection
        v-for="subCollection in collection.sub_collections"
        :collection="subCollection"
        :key="subCollection.id"
        :level="level + 1"></report-sub-collection>
    </div>
  </div>
</template>

<script>
import ReportListRow from '@/components/report-components/ReportListRow'

export default {
  name: 'ReportSubCollection',
  components: {
    ReportListRow
  },
  props: {
    level: Number,
    collection: {
      description: String,
      parentCollection: Object,
      sub_collections: Array,
      name: String,
      id: String,
      content: {
        [String]: {
          value: String,
          type:
            'string' |
            'email' |
            'url' |
            'bool' |
            'list' |
            'phone' |
            'report' |
            'string-with-key',
          batchColor: {
            type:
              'success' |
              'warning' |
              'info' |
              'secondary' |
              'danger' |
              'light' |
              'dark',
            required: false
          }
        }
      }
    }
  }
}
</script>
