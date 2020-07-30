<template>
  <div class="container mg-network-report-card">
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"
    ></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <!-- Back to previous page buttons -->
          <button class="btn btn-link" @click="back">
            <i class="fa fa-angle-left" aria-hidden="true"></i> Back
          </button>
        </div>
      </div>

      <div class="row" v-if="this.network && !this.isLoading">
        <div class="col">
          <report-title type="Network" :name="network.name"></report-title>
          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <p><b>Id: </b>{{ network.id }}</p>
                <report-description :description="network.description" :maxLength="500"></report-description>
                <report-details-list :reportDetails="detailsContent"></report-details-list>
                <b-tabs v-if="!collections || !biobanks || collectionsAvailable || biobanksAvailable">
                  <b-tab id="collections" :active="collectionsAvailable" :disabled="!collectionsAvailable">
                    <template slot="title">
                      <h5>Collections
                        <b-badge :variant="collectionsAvailable ? 'secondary': 'dark'" v-if="collections">
                          {{collections.length}}
                        </b-badge>
                        <i v-else class="fa fa-spin fa-spinner" aria-hidden="true"></i>
                      </h5>
                    </template>
                    <div class="pt-3">
                      <div v-for="(collection, index) in collections" :key="collection.id">
                        <hr v-if="index"/>
                        <report-collection :collection="collection"></report-collection>
                      </div>
                    </div>
                  </b-tab>
                  <b-tab id="biobanks" :active="!collectionsAvailable && biobanksAvailable"
                         :disabled="!biobanksAvailable">
                    <template slot="title">
                      <h5>Biobanks
                        <b-badge :variant="biobanksAvailable ? 'secondary': 'dark'" v-if="biobanks">
                          {{biobanks && biobanks.length}}
                        </b-badge>
                        <i v-else class="fa fa-spin fa-spinner" aria-hidden="true"></i>
                      </h5>
                    </template>
                    <div class="pt-3">
                      <div v-for="(biobank, index) in biobanks" :key="biobank.id">
                        <hr v-if="index"/>
                        <h4>
                          <router-link :to='`/biobank/${biobank.id}`'>{{biobank.name}}</router-link>
                        </h4>
                        <report-description :description="biobank.description" :maxLength="250"></report-description>
                      </div>
                    </div>
                  </b-tab>
                </b-tabs>
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
import ReportCollection from '../report-components/ReportCollection'
import { mapNetworkData, mapContactInfo, mapCollectionsData } from '../../utils/templateMapper'

export default {
  name: 'NetworkReportCard',
  components: { ReportTitle, ReportDescription, ReportDetailsList, Loading, ReportCollection },
  methods: {
    ...mapActions({
      getNetworkReport: GET_NETWORK_REPORT
    }),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ networkReport: 'networkReport', isLoading: 'isLoading' }),
    collectionsAvailable () {
      return this.collections && this.collections.length > 0
    },
    biobanksAvailable () {
      return this.biobanks && this.biobanks.length > 0
    },
    network () {
      return this.networkReport.network
    },
    collections () {
      return this.networkReport.collections ? mapCollectionsData(this.networkReport.collections).filter(
        (collection) => { return !collection.parentCollection }) : []
    },
    biobanks () {
      return this.networkReport.biobanks
    },
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
