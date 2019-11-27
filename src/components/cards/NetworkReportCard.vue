<template>
  <div class="container mg-network-report-card">
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"
    ></loading>
    <div class="container-fluid" v-if="this.network && !this.isLoading">
      <div class="row">
        <div class="col">
          <!-- Back to previous page buttons -->
          <button class="btn btn-link" @click="back">
            <i class="fa fa-angle-left" aria-hidden="true"></i> Back
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <report-title type="Network" :name="network.name"></report-title>
          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <report-description :description="network.description" :maxLength="500"></report-description>
                <report-details-list :reportDetails="detailsContent"></report-details-list>
              </div>
              <!-- Right side card -->
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-text">
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
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { GET_NETWORK_REPORT } from '../../store/actions'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/vue-loading.css'
  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportTitle from '../report-components/ReportTitle.vue'
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'
  import ReportSubCollection from '../report-components/ReportSubCollection'
  import { mapNetworkData, mapContactInfo } from '../../utils/templateMapper'

  export default {
    name: 'NetworkReportCard',
    components: {ReportTitle, ReportDescription, ReportDetailsList, ReportSubCollection, Loading},
    methods: {
      ...mapActions({
        getNetworkReport: GET_NETWORK_REPORT
      }),
      back () {
        this.$router.go(-1)
      }
    },
    computed: {
      ...mapState({network: 'networkReport', isLoading: 'isLoading'}),
      detailsContent () {
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
