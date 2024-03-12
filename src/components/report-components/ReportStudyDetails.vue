<template>
  <div>
    <report-description
      :description="study.description"
      :maxLength="500"></report-description>

    <!-- study information -->
    <view-generator :viewmodel="studyModel.viewmodel" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getStudyDetails } from '../../utils/templateMapper'
import ReportDescription from '../report-components/ReportDescription.vue'
import ViewGenerator from '../generators/ViewGenerator.vue'

export default {
  name: 'ReportStudyDetails',
  props: {
    study: {
      type: Object,
      required: true
    }
  },
  components: {
    ReportDescription,
    ViewGenerator
  },
  computed: {
    ...mapState(['studyColumns']),
    studyModel () {
      return this.study
        ? getStudyDetails(this.study)
        : {}
    }
  }
}
</script>
