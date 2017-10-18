<template>
  <multiselect
    v-model="selectedDiseases"
    :options="options"
    :multiple="true"
    :searchable="true"
    :hideSelected="true"
    @search-change="queryDiseaseTypes"
    placeholder="Type to search"
    label="label"
  ></multiselect>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import { QUERY_DISEASE_TYPES, GET_BIOBANK_IDENTIFIERS } from '../store/actions'

  export default {
    name: 'filter-multiselect',
    props: ['options'],
    components: {
      Multiselect
    },
    methods: {
      queryDiseaseTypes (query) {
        this.$store.dispatch(QUERY_DISEASE_TYPES, query)
      }
    },
    computed: {
      selectedDiseases: {
        get () {
          return this.$store.state.filters.disease_types.selectedOptions
        },
        set (selectedOptions) {
          this.$store.dispatch(GET_BIOBANK_IDENTIFIERS, {
            options: selectedOptions.map(option => option.code),
            attribute: 'disease_types'
          })
        }
      }
    }
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
