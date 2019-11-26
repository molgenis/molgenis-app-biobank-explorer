<template>
  <div class="container mg-collection-report-card" v-if="this.collection">
    <div class="row">
      <div class="col">
        <!-- Back to previous page buttons -->
        <router-link v-if="this.collection.parent_collection"
                     :to="`/collection/report/${this.collection.parent_collection.id}`" name="parent">
          <em class="fa fa-angle-left"></em> Back to parent collection
        </router-link>
        <button class="btn btn-link" v-else @click="back">
          <em class="fa fa-angle-left"></em> Back
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <!-- Title -->
        <report-title type="Collection" :id="collection.id" :name="collection.name"></report-title>

        <div class="container">
          <div class="row">
            <div class="col-8">
              <!-- Description -->
              <report-description :description="collection.description" :maxLength="500"></report-description>

              <!-- Collection details -->
              <report-details-table :tableContent="detailsTableContent"></report-details-table>

              <!-- Sub collections -->
              <div v-if="collection.sub_collections && collection.sub_collections.length" class="mt-2">
                <h5>Sub collections</h5>
                <report-sub-collection v-for="subCollection in subCollections"
                                       :collection="subCollection"
                                       :key="subCollection.id"
                                       :level="1"></report-sub-collection>
              </div>
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
                    <!-- Network -->
                    <h5 v-if="detailsListContent.networks && detailsListContent.networks.length > 0">Networks</h5>
                    <report-details-list :reportDetails="network" v-for="network in detailsListContent.networks"
                                         :key="network.id"></report-details-list>
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
  import ReportDescription from '../report-components/ReportDescription.vue'
  import ReportTitle from '../report-components/ReportTitle.vue'
  import ReportDetailsTable from '../report-components/ReportDetailsTable.vue'
  import ReportDetailsList from '../report-components/ReportDetailsList.vue'
  import ReportSubCollection from '../report-components/ReportSubCollection'
  import { mapDetailsTableContent, mapCollectionDetailsListContent, mapCollectionsData } from '../../utils/templateMapper'

  export default {
    name: 'CollectionReportCard',
    components: {ReportTitle, ReportDescription, ReportDetailsTable, ReportDetailsList, ReportSubCollection},
    methods: {
      ...mapActions({
        getCollectionReport: GET_COLLECTION_REPORT
      }),
      back () {
        this.$router.go(-1)
      }
    },
    computed: {
      ...mapState({collection: 'collectionReport'}),
      detailsTableContent () {
        return this.collection ? mapDetailsTableContent(this.collection) : {}
      },
      detailsListContent () {
        return this.collection ? mapCollectionDetailsListContent(this.collection) : {}
      },
      subCollections () {
        return this.collection && this.collection.sub_collections && this.collection.sub_collections.length ? mapCollectionsData(this.collection.sub_collections) : []
      },
      collectionId () {
        const splittedUrl = this.$route.fullPath.split('/')
        return splittedUrl[splittedUrl.length - 1]
      }
    },
    mounted () {
      this.getCollectionReport([this.collectionId])
    }
  }
</script>
