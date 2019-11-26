<template>
  <div class="container mg-network-report-card" v-if="this.network">
    <div class="row">
      <div class="col">
        <!-- Back to previous page buttons -->
        <button class="btn btn-link" @click="back">
          <em class="fa fa-angle-left"></em> Back
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <!-- Title -->
        <report-title type="Network" :id="network.id" :name="network.name"></report-title>

        <div class="container">
          <div class="row">
            <div class="col-8">
              <!-- Description -->
              <report-description :description="network.description" :maxLength="500"></report-description>

              <!-- Network details -->
              <report-details-table :tableContent="detailsTableContent"></report-details-table>

            </div>
            <!-- Right side card -->
            <div class="col-4">
              <div class="card">
                <div class="card-body">
                  <div class="card-text">
                    <!-- Contact -->
                    <h5>Contact Information</h5>
                    <report-details-list :reportDetails="contact"></report-details-list>
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
  import { GET_NETWORK_REPORT } from '../../store/actions'
  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportTitle from '../report-components/ReportTitle.vue'
  import ReportDetailsTable from '../report-components/ReportDetailsTable.vue'
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'
  import ReportSubCollection from '../report-components/ReportSubCollection'
  import { mapNetworkData, mapContactInfo } from '../../utils/templateMapper'

  export default {
    name: 'NetworkReportCard',
    components: {ReportTitle, ReportDescription, ReportDetailsTable, ReportDetailsList, ReportSubCollection},
    methods: {
      ...mapActions({
        getNetworkReport: GET_NETWORK_REPORT
      }),
      back () {
        this.$router.go(-1)
      }
    },
    computed: {
      ...mapState({network: 'networkReport'}),
      detailsTableContent () {
        return mapNetworkData(this.network)
      },
      contact () {
        return mapContactInfo(this.network)
      },
      networkId () {
        const splittedUrl = this.$route.fullPath.split('/')
        return splittedUrl[splittedUrl.length - 1]
      }
    },
    mounted () {
      this.getNetworkReport([this.networkId])
    }
  }
</script>
