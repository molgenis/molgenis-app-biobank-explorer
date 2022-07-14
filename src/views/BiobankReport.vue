<template>
  <div class="mg-biobank-card container pb-4">
    <script
      v-if="bioschemasJsonld && !isLoading"
      v-text="bioschemasJsonld"
      type="application/ld+json"/>
    <loading
      :active="isLoading"
      loader="dots"
      color="var(--secondary)"
      background-color="var(--light)"></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col my-3 shadow-sm">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb my-1">
              <li class="breadcrumb-item">
                <router-link to="/biobankexplorer" title="Back to biobank explorer">
                  {{ uiText["home"] }}
                </router-link>
              </li>
              <li class="breadcrumb-item active text-dark" aria-current="page">
                {{ biobank.name }}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row" v-if="biobankDataAvailable && !this.isLoading">
        <div class="col">
          <report-title type="Biobank" :name="biobank.name"></report-title>
          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <view-generator :viewmodel="biobank.viewmodel" />

                <!-- Collection Part -->
                <h3 class="mt-4">Collections</h3>
                <div
                  v-for="(collection, index) in collectionsData"
                  :key="collection.id">
                  <hr v-if="index" />
                  <collection-title
                    :title="collection.name"
                    :id="collection.id"/>

                  <view-generator
                    class="collection-view"
                    :viewmodel="collection.viewmodel"/>
                </div>
              </div>
              <!-- Right side card -->
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-text">
                      <h5>Contact Information</h5>
                      <report-details-list
                        :reportDetails="contact"></report-details-list>
                      <h5 v-if="networks && networks.length > 0">Networks</h5>
                      <report-details-list
                        :reportDetails="network"
                        v-for="network in networks"
                        :key="network.id"></report-details-list>
                      <h5
                        v-if="
                          quality &&
                          quality.Certification &&
                          quality.Certification.value.length > 0
                        ">
                        Quality
                      </h5>
                      <report-details-list
                        :reportDetails="quality"></report-details-list>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import ReportTitle from '../components/report-components/ReportTitle.vue'
import ReportDetailsList from '../components/report-components/ReportDetailsList.vue'
import CollectionTitle from '../components/report-components/CollectionTitle.vue'
import ViewGenerator from '../components/generators/ViewGenerator.vue'
import { sortCollectionsByName } from '../utils/sorting'

import {
  getBiobankDetails,
  getCollectionDetails,
  mapContactInfo,
  mapNetworkInfo,
  mapObjArray
} from '../utils/templateMapper'

import { mapBiobankToBioschemas } from '@/utils/bioschemasMapper'

export default {
  name: 'biobank-report-card',
  components: {
    ReportTitle,
    ReportDetailsList,
    Loading,
    ViewGenerator,
    CollectionTitle
  },
  data () {
    return {
      collapsed: true
    }
  },
  computed: {
    ...mapState(['biobankReport', 'isLoading']),
    ...mapGetters(['uiText']),
    biobank () {
      return this.biobankReport ? getBiobankDetails(this.biobankReport) : {}
    },
    biobankDataAvailable () {
      return Object.keys(this.biobank).length
    },
    query () {
      return this.$route.query
    },
    networks () {
      return this.biobankDataAvailable && this.biobank.network
        ? mapNetworkInfo(this.biobank)
        : []
    },
    contact () {
      return this.biobankDataAvailable && this.biobank.contact
        ? mapContactInfo(this.biobank)
        : {}
    },
    collectionsData () {
      return this.biobankDataAvailable && this.biobank.collections
        ? sortCollectionsByName(this.biobank.collections)
          .filter(it => !it.parent_collection)
          .map(col => getCollectionDetails(col))
        : []
    },
    quality () {
      return {
        Certification: {
          value: mapObjArray(this.biobank.quality),
          type: 'list'
        }
      }
    },
    bioschemasJsonld () {
      return this.biobankDataAvailable
        ? mapBiobankToBioschemas(this.biobank)
        : undefined
    }
  },
  methods: {
    ...mapActions(['GetBiobankReport'])
  },
  mounted () {
    this.GetBiobankReport(this.$store.state.route.params.id)
  }
}
</script>
