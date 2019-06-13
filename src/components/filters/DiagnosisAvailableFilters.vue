<template>
  <div class="card filter-card">
    <div class="card-header filter-header" @click.prevent="collapsed = !collapsed">
      <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      Diagnosis available
    </div>
    <div class="card-body" v-if="!collapsed">
      <multiselect
        id="disease-type-select"
        v-model="filters"
        :options="options"
        :multiple="true"
        :hideSelected="true"
        track-by="code"
        placeholder="Type to search"
        label="label"
        :custom-label="searchableFields"
      ></multiselect>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  .multiselect__tag {
    max-width: 10em;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .multiselect__content-wrapper {
    width: 250%;
  }
</style>

<script>
  import { UPDATE_FILTER } from '../../store/mutations'
  import { mapState } from 'vuex'

  import Multiselect from 'vue-multiselect'

  export default {
    name: 'diagnosis-available-filters',
    data () {
      return {
        collapsed: false
      }
    },
    methods: {
      searchableFields ({code, label}) {
        return `${code} - ${label}`
      },
      getLimitText (count) {
        return `and ${count} more`
      }
    },
    computed: {
      ...mapState({
        options: 'diagnoses'
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
      filters (filters) {
        const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {diagnosis_available: filters.length === 0 ? undefined : filters.map(filter => filter.code).join(',')})
        this.$router.push({query: updatedRouteQuery})
      }
    },
    components: {
      Multiselect
    }
  }
</script>


