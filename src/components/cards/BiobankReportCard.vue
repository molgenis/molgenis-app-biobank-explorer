<template>
  <div class="mg-biobank-card container">
    <loading
      :active="isLoading"
      loader="dots"
      color="var(--secondary)"
      background-color="var(--light)"
    ></loading>
    <div class="container-fluid" v-if="biobank.data && !this.isLoading">
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
          <report-title type="Biobank" :id="biobank.data.id" :name="biobank.data.name"></report-title>

          <div class="container">
            <div class="row">
              <div class="col-8">
                <!-- Description -->
                <report-description :description="biobank.data.description" :maxLength="500"></report-description>

                <!-- Collections-->
                <h3>Collections</h3>
                <div v-for="collection in collectionsData" v-if="!collection.parentCollection" :key="collection.id">
                  <biobank-report-collection :collection="collection"></biobank-report-collection>
                </div>
              </div>

              <!-- Right side card -->
              <div class="col-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-text">
                      <!-- Contact -->
                      <h5>Contact Information</h5>
                      <report-details-list :reportDetails="contact"></report-details-list>

                      <!-- Network -->
                      <h5 v-if="this.networks && this.networks.length > 0">Networks</h5>
                      <report-details-list :reportDetails="network" v-for="network in networks"
                                           :key="network.id"></report-details-list>
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
<style scoped>
  body > div > div > div > div.vld-overlay.is-active.is-full-page {
    margin-left: 50%;
  }
</style>
<script>
  import { mapState, mapActions } from 'vuex'
  import { GET_BIOBANK_REPORT } from '../../store/actions'
  import { mapContactInfo, mapCollectionsData, mapNetworkInfo } from '../../utils/templateMapper'

  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportTitle from '../report-components/ReportTitle.vue'
  import ReportDetailsTable from '../report-components/ReportDetailsTable.vue'
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'
  import BiobankReportCollection from '../report-components/BiobankReportCollection.vue'

  import Loading from 'vue-loading-overlay'

  export default {
    name: 'biobank-report-card',
    components: {
      ReportTitle,
      ReportDescription,
      ReportDetailsTable,
      ReportDetailsList,
      BiobankReportCollection,
      Loading
    },
    data () {
      return {
        collapsed: true
      }
    },
    computed: {
      ...mapState({
        biobank: 'biobankReport',
        isLoading: 'isLoading'
      }),
      query () {
        return this.$route.query
      },
      networks () {
        return this.biobank && this.biobank.data && this.biobank.data.network ? mapNetworkInfo(this.biobank.data) : {}
      },
      contact () {
        return this.biobank && this.biobank.data && this.biobank.data.contact ? mapContactInfo(this.biobank.data) : {}
      },
      collectionsData () {
        return this.biobank && this.biobank.data && this.biobank.data.collections ? mapCollectionsData(this.biobank.data.collections) : []
      }
    },
    methods: {
      ...mapActions({
        getBiobankReport: GET_BIOBANK_REPORT
      }),
      back () {
        this.$router.go(-1)
      }
    },
    mounted () {
      this.getBiobankReport(this.$store.state.route.params.id)
    }
  }
</script>
