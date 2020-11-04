<template>
  <div></div>
  <!--
  <multiselect
    id="disease-type-select"
    :internalSearch="false"
    v-model="filters"
    :options="options"
    :multiple="true"
    :searchable="true"
    :hideSelected="true"
    track-by="code"
    @search-change="getDiagnosisOptions"
    placeholder="Type to search"
    :limit="10"
    :limitText="getLimitText"
    label="label"
    selectLabel
  ></multiselect>
  -->
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
  border: none;
  border-left: 1px solid #e8e8e8;
}

.multiselect__select::before {
  display: none;
}

.multiselect--above .multiselect__content-wrapper {
  border-top: none;
}
</style>

<script>
import { mapGetters } from 'vuex'
// import Multiselect from 'vue-multiselect'

export default {
  name: 'diagnosis-available-filters',
  methods: {
    getDiagnosisOptions (query) {
      this.$store.dispatch('QueryDiagnosisAvailableOptions', query)
    },
    getLimitText (count) {
      return `and ${count} more`
    }
  },
  computed: {
    ...mapGetters({
      options: 'getDiagnosisAvailableOptions'
    }),
    filters: {
      get () {
        return this.$store.state.filters.selections.diagnosis_available
      },
      set (value) {
        this.$store.commit('UpdateFilter', {
          name: 'diagnosis_available',
          filters: value
        })
      }
    }
  },
  watch: {
    filters (filters) {
      const updatedRouteQuery = Object.assign(
        {},
        this.$store.state.route.query,
        {
          diagnosis_available:
            filters.length === 0
              ? undefined
              : filters.map(filter => filter.code).join(',')
        }
      )
      this.$router.push({ query: updatedRouteQuery })
    }
  },
  components: {
    // Multiselect
  }
}
</script>
