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

      <collapsable-pane
        paneTitle="More information"
        :excluded="['name', 'description', 'contact']"
        :entity="biobank">
      </collapsable-pane>

      <div class="card-block">
        <h4>Collections</h4>
        <collection-overview
          filterKey=""
          :columns="['name', 'type', 'materials', 'order_of_magnitude', 'standards']"
          :collections="biobank.collections">
        </collection-overview>
      </div>
    </div>

  </div>
</template>

<style lang="scss">
  @import "~variables";
  @import "~mixins";

  .biobank_report {
    background-color: $gray-lightest;
    margin-top: 1em;
  }
</style>

<script>
  import CollapsablePane from './CollapsablePane'
  import CollectionOverview from './CollectionOverview'
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
      CollapsablePane,
      CollectionOverview
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
