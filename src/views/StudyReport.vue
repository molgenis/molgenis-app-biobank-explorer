<template>
  <div class="container mg-collection-report-card pb-4">
    <loading
      :active="isLoading"
      loader="dots"
      :is-full-page="true"
      color="var(--secondary)"
      background-color="var(--light)"></loading>
    <div class="container-fluid">
      <div class="row">
        <div class="col my-3 shadow-sm">
          <div class="row">
            <div class="col">
              <!-- Back to previous page buttons -->
              <button class="btn btn-link" @click="back">
                <i class="fa fa-angle-left mr-1" aria-hidden="true"></i>
                <span>{{ uiText["back"] }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="study && !this.isLoading">
        <div class="col">
          <report-title type="Study" :name="study.title">
          </report-title>

          <div class="container p-0">
            <div class="row">
              <div class="col-md-8">
                <report-study-details :study="study" />

                <h3 class="mt-4">Collections with samples of the study</h3>
                <div class="pt-3">
                  <div
                    v-for="(collection, index) in collectionsData"
                    :key="collection.id">
                    <hr v-if="index" />
                    <collection-title
                      :title="collection.name"
                      :id="collection.id"/>
                    <view-generator :viewmodel="collection.viewmodel" />
                  </div>
                </div>
              </div>
                <!-- Right side card -->
              <study-report-info-card
                :info="info"></study-report-info-card>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        {{ study }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import ReportTitle from '../components/report-components/ReportTitle'
import CollectionTitle from '../components/report-components/CollectionTitle'
import StudyReportInfoCard from '../components/cards/StudyReportInfoCard'
import ViewGenerator from '../components/generators/ViewGenerator'
import { studyReportInformation, getCollectionDetails } from '../utils/templateMapper'
import ReportStudyDetails from '../components/report-components/ReportStudyDetails.vue'
import { sortCollectionsByName } from '../utils/sorting'

export default {
  name: 'StudyReport',
  components: {
    ReportTitle,
    CollectionTitle,
    StudyReportInfoCard,
    Loading,
    ReportStudyDetails,
    ViewGenerator
  },
  methods: {
    ...mapActions(['GetStudyReport']),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ study: 'studyReport', isLoading: 'isLoading' }),
    ...mapGetters(['uiText']),
    info () {
      return studyReportInformation(this.study)
    },
    studyDataAvailable () {
      return Object.keys(this.study).length
    },
    studyId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    },
    collectionsData () {
      return this.studyDataAvailable && this.study.collections
        ? sortCollectionsByName(this.study.collections)
          .filter(it => !it.parent_collection)
          .map(col => getCollectionDetails(col))
        : []
    }
  },
  watch: {
    $route (to, from) {
      if (from.name.indexOf('study') >= 0) {
        location.reload()
      }
    }
  },
  mounted () {
    this.GetStudyReport([this.studyId])
  }
}
</script>
