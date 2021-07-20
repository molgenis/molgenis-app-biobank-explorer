<template>
  <div class="container mg-collection-report-card">
    <script v-text="bioschemasJsonld" type="application/ld+json" />
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"></loading>
    <div class="container-fluid">
      <!-- Back to previous page buttons -->
      <button class="btn btn-link pl-0" @click="back">
        <i class="fa fa-angle-left" aria-hidden="true"></i> Back
      </button>

      <div class="row" v-if="this.collection && !this.isLoading">
        <div class="col">
          <report-title type="Collection" :name="collection.name">
          </report-title>

          <div class="container p-0">
            <div class="row">
              <div class="col-md-8">
                <report-collection-details :collection="collection" />
              </div>

              <!-- Right side card -->
              <collection-report-info-card
                :info="info"></collection-report-info-card>
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
import ReportTitle from '../components/report-components/ReportTitle'
import CollectionReportInfoCard from '../components/cards/CollectionReportInfoCard'
import { collectionReportInformation } from '../utils/templateMapper'
import { mapCollectionToBioschemas } from '../utils/bioschemasMapper'
import ReportCollectionDetails from '../components/report-components/ReportCollectionDetails.vue'

export default {
  name: 'CollectionReport',
  components: {
    ReportTitle,
    CollectionReportInfoCard,
    Loading,
    ReportCollectionDetails
  },
  methods: {
    ...mapActions(['GetCollectionReport']),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ collection: 'collectionReport', isLoading: 'isLoading' }),
    info () {
      return collectionReportInformation(this.collection)
    },
    collectionId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    },
    bioschemasJsonld () {
      return this.collection ? mapCollectionToBioschemas(this.collection) : {}
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
    this.GetCollectionReport([this.collectionId])
  }
}
</script>
