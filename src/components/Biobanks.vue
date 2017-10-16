<template>
  <div id="biobanks">
    <h4 v-if="loading">Loading Biobanks... <i class="fa fa-spinner fa-pulse"></i></h4>
    <biobank v-if="biobank.collections.length > 0 && !loading"
             v-for="biobank in biobanks"
             :key="biobank.id"
             :biobank="biobank">
    </biobank>
  </div>
</template>

<style>
  #biobanks {
    width: 100%;
    height: 100vh;
    overflow: auto;
  }
</style>

<script>
  import Biobank from './Biobank'
  import { mapGetters } from 'vuex'

  export default {
    name: 'biobanks',
    computed: {
      ...mapGetters({
        biobanks: 'getFilteredBiobanks',
        loading: 'getLoading'
      })
    },
    components: {Biobank}
  }
</script>
