<template>
  <div class="mg-biobank-card container">
    <loading
      :active="isLoading"
      loader="dots"
      color="var(--secondary)"
      background-color="var(--light)"
    ></loading>
    <div class="container-fluid" v-if="biobankDataAvailable && !this.isLoading">
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
          <!-- Title -->
          <report-title type="Biobank" :name="biobank.name"></report-title>

          <div class="container">
            <div class="row">
              <div class="col-8">
                <!-- Description -->
                <report-description :description="biobank.description" :maxLength="500"></report-description>

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

<script>
  import { mapState, mapActions } from 'vuex'
  import { GET_BIOBANK_REPORT } from '../../store/actions'
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/vue-loading.css'
  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportTitle from '../report-components/ReportTitle.vue'
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'
  import BiobankReportCollection from '../report-components/BiobankReportCollection.vue'
  import { mapContactInfo, mapCollectionsData, mapNetworkInfo } from '../../utils/templateMapper'

  export default {
    name: 'biobank-report-card',
    components: {
      ReportTitle,
      ReportDescription,
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
      biobankDataAvailable () {
        return this.biobank && this.biobank
      },
      query () {
        return this.$route.query
      },
      networks () {
        return this.biobankDataAvailable && this.biobank.network ? mapNetworkInfo(this.biobank) : []
      },
      contact () {
        return this.biobankDataAvailable && this.biobank.contact ? mapContactInfo(this.biobank) : {}
      },
      collectionsData () {
        return this.biobankDataAvailable && this.biobank.collections ? mapCollectionsData(this.biobank.collections) : []
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
