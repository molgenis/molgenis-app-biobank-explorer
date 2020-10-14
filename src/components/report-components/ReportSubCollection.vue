<template>
  <div :class="'mt-3 ml-'+(level)">
    <b>
      <router-link :to='"/collection/"+collection.id'>{{collection.name}}</router-link>
    </b>

    <table class="mg-report-details-list mb-3">
      <report-list :data="collection.content.Size">Size:</report-list>
      <report-list :data="collection.content.Materials">Materials:</report-list>
      <report-list :data="collection.content.Data">Data:</report-list>
    </table>

    <div v-if="collection.subCollections && collection.subCollections.length > 0" class="m-3">
      <b>Sub collections</b>
      <report-sub-collection
        v-for="subCollection in collection.subCollections"
        :collection="subCollection"
        :key="subCollection.id"
        :level="level + 1"
      ></report-sub-collection>
    </div>
  </div>
</template>

<script>
import ReportList from '@/components/report-components/ReportList'

export default {
  name: 'ReportSubCollection',
  components: {
    ReportList
  },
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
