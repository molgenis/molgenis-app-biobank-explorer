<template>
  <div class="container mg-collection-report-card">
    <script v-html='jsonld' type='application/ld+json' />
    <loading :active="isLoading" loader="dots" :is-full-page="true" color="var(--secondary)" background-color="var(--light)"></loading>
    <div class="container-fluid">
      <!-- Back to previous page buttons -->
      <button class="btn btn-link pl-0" @click="back"><i class="fa fa-angle-left" aria-hidden="true"></i> Back</button>

      <div class="row" v-if="this.collection && !this.isLoading">
        <div class="col">
          <report-title type="Collection" :name="collection.name"></report-title>

          <div class="container p-0">
            <div class="row">
              <div class="col-md-8">
                <collection-selector class="mb-2" v-if="isTopLevelCollection" :collectionData="collection" />

                <report-description :description="collection.description" :maxLength="500"></report-description>

                <!-- main collection information -->
                <table class="mg-report-details-list mb-3">
                  <tr>
                    <th scope="row" class="pr-1">Id:</th>
                    <td>{{ collection.id }}</td>
                  </tr>
                  <tr v-if="collection.url">
                    <th scope="row" class="pr-1">Website:</th>
                    <td>
                      <span
                        ><a target="_blank" :href="collection.url">{{ collection.url }}</a></span
                      >
                    </td>
                  </tr>
                  <report-list-row :data="mainContent.Size">Size:</report-list-row>
                  <tr v-if="mainContent.Age && mainContent.Age.value">
                    <th scope="row" class="pr-1">Age:</th>
                    <td>{{ mainContent.Age.value }}</td>
                  </tr>
                  <report-list-row :data="mainContent.Type">Type:</report-list-row>
                  <report-list-row :data="mainContent.Sex">Sex:</report-list-row>
                  <report-list-row :data="mainContent.Materials">Materials:</report-list-row>
                  <report-list-row :data="mainContent.Storage">Storage:</report-list-row>
                  <report-list-row :data="mainContent.Data">Data:</report-list-row>
                  <report-list-row :data="mainContent.Diagnosis">Diagnosis:</report-list-row>
                  <report-list-row :data="mainContent.DataUse">Data use conditions:</report-list-row>
                </table>

                <!-- Recursive set of subcollections -->
                <div v-if="collection.sub_collections && collection.sub_collections.length" class="mt-2">
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
import ReportDescription from '@/components/report-components/ReportDescription'
import ReportTitle from '@/components/report-components/ReportTitle'
import ReportListRow from '@/components/report-components/ReportListRow'
import ReportSubCollection from '@/components/report-components/ReportSubCollection'
import CollectionReportInfoCard from '@/components/cards/CollectionReportInfoCard'
import CollectionSelector from '@/components/buttons/CollectionSelector'
import { mapDetailsTableContent, mapCollectionsData, collectionReportInformation } from '@/utils/templateMapper'
import { mapCollectionsData as mapCollectionsToJsonLD } from '@/utils/bioschemasMapper'

export default {
  name: 'CollectionReport',
  components: {
    ReportListRow,
    ReportTitle,
    ReportDescription,
    ReportSubCollection,
    CollectionReportInfoCard,
    Loading,
    CollectionSelector
  },
  methods: {
    ...mapActions(['GetCollectionReport']),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ collection: 'collectionReport', isLoading: 'isLoading' }),
    mainContent () {
      return this.collection ? mapDetailsTableContent(this.collection) : {}
    },
    isTopLevelCollection () {
      return this.collection.parent_collection === undefined
    },
    info () {
      return collectionReportInformation(this.collection)
    },
    subCollections () {
      return this.collection && this.collection.sub_collections && this.collection.sub_collections.length
        ? mapCollectionsData(this.collection.sub_collections)
        : []
    },
    collectionId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    },
    jsonld () {
      return this.collection ? mapCollectionsToJsonLD(this.collection) : {}
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
    console.log(this.jsonld)
  }
}
</script>

<style scoped>
>>> .mg-report-details-list th {
  vertical-align: top;
}
</style>
