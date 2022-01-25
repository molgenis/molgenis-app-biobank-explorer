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

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'biobank-explorer',
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
    this.MapQueryToState()
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
</style>
