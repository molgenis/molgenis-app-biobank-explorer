<template>
  <div>
    <router-link :to="{path: '/biobanks', query: query}">Back to full list of biobanks</router-link>

    <div class="card biobank_report">
      <div class="card-block">
        <h4>{{biobank.name}}</h4>
        <p>{{biobank.description}}</p>
        <p v-if="biobank.contact">
          <b>Contact: </b>{{biobank.contact.email}}
        </p>
      </div>

      <hr>
      <collapsable-pane :biobank="biobank"></collapsable-pane>
      <hr>

      <div class="card-block">
        <h4>Collections</h4>
      </div>
    </div>
  </div>
</template>

<style>
  .biobank_report {
    background-color: #f2f2f2;
    margin-top: 1em;
  }
</style>

<script>
  import CollapsablePane from './CollapsablePane'
  import { GET_BIOBANKS_AND_COLLECTIONS } from '../store/actions'
  import { MAP_QUERY_TO_STATE } from '../store/mutations'
  import { mapGetters } from 'vuex'

  export default {
    name: 'biobank-report',
    computed: {
      ...mapGetters({
        biobank: 'getSelectedBiobank',
        query: 'getCompleteQuery'
      })
    },
    components: {
      CollapsablePane
    },
    beforeCreate: function () {
      if (!this.$store.state.biobanks) {
        this.$store.dispatch(GET_BIOBANKS_AND_COLLECTIONS)
      }
    },
    mounted: function () {
      const query = this.$store.state.route.query
      if (query) {
        this.$store.commit(MAP_QUERY_TO_STATE, query)
      }
    }
  }
</script>
