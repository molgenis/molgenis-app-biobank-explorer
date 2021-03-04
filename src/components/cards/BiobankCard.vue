<template>
  <div :class="[{'border-secondary': biobankInSelection},'card biobank-card']">
    <div
      class="card-header biobank-card-header"
      @click.prevent="collapsed = !collapsed"
    >
      <div class="row">
        <div class="col-md-5 d-flex flex-column" v-if="!loading">
          <div class="mb-2">
          <h5>
            <router-link :to="'/biobank/' + biobank.id">
              <span
                class="fa fa-table mr-2 icon-alignment"
                aria-hidden="true"
                aria-labelledby="biobank-name"
              ></span>
            </router-link>
            <span id="biobank-name">{{ biobank.name }}</span>
          </h5>

          <small v-if="biobank.quality && biobank.quality.length > 0">
            <quality-column
              :qualities="biobank.quality"
              :spacing="0"
            ></quality-column>
          </small>
          <span v-if="availableCovidTypes">
            <b-img
              class="biobank-icon covid-icon"
              :src="require('../../assets/custom_icons/covid19.png')"
              title="Covid-19"
            />
          </span>
          </div>
          <collection-selector
            class="align-with-table mt-auto w-25"
            v-if="biobank.collections.length > 0"
            :collections="biobank.collections"
            :checkboxId="biobank.name"
            icon-only
            router-enabled
          ></collection-selector>

        </div>
        <div class="col-md-6" v-if="!loading">
          <p>
            <small class="mr-2">
              <span class="font-weight-bold">Collection types:</span>
            </small>
            <small>{{ collectionTypes }}</small>
            <br />
            <small class="mr-2">
              <span class="font-weight-bold">Juridical person:</span>
            </small>
            <small>{{ biobank['juridical_person'] }}</small>
            <template v-if="availableCovidTypes">
              <br />
              <small class="mr-2">
                <span class="font-weight-bold">Covid-19:</span>
              </small>
              <small
                :key="type + index"
                v-for="(type, index) of availableCovidTypes"
                >{{ type }}</small
              >
            </template>
          </p>
        </div>
        <div v-else class="col-md-12 text-center">
          <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
        </div>
      </div>
    </div>
    <div class="card-body table-card" v-if="!collapsed && !loading">
      <collections-table
        v-if="biobank.collections.length > 0"
        :collections="sortedCollections"
      ></collections-table>
    </div>
  </div>
</template>

<script>
import CollectionSelector from '@/components/buttons/CollectionSelector'
import CollectionsTable from '../tables/CollectionsTable.vue'
import { mapGetters } from 'vuex'
import utils from '../../utils'
import { sortCollectionsByName } from '../../utils/sorting'
import QualityColumn from '../tables/QualityColumn'
import 'array-flat-polyfill'

export default {
  name: 'biobank-card',
  components: {
    CollectionsTable,
    QualityColumn,
    CollectionSelector
  },
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
      biobankSelected: false,
      collapsed: this.initCollapsed
    }
  },
  computed: {
    ...mapGetters(['selectedCollections']),
    biobankInSelection () {
      const biobankCollectionSelection = this.biobank.collections
        .filter((bcf) => !bcf.parent_collection)
        .map((bc) => ({ label: bc.label || bc.name, value: bc.id }))
      return this.selectedCollections
        .map((sc) => sc.value)
        .some((id) =>
          biobankCollectionSelection.map((pc) => pc.value).includes(id)
        )
    },
    sortedCollections () {
      return sortCollectionsByName(this.biobank.collections)
    },
    loading () {
      return typeof this.biobank === 'string'
    },
    collectionTypes () {
      const getSubCollections = (collection) => [
        collection,
        ...collection.sub_collections.flatMap(getSubCollections)
      ]
      const types = this.biobank.collections
        .flatMap(getSubCollections)
        .flatMap((collection) => collection.type)
        .map((type) => type.label)
      return utils.getUniqueIdArray(types).join(', ')
    },
    availableCovidTypes () {
      if (
        this.biobank.covid19biobank &&
        this.biobank.covid19biobank.length > 0
      ) {
        return this.biobank.covid19biobank
          .map((covidItem) => covidItem.label || covidItem.name)
          .join(', ')
      } else return ''
    }
  }
}
</script>

<style>
.table-card {
  padding: 0.1rem;
}
.align-with-table {
  margin-left: 0.1rem;
}

.added-to-selection {
  position: absolute;
  z-index: 2;
  top: 9px;
  right: -5px;
  background: white;
  border-radius: 50%;
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

.icon-alignment {
  position: relative;
  top: 1px;
}
</style>
