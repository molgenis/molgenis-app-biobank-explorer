<template>
  <div class="container mg-collection-report-card">
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

      <div class="row" v-if="this.collection && !this.isLoading">
        <div class="col">
          <report-title type="Collection" :name="collection.name"></report-title>

          <div class="container">
            <div class="row">
              <div class="col-md-8">
                <p>
                  <b>Id:</b>
                  {{ collection.id }}
                </p>
                <report-description :description="collection.description" :maxLength="500"></report-description>
                <report-details-list :reportDetails="mainContent"></report-details-list>
                <div
                  v-if="
                    collection.sub_collections &&
                      collection.sub_collections.length
                  "
                  class="mt-2"
                >
                  <h5>Sub collections</h5>
                  <report-sub-collection
                    v-for="subCollection in subCollections"
                    :collection="subCollection"
                    :key="subCollection.id"
                    :level="1"
                  ></report-sub-collection>
                </div>
              </div>

              <!-- Right side card -->
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-text">
                      <h5>Contact Information</h5>
                      <report-details-list :reportDetails="rightCardContent.contact"></report-details-list>
                      <h5>Biobank</h5>
                      <report-details-list :reportDetails="rightCardContent.biobank"></report-details-list>
                      <table>
                        <tr>
                          <th colspan="2">Biobank id:</th>
                        </tr>
                        <tr>
                          <td class="biobank-id" colspan="2">{{collection.biobank.id}}</td>
                        </tr>
                      </table>
                      <h5
                        v-if="
                          rightCardContent.networks &&
                            rightCardContent.networks.length > 0
                        "
                      >Networks</h5>
                      <report-details-list
                        :reportDetails="network"
                        v-for="network in rightCardContent.networks"
                        :key="network.id"
                      ></report-details-list>
                      <h5
                        v-if="
                          rightCardContent.quality.Certification.value.length >
                            0
                        "
                      >Quality</h5>
                      <report-details-list :reportDetails="rightCardContent.quality"></report-details-list>
                      <h5 v-if="Object.keys(rightCardContent.collaboration).length > 0">Collaboration</h5>
                      <report-details-list :reportDetails="rightCardContent.collaboration"></report-details-list>
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
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { GET_COLLECTION_REPORT } from '../../store/actions'
import ReportDescription from '../report-components/ReportDescription.vue'
import ReportTitle from '../report-components/ReportTitle.vue'
import ReportDetailsList from '../report-components/ReportDetailsList.vue'
import ReportSubCollection from '../report-components/ReportSubCollection'
import {
  mapDetailsTableContent,
  mapCollectionDetailsListContent,
  mapCollectionsData
} from '../../utils/templateMapper'

export default {
  name: 'CollectionReportCard',
  components: {
    ReportTitle,
    ReportDescription,
    ReportDetailsList,
    ReportSubCollection,
    Loading
  },
  methods: {
    ...mapActions({
      getCollectionReport: GET_COLLECTION_REPORT
    }),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ collection: 'collectionReport', isLoading: 'isLoading' }),
    mainContent () {
      return this.collection ? mapDetailsTableContent(this.collection) : {}
    },
    rightCardContent () {
      return this.collection
        ? mapCollectionDetailsListContent(this.collection)
        : {}
    },
    subCollections () {
      return this.collection &&
        this.collection.sub_collections &&
        this.collection.sub_collections.length
        ? mapCollectionsData(this.collection.sub_collections)
        : []
    },
    collectionId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    }
  },
  // needed because if we route back the component is not destroyed but its props are updated for other collection
  watch: {
    $route (to, from) {
      if (from.name.indexOf('collection') >= 0) {
        location.reload()
      }
    }
  },
  mounted () {
    this.getCollectionReport([this.collectionId])
  }
}
</script>

<style scoped>
.biobank-id {
  word-break: break-all;
}
</style>
