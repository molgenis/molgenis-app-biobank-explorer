<template>
  <div class="container mg-collection-report-card">
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
                <div class="mb-2" v-if="isTopLevelCollection">
                  <input
                    type="checkbox"
                    id="add-to-cart"
                    name="add-to-cart"
                    @input="handleCollectionStatus"
                    :checked="collectionSelected(collection.id)"
                    :value="{ label: collection.label || collection.name, value: collection.id }"
                    hidden
                  />
                  <label id="add-to-cart-label" class="btn btn-success" for="add-to-cart"
                    >Add to selection<span class="ml-2 fa fa-plus"></span
                  ></label>
                  <label id="remove-from-cart-label" class="btn btn-danger" for="add-to-cart"
                    >Remove from selection<span class="ml-2 fa fa-times"></span
                  ></label>
                </div>

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
                  <report-list-row :data="mainContent.DataUse">Data use:</report-list-row>
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import ReportDescription from '@/components/report-components/ReportDescription'
import ReportTitle from '@/components/report-components/ReportTitle'
import ReportListRow from '@/components/report-components/ReportListRow'
import ReportSubCollection from '@/components/report-components/ReportSubCollection'
import CollectionReportInfoCard from '@/components/cards/CollectionReportInfoCard'

import { mapDetailsTableContent, mapCollectionsData, collectionReportInformation } from '@/utils/templateMapper'

export default {
  name: 'CollectionReport',
  components: {
    ReportListRow,
    ReportTitle,
    ReportDescription,
    ReportSubCollection,
    CollectionReportInfoCard,
    Loading
  },
  methods: {
    ...mapActions(['GetCollectionReport']),
    ...mapMutations(['AddCollectionToSelection', 'RemoveCollectionFromSelection']),
    collectionSelected (collectionId) {
      return this.selectedCollections.map(sc => sc.value).indexOf(collectionId) >= 0
    },
    handleCollectionStatus (event) {
      const checkbox = event.target
      if (checkbox.checked === true) {
        this.AddCollectionToSelection(checkbox._value)
      } else {
        this.RemoveCollectionFromSelection(checkbox._value)
      }
    },
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ collection: 'collectionReport', isLoading: 'isLoading' }),
    ...mapGetters(['selectedCollections']),
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

<style scoped>
.btn:hover {
  cursor: pointer;
}

#add-to-cart:checked ~ #add-to-cart-label {
  display: none;
}

#remove-from-cart-label {
  display: none;
}

#add-to-cart:checked ~ #remove-from-cart-label {
  display: inline-block;
}

>>> .mg-report-details-list th {
  vertical-align: top;
}
</style>
