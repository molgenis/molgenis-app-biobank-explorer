<template>
  <div :class="'mt-3 ml-'+(level)">
    <strong>
      <router-link :to='"/collection/"+collection.id'>{{collection.name}}</router-link>
    </strong>
    <report-details-list :reportDetails="collection.content"></report-details-list>
    <div v-if="collection.subCollections && collection.subCollections.length > 0" class="m-3">
      <strong>Sub collections</strong>
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
import ReportDetailsList from '../report-components/ReportDetailsList.vue'

export default {
  name: 'ReportSubCollection',
  components: { ReportDetailsList },
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
  },
  // needed because if we route back the component is not destroyed but its props are updated for other collection
  watch: {
    $route(to, from) {
      location.reload()
    }
  }
}
</script>
