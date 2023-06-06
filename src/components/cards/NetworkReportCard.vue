<template>
  <div class="container mg-network-report-card">
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <!-- Back to previous page buttons -->
          <button class="btn btn-link" @click="back">
            <i class="fa fa-angle-left mr-1" aria-hidden="true"></i>
            <span>{{ uiText["back"] }}</span>
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
                <report-description
                  :description="network.description"
                  :maxLength="500"></report-description>
                <div v-if="network.common_network_elements && network.common_network_elements.length" class="my-5">
                  <h3>Network details</h3>
                  <ul>
                    <li
                      v-for="element of network.common_network_elements"
                      :key="`key-${element}`">
                      {{ element.label || element.description }}
                    </li>
                  </ul>
                </div>
                <report-details-list
                  :reportDetails="detailsContent"></report-details-list>
                <b-tabs
                  v-if="
                    !collections ||
                    !biobanks ||
                    collectionsAvailable ||
                    biobanksAvailable
                  ">
                  <b-tab
                    id="collections"
                    :active="collectionsAvailable"
                    :disabled="!collectionsAvailable">
                    <template slot="title">
                      <h5>
                        Collections
                        <b-badge
                          :variant="collectionsAvailable ? 'secondary' : 'dark'"
                          v-if="collections">
                          {{ collections.length }}
                        </b-badge>
                        <i
                          v-else
                          class="fa fa-spin fa-spinner"
                          aria-hidden="true"></i>
                      </h5>
                    </template>
                    <div class="pt-3">
                      <div
                        v-for="(collection, index) in collections"
                        :key="collection.id">
                        <hr v-if="index" />
                        <collection-title
                          :title="collection.name"
                          :id="collection.id"/>
                        <view-generator :viewmodel="collection.viewmodel" />
                      </div>
                    </div>
                  </b-tab>
                  <b-tab
                    id="biobanks"
                    :active="!collectionsAvailable && biobanksAvailable"
                    :disabled="!biobanksAvailable">
                    <template slot="title">
                      <h5>
                        Biobanks
                        <b-badge
                          :variant="biobanksAvailable ? 'secondary' : 'dark'"
                          v-if="biobanks">
                          {{ biobanks && biobanks.length }}
                        </b-badge>
                        <i
                          v-else
                          class="fa fa-spin fa-spinner"
                          aria-hidden="true"></i>
                      </h5>
                    </template>
                    <div class="pt-3">
                      <div
                        v-for="(biobank, index) in biobanks"
                        :key="biobank.id">
                        <hr v-if="index" />
                        <h4>
                          <router-link :to="`/biobank/${biobank.id}`">{{
                            biobank.name
                          }}</router-link>
                        </h4>
                        <report-description
                          :description="biobank.description"
                          :maxLength="250"></report-description>
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
                      <report-details-list
                        :reportDetails="contact"></report-details-list>
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
/** Move to views */

import { mapActions, mapGetters, mapState } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import ReportDescription from '../report-components/ReportDescription.vue'
import ReportTitle from '../report-components/ReportTitle.vue'
import ReportDetailsList from '../report-components/ReportDetailsList.vue'
import ViewGenerator from '../generators/ViewGenerator.vue'
import CollectionTitle from '../report-components/CollectionTitle.vue'
import {
  mapContactInfo,
  getCollectionDetails
} from '../../utils/templateMapper'

export default {
  name: 'NetworkReportCard',
  components: {
    ReportTitle,
    ReportDescription,
    ReportDetailsList,
    Loading,
    CollectionTitle,
    ViewGenerator
  },
  methods: {
    ...mapActions(['GetNetworkReport']),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ networkReport: 'networkReport', isLoading: 'isLoading' }),
    ...mapGetters(['uiText']),
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
      return this.networkReport.collections
        ? this.networkReport.collections
          .filter((collection) => {
            return !collection.parentCollection
          })
          .map((col) => getCollectionDetails(col))
        : []
    },
    biobanks () {
      return this.networkReport.biobanks
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
    this.GetNetworkReport([this.networkId])
  }
}
</script>
