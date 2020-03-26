<template>
  <div class="card biobank-card">
    <div class="card-header biobank-card-header" @click.prevent="collapsed = !collapsed">
      <div class="row">
        <div class="col-md-5">
          <h5>
            <router-link :to="'/biobank/' + biobank.id">
              <i class="fa fa-table" aria-hidden="true" aria-labelledby="biobank-name"></i>
            </router-link>
            <span id="biobank-name">{{ biobank.name }}</span>
          </h5>
          <small v-if="biobank.quality && biobank.quality.length > 0">
            <quality-column :qualities="biobank.quality" :spacing="0"></quality-column>
          </small>
          <span v-if="biobank.covid19biobank && biobank.covid19biobank.length > 0">
            <b-img
              class="biobank-icon covid-icon"
              :src="require('../../assets/custom_icons/covid19.png')"
              :title="availableCovidTypes"
            />
          </span>
        </div>
        <div class="col-md-7">
          <p>
            <small>
              <strong>Collection types:</strong>
            </small>
            <small>{{ collectionTypes }}</small>
            <br />
            <small>
              <strong>Juridical person:</strong>
            </small>
            <small>{{ biobank['juridical_person'] }}</small>
          </p>
        </div>
      </div>
    </div>

    <div class="card-body table-card" v-if="!collapsed">
      <collections-table v-if="biobank.collections.length > 0" :collections="biobank.collections"></collections-table>
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
.biobank-icon:hover {
  cursor: pointer;
}

.covid-icon {
  height: 1.5rem;
  width: auto;
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
    biobank: Object,
    initCollapsed: {
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
      const getSubCollections = collection => [
        collection,
        ...collection.sub_collections.flatMap(getSubCollections)
      ]
      const types = this.biobank.collections
        .flatMap(getSubCollections)
        .flatMap(collection => collection.type)
        .map(type => type.label)
      return utils.getUniqueIdArray(types).join(', ')
    },
    availableCovidTypes () {
      if (
        this.biobank.covid19biobank &&
        this.biobank.covid19biobank.length > 0
      ) {
        return this.biobank.covid19biobank
          .map(covidItem => covidItem.label || covidItem.name)
          .join(', ')
      }
    }
  },
  components: {
    CollectionsTable,
    QualityColumn
  }
}
</script>
