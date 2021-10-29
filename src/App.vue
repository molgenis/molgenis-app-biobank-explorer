<template>
  <div @click="$root.$emit('bv::hide::popover')">
    <div class="container">
      <b-alert v-if="errorMessage" show variant="danger" dismissible>
        {{ errorMessage }}
      </b-alert>
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
.mg-page-content {
  padding-top: 0 !important;
}
</style>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters({ errorMessage: 'getErrorMessage', loading: 'loading' })
  },
  methods: {
    ...mapMutations(['MapQueryToState', 'ConfigureFilters']),
    ...mapActions([
      'GetNegotiatorType',
      'GetNegotiatorEntities',
      'GetQualityStandardInformation'
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
  },
  mounted () {
    this.GetNegotiatorType()
    this.GetNegotiatorEntities()
    this.GetQualityStandardInformation()
  },
  name: 'biobank-explorer'
}
</script>
