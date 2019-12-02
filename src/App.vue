<template>
  <div>
    <div class="container">
      <b-alert v-if="error" show variant="danger" dismissible>{{errorMessage}}</b-alert>
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
  .mg-page-content {
    padding-top: 0!important;
  }
</style>

<script>
  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState(['error']),
      errorMessage () {
        if (!this.error) {
          return ''
        }
        if (this.error.errors) {
          return this.error.errors[0].message
        }
        if (this.error.message) {
          return this.error.message
        }
        return 'Something went wrong'
      }
    },
    name: 'biobank-explorer'
  }
</script>
