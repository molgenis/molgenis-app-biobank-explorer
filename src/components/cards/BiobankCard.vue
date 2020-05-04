<template>
  <div class="card biobank-card">
    <div class="card-header biobank-card-header" @click.prevent="collapsed = !collapsed">
      <div class="row">
        <div class="col-md-5" v-if="!loading">
          <h5>
            <router-link :to="'/biobank/' + biobank.id">
              <i class="fa fa-table" aria-hidden="true" aria-labelledby="biobank-name"></i>
            </router-link>
            <span id="biobank-name">{{ biobank.name }}</span>
          </h5>
          <small v-if="biobank.quality && biobank.quality.length > 0">
            <quality-column :qualities="biobank.quality" :spacing="0"></quality-column>
          </small>
          <span v-if="availableCovidTypes">
            <b-img
              class="biobank-icon covid-icon"
              :src="require('../../assets/custom_icons/covid19.png')"
              title="Covid-19"
            />
          </span>
        </div>
        <div class="col-md-7" v-if="!loading">
          <p>
            <small>
              <b>Collection types:</b>
            </small>
            <small>{{ collectionTypes }}</small>
            <br />
            <small>
              <b>Juridical person:</b>
            </small>
            <small>{{ biobank['juridical_person'] }}</small>
            <template v-if="availableCovidTypes">
              <br />
              <small>
                <b>Covid-19:</b>
              </small>
              <small :key="type + index" v-for="(type, index) of availableCovidTypes">{{type}}</small>
            </template>
          </p>
        </div>
        <div v-else class="col-md-12 text-center">
          <i class="fa fa-spinner fa-spin" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <div class="card-body table-card" v-if="!collapsed && !loading">
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
    biobank: {
      type: [Object, String]
    },
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
    loading () {
      return typeof this.biobank === 'string'
    },
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
      } else return ''
    }
  },
  components: {
    CollectionsTable,
    QualityColumn
  }
}
</script>
