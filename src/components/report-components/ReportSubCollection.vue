<template>
  <div :class="'mt-3 ml-'+(level)">
    <strong><a :href='"/collection/report/"+collection.id'>{{collection.name}}</a></strong>
    <report-details-table :tableContent="collection.tableContent"></report-details-table>
    <div v-if="collection.subCollections.length" class="m-3">
      <strong>Sub collections</strong>
      <biobank-report-sub-collection :collection="collection.subCollections"></biobank-report-sub-collection>
    </div>
  </div>
</template>

<script>
  import ReportDetailsTable from '../report-components/ReportDetailsTable.vue'

  export default {
    name: 'ReportSubCollection',
    components: {ReportDetailsTable},
    props: {
      level: Number,
      collection: {
        description: String,
        parentCollection: Object,
        subCollections: Array,
        name: String,
        id: String,
        tableContent: {
          stringValues: Object,
          listValues: {
            Size: {
              values: Array,
              badgeColor: String
            },
            Materials: {
              values: Array,
              badgeColor: String
            },
            Data: {
              values: Array,
              badgeColor: String
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
