<template>
  <div @click="$root.$emit('bv::hide::popover')">
    <div class="container">
      <b-alert v-if="errorMessage" show variant="danger" dismissible>{{errorMessage}}</b-alert>
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
    ...mapGetters({ errorMessage: 'getErrorMessage' })
  },
  methods: {
    ...mapMutations(['MapQueryToState']),
    ...mapActions([
      'GetNegotiatorType',
      'GetNegotiatorEntities',
      'GetQualityStandardInformation'
    ])
  },
  watch: {
    $route () {
      this.MapQueryToState()
    }
  },
  mounted () {
    this.GetNegotiatorType()
    this.GetNegotiatorEntities()
    this.GetQualityStandardInformation()
    this.MapQueryToState()
  },
  name: 'biobank-explorer'
}
</script>
