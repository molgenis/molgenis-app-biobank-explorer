<template>
  <div class="card">
    <div class="card-header" @click.prevent="toggle">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      Diagnosis available
    </div>
    <div class="card-body" v-if="!collapsed">
      <multiselect
        v-model="filters"
        :options="options"
        :multiple="true"
        :searchable="true"
        :hideSelected="true"
        track-by="code"
        @search-change="getDiagnosisOptions"
        placeholder="Type to search"
        label="label"
      ></multiselect>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  .multiselect__tag {
    text-overflow: ellipsis;
    max-width: 10em;
    overflow: hidden;
  }
</style>

<script>
  import { QUERY_DIAGNOSIS_AVAILABLE, GET_BIOBANK_IDENTIFIERS } from '../../store/actions'
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapGetters } from 'vuex'

  import Multiselect from 'vue-multiselect'

  export default {
    name: 'diagnosis-available-filters',
    data () {
      return {
        collapsed: false
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
      }),
      filters: {
        get () {
          return this.$store.state.diagnosis_available.filters
        },
        set (filters) {
          this.$store.commit(UPDATE_FILTER, {name: 'diagnosis_available', filters: filters})
        }
      }
    },
    watch: {
      filters () {
        this.$store.dispatch(GET_BIOBANK_IDENTIFIERS)
      }
    },
    components: {
      Multiselect
    }
  }
</script>


