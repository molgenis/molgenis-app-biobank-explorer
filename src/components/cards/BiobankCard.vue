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
          <small v-if="biobank.quality && biobank.quality.length > 0"><quality-column :qualities="biobank.quality" :spacing=0></quality-column></small>
        </div>
        <div class="col-md-7">
          <p>
            <small><b>Collection types: </b></small>
            <small>{{ collectionTypes }}</small>
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
  import utils from '../../utils'
  import QualityColumn from '../tables/QualityColumn'
  import 'array-flat-polyfill'

  export default {
    name: 'biobank-card',
    props: {
      'biobank': Object,
      'initCollapsed': {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        collapsed: this.initCollapsed
      }
    },
    computed: {
      collectionTypes () {
        const getSubCollections = (collection) => [collection, ...collection.sub_collections.flatMap(getSubCollections)]
        const types = this.biobank.collections
          .flatMap(getSubCollections)
          .flatMap(collection => collection.type)
          .map(type => type.label)
        return utils.getUniqueIdArray(types).join(', ')
      }
    },
    components: {
      CollectionsTable, QualityColumn
    }
  }
</script>
