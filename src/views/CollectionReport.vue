<template>
  <div class="container mg-collection-report-card">
    <loading :active="isLoading" loader="dots" :is-full-page="true" color="var(--secondary)" background-color="var(--light)"></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col">
          <!-- Back to previous page buttons -->
          <button class="btn btn-link" @click="back"><i class="fa fa-angle-left" aria-hidden="true"></i> Back</button>
        </div>
      </div>

      <div class="row" v-if="this.collection && !this.isLoading">
        <div class="col">
          <report-title type="Collection" :name="collection.name"></report-title>

          <div class="container p-0">
            <div class="row">
              <div class="col-md-8">
                <report-description :description="collection.description" :maxLength="500"></report-description>

                <!-- main collection information -->
                <table class="mg-report-details-list mb-3">
                  <tr>
                    <th scope="row" class="pr-1">Id:</th>
                    <td>{{ collection.id }}</td>
                  </tr>
                  <report-list :data="mainContent.Size">Size:</report-list>
                  <tr v-if="mainContent.Age">
                    <th scope="row" class="pr-1">Age:</th>
                    <td colspan="2">{{ mainContent.Age.value }}</td>
                  </tr>
                  <report-list :data="mainContent.Type">Type:</report-list>
                  <report-list :data="mainContent.Sex">Sex:</report-list>
                  <report-list :data="mainContent.Materials">Materials:</report-list>
                  <report-list :data="mainContent.Storage">Storage:</report-list>
                  <report-list :data="mainContent.Data">Data:</report-list>
                  <report-list :data="mainContent.Diagnosis">Diagnosis:</report-list>
                </table>

                <!-- Recursive set of subcollections -->
                <div v-if="collection.sub_collections && collection.sub_collections.length" class="mt-2">
                  <h5>Sub collections</h5>
                  <report-sub-collection v-for="subCollection in subCollections" :collection="subCollection" :key="subCollection.id" :level="1"></report-sub-collection>
                </div>
              </div>

              <!-- Right side card -->
              <collection-report-info-card :info="info"></collection-report-info-card>
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
import { GET_COLLECTION_REPORT } from '@/store/actions'
import ReportDescription from '@/components/report-components/ReportDescription'
import ReportTitle from '@/components/report-components/ReportTitle'
import ReportList from '@/components/report-components/ReportList'
import ReportSubCollection from '@/components/report-components/ReportSubCollection'
import CollectionReportInfoCard from '@/components/cards/CollectionReportInfoCard'

import { mapDetailsTableContent, mapCollectionsData, collectionReportInformation } from '@/utils/templateMapper'

export default {
  name: 'CollectionReport',
  components: {
    ReportList,
    ReportTitle,
    ReportDescription,
    ReportSubCollection,
    CollectionReportInfoCard,
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
    info () {
      return collectionReportInformation(this.collection)
    },
    subCollections () {
      return this.collection && this.collection.sub_collections && this.collection.sub_collections.length ? mapCollectionsData(this.collection.sub_collections) : []
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
>>> .mg-report-details-list th {
  vertical-align: top;
}
</style>
