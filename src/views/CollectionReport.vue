<template>
  <div class="container mg-collection-report-card pb-4">
    <script
      v-if="bioschemasJsonld && !isLoading"
      v-text="bioschemasJsonld"
      type="application/ld+json"/>
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col my-3 shadow-sm">
          <nav aria-label="breadcrumb" v-if="collection">
            <ol class="breadcrumb my-1">
              <li class="breadcrumb-item">
                <router-link
                  to="/biobankexplorer"
                  title="Back to biobank explorer">
                  {{ uiText["home"] }}
                </router-link>
              </li>
              <li class="breadcrumb-item">
                <router-link
                  :to="'/biobank/' + collection.biobank.id"
                  :title="'Go to biobank ' + collection.biobank.name">
                  {{ collection.biobank.name }}
                </router-link>
              </li>
              <li class="breadcrumb-item" v-if="info.parentCollection">
                <router-link
                  :to="'/collection/' + info.parentCollection.id"
                  :title="'Go to parent collection ' + info.parentCollection.name">
                  {{ info.parentCollection.name }}
                </router-link>
              </li>
              <li class="breadcrumb-item active text-dark" aria-current="page">
                {{ collection.name }}
              </li>
            </ol>
          </nav>
        </div>
      </div>

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
import { mapActions, mapGetters, mapState } from 'vuex'
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
    ...mapGetters(['uiText']),
    info () {
      return collectionReportInformation(this.collection)
    },
    collectionId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    },
    bioschemasJsonld () {
      return this.collection
        ? mapCollectionToBioschemas(this.collection)
        : undefined
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
