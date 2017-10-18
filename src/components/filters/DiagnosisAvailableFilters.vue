<template>
  <div class="card">
    <div class="card-header">
      Diagnosis available
    </div>
    <div class="card-body">
      <multiselect
        v-model="filters"
        :options="options"
        :multiple="true"
        :searchable="true"
        :hideSelected="true"
        @search-change="getDiagnosisOptions"
        placeholder="Type to search"
        label="label"
      ></multiselect>
    </div>
  </div>
</template>

<script>
  import { QUERY_DIAGNOSIS_AVAILABLE } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'

  import Multiselect from 'vue-multiselect'

  export default {
    name: 'diagnosis-available-filters',
    data () {
      return {
        collapsed: true,
        filters: []
      }
    },
    methods: {
      toggle () {
        this.collapsed = !this.collapsed
      },
      getDiagnosisOptions (query) {
        this.$store.dispatch(QUERY_DIAGNOSIS_AVAILABLE, query)
      }
    },
    computed: {
      ...mapGetters({
        options: 'getDiagnosisAvailableOptions'
      })
    },
    watch: {
      filters (filters) {
        this.$store.commit(UPDATE_FILTER, {name: 'diagnosis_available', filters: filters})
      }
    },
    components: {
      Multiselect
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
