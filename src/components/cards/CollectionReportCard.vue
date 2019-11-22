<template>
  <div class="container mg-collection-report-card" v-if="this.report && this.prevRoute">
    <div class="row">
      <div class="col">
        <!-- Back to previous page buttons -->
        <router-link v-if="this.prevRoute.fullPath !== '/'" :to="this.prevRoute.fullPath"
                     name="previous">
          <em class="fa fa-angle-left"></em> Back
        </router-link>
        <router-link v-else :to="`/biobank/report/${this.report.biobank.id}`" name="biobank">
          <em class="fa fa-angle-left"></em> Back to biobank
        </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <!-- Title -->
        <report-title type="Collection" :id="report.id" :name="report.name"></report-title>

        <div class="container">
          <div class="row">
            <div class="col-8">
              <!-- Description -->
              <report-description :description="report.description"></report-description>

              <!-- Collection details -->
              <report-details-table :tableContent="detailsTableContent"></report-details-table>
            </div>

            <!-- Right side card -->
            <div class="col-4">
              <div class="card">
                <div class="card-body">
                  <div class="card-text">
                    <!-- Contact -->
                    <h5>Contact Information</h5>
                    <report-details-list :reportDetails="detailsListContent.contact"></report-details-list>
                    <!-- Biobank -->
                    <h5>Biobank</h5>
                    <report-details-list :reportDetails="detailsListContent.biobank"></report-details-list>
                    <!-- Quality -->
                    <h5>Quality</h5>
                    <report-details-list :reportDetails="detailsListContent.quality"></report-details-list>
                    <!-- Collaboration -->
                    <h5>Collaboration</h5>
                    <report-details-list :reportDetails="detailsListContent.collaboration"></report-details-list>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { GET_COLLECTION_REPORT } from '../../store/actions'
  import ReportDescription from './ReportDescription.vue'
  import ReportTitle from './ReportTitle.vue'
  import ReportDetailsTable from './ReportDetailsTable.vue'
  import ReportDetailsList from './ReportDetailsList.vue'
  import { mapDetailsTableContent, mapDetailsListContent } from '../../utils/collectionTemplateMapper'

  export default {
    name: 'CollectionReportCard',
    components: {ReportTitle, ReportDescription, ReportDetailsTable, ReportDetailsList},
    methods: {
      ...mapActions({
        getCollectionReport: GET_COLLECTION_REPORT
      })
    },
    computed: {
      ...mapState({report: state => state.collectionReport}),
      detailsTableContent () {
        return this.report ? mapDetailsTableContent(this.report) : {}
      },
      detailsListContent () {
        return this.report ? mapDetailsListContent(this.report) : {}
      }
    },
    data () {
      return {
        prevRoute: {fullPath: '/'}
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.prevRoute = from
      })
    },
    mounted () {
      const splittedUrl = this.$route.fullPath.split('/')
      this.getCollectionReport([splittedUrl[splittedUrl.length - 1]])
    }
  }
</script>
