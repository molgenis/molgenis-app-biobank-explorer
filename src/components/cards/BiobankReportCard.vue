<template>
  <div>
    <router-link :to="{path: '/biobanks', query: query}">Back to searching through biobanks</router-link>

    <div class="card biobank-card">
      <div class="card-header">
        <h4>{{biobank.name}}</h4>
        <p>{{biobank.description}}</p>
        <p v-if="biobank.contact"> <b>Contact: </b>{{biobank.contact.email}} </p>
        <p v-if="biobank.country"> <b>Contact: </b>{{biobank.country.name}} </p>
      </div>

      <div class="card-block">
        <div class="card">
          <div class="card-header more-info-header" @click.prevent="toggle">
            <i class="fa fa-caret-right" aria-hidden="true" v-if="collapsed"></i>
            <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
            More information
          </div>
          <div class="card-body" v-if="!collapsed">
            <dl class="row" v-for="key in Object.keys(biobank)" v-if="showThisKey(key)">
              <dt class="col-sm-3">{{ key }}</dt>
              <dd class="col-sm-9">{{ biobank[key] }}</dd>
            </dl>
          </div>
        </div>

        <h4 class="collection-header">Collections</h4>
        <collections-table :collections="biobank.collections"></collections-table>
      </div>
    </div>
  </div>
</template>

<style>
  .collection-header {
    padding: 1rem;
  }

  .more-info-header {
    background-color: #ffffff;
  }

  .biobank-card {
    margin-top: 1em;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable'

  import { mapState } from 'vuex'
  import { GET_BIOBANK_REPORT } from '../../store/actions'

  export default {
    name: 'biobank-report-card',
    data () {
      return {
        collapsed: true
      }
    },
    methods: {
      showThisKey (key) {
        return key !== 'collections' && key !== 'country' && key !== '_href' && key !== 'contact'
      },
      toggle () {
        this.collapsed = !this.collapsed
      }
    },
    computed: {
      ...mapState({
        biobank: 'biobankReport'
      }),
      query () {
        return this.$route.query
      }
    },
    components: {
      CollectionsTable
    },
    beforeCreate () {
      const biobankId = this.$route.params.id
      this.$store.dispatch(GET_BIOBANK_REPORT, biobankId)
    }
  }
</script>
