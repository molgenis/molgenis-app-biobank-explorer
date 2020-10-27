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
import { GET_NEGOTIATOR_ENTITIES, GET_NEGOTIATOR_TYPE } from './store/actions'

export default {
  computed: {
    ...mapGetters({ errorMessage: 'getErrorMessage' })
  },
  methods: {
    ...mapActions({
      getNegotiatorType: GET_NEGOTIATOR_TYPE,
      getNegotiatorEntities: GET_NEGOTIATOR_ENTITIES
    })
  },
  mounted () {
    this.getNegotiatorType()
    this.getNegotiatorEntities()
  },
  name: 'biobank-explorer'
}
</script>
