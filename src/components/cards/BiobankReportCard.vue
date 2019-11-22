<template>
  <div class="mg-biobank-card container" v-if="biobank.data">
    <div class="row">
      <div class="col">
        <!-- Back to previous page buttons -->
        <router-link :to="{path: '/biobankexplorer', query: query}"><em class="fa fa-angle-left"></em> Back to search
          results
        </router-link>
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
              <div v-for="collection in collectionsData" v-if="!collection.parentCollection">
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
                    <report-details-list :reportDetails="contactInfo"></report-details-list>
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
  import { mapState } from 'vuex'
  import { GET_BIOBANK_REPORT } from '../../store/actions'
  import { mapContactInfo, mapCollectionsData } from '../../utils/biobankTemplateMapper'

  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportTitle from '../report-components/ReportTitle.vue'
  import ReportDetailsTable from '../report-components/ReportDetailsTable.vue'
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'
  import BiobankReportCollection from '../report-components/BiobankReportCollection.vue'

  export default {
    name: 'biobank-report-card',
    components: {ReportTitle, ReportDescription, ReportDetailsTable, ReportDetailsList, BiobankReportCollection},
    data () {
      return {
        collapsed: true
      }
    },
    computed: {
      ...mapState({
        biobank: 'biobankReport'
      }),
      query () {
        return this.$route.query
      },
      contactInfo () {
        return this.biobank ? mapContactInfo(this.biobank.data) : {}
      },
      collectionsData () {
        return this.biobank && this.biobank.data && this.biobank.data.collections ? mapCollectionsData(this.biobank.data.collections) : []
      }
    },
    mounted () {
      this.$store.dispatch(GET_BIOBANK_REPORT, this.$store.state.route.params.id)
    }
  }
</script>
