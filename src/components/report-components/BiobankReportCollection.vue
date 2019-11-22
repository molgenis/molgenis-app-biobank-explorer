<template>
  <div>
    <hr/>
    <h4><a :href='"/collection/report/"+collection.id'>{{collection.name}}</a></h4>
    <report-description :description="collection.description" :maxLength="200"></report-description>
    <report-details-table :tableContent="collection.tableContent"></report-details-table>
    <div v-if="collection.subCollections.length" class="m-3">
      <h5>Sub collections</h5>
      <biobank-report-sub-collection v-for="subCollection in collection.subCollections" :collection="subCollection" :level="1"></biobank-report-sub-collection>
    </div>
  </div>
</template>

<script>
  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportDetailsTable from '../report-components/ReportDetailsTable.vue'
  import BiobankReportSubCollection from '../report-components/BiobankReportSubCollection.vue'

  export default {
    name: 'BiobankReportCollection',
    components: {ReportDescription, ReportDetailsTable, BiobankReportSubCollection},
    props: {
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
