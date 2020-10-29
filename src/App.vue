<template>
  <div>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({ errorMessage: 'getErrorMessage' })
  },
  methods: {
    ...mapActions([
      'GetNegotiatorType',
      'GetNegotiatorEntities'
    ])
  },
  mounted () {
    this.GetNegotiatorType()
    this.GetNegotiatorEntities()
  },
  name: 'biobank-explorer'
}
</script>
