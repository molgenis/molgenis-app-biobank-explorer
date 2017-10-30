<template>
  <div class="card biobank-card">
    <div class="card-header biobank-card-header" @click.prevent="collapsed = !collapsed">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <router-link :to="'/biobank/report/' + biobank.id">
              <i class="fa fa-table"></i>
            </router-link>
            {{ biobank.name }}
          </h5>
        </div>
        <div class="col-md-7">
          <p>
            <small><b>Biobank type: </b></small>
            <small>{{ biobankTypes }}</small>
            <br>
            <small><b>Juridical person: </b></small>
            <small>{{ biobank['juridical_person'] }}</small>
          </p>
        </div>
      </div>
    </div>

    <div class="card-body table-card" v-if="!collapsed">
      <collections-table
        v-if="biobank.collections.length > 0"
        :collections="biobank.collections">
      </collections-table>
    </div>
  </div>
</template>

<style>
  .table-card {
    padding: 0.1rem;
  }

  .biobank-card {
    margin-bottom: 1em;
  }

  .biobank-card-header {
    background-color: #f5f5f5;
  }

  .biobank-card-header:hover {
    cursor: pointer;
    background-color: #e4e4e4;
  }
</style>

<script>
  import CollectionsTable from '../tables/CollectionsTable.vue'
  import utils from 'src/utils'

  export default {
    name: 'biobank-card',
    props: ['biobank'],
    data () {
      return {
        collapsed: true
      }
    },
    methods: {
      toggle () {
        this.collapsed = !this.collapsed
      }
    },
    computed: {
      query () {
        return this.$route.query
      },
      biobankTypes () {
        return utils.getUniqueIdArray(this.biobank.collections.reduce((accumulator, collection) => {
          return accumulator.concat(collection.type.map(type => type.label))
        }, [])).join(', ')
      }
    },
    components: {
      CollectionsTable
    }
  }
</script>
