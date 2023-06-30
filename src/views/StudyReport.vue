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
          <nav aria-label="breadcrumb" v-if="study">
            <ol class="breadcrumb my-1">
              <li class="breadcrumb-item">
                <router-link
                  to="/"
                  title="Back to biobank explorer">
                  {{ uiText["home"] }}
                </router-link>
              </li>
              <!-- <li class="breadcrumb-item">
                <router-link
                  :to="'/collection/' + study.collection.biobank.id"
                  :title="'Go to biobank ' + study.collection.biobank.name">
                  {{ study.collection.biobank.name }}
                </router-link>
              </li> -->
              <li class="breadcrumb-item">
                <router-link
                  :to="'/collection/' + study.collection.id"
                  :title="'Go to collection ' + study.collection.name">
                  {{ study.collection.name }}
                </router-link>
              </li>
              <li class="breadcrumb-item active text-dark" aria-current="page">
                {{ study.name }}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row" v-if="study && !this.isLoading">
        <div class="col">
          <report-title type="Study" :name="study.name">
          </report-title>

          <div class="container p-0">
            <div class="row">
              <div class="col-md-8">
                <report-study-details :study="study" />
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
import StudyReportInfoCard from '../components/cards/StudyReportInfoCard'
import { studyReportInformation } from '../utils/templateMapper'
import ReportStudyDetails from '../components/report-components/ReportStudyDetails.vue'

export default {
  name: 'StudyReport',
  components: {
    ReportTitle,
    StudyReportInfoCard,
    Loading,
    ReportStudyDetails
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
    studyId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
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
