<template>
  <div @click="$root.$emit('bv::hide::popover')" :class="{ 'molgenis-negative-top-margin': removeFreemarkerMargin }">
      <b-alert v-if="errorMessage" show variant="danger" dismissible>
        {{ errorMessage }}
      </b-alert>
      <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'biobank-explorer',
  computed: {
    ...mapGetters({ errorMessage: 'getErrorMessage', loading: 'loading' }),
    ...mapState(['removeFreemarkerMargin'])
  },
  methods: {
    ...mapMutations(['MapQueryToState', 'ConfigureFilters']),
    ...mapActions([
      'GetNegotiatorType',
      'GetNegotiatorEntities',
      'GetQualityStandardInformation',
      'GetApplicationContext'
    ])
  },
  watch: {
    $route () {
      this.MapQueryToState()
    },
    loading (loading) {
      if (!loading) {
        this.MapQueryToState()
      }
    }
  },
  beforeMount () {
    this.ConfigureFilters()
    this.MapQueryToState()
    this.GetApplicationContext()
  },
  mounted () {
    this.GetNegotiatorType()
    this.GetNegotiatorEntities()
    this.GetQualityStandardInformation()
  }
}
</script>

<style>
.mg-page-content {
  padding-top: 0 !important;
}

body {
  background-color: #fafafa;
}

.custom-control-label::before {
  border-color: black; /* makes checkboxes stand out more for better UX */
}

/* Countering freemarker container */
.molgenis-negative-top-margin {
  margin-top: -2rem;
}
</style>
