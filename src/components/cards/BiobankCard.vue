<template>
  <div
    :class="[{ 'border-secondary': biobankInSelection }, 'card biobank-card']">
    <div
      class="card-header biobank-card-header"
      @click.prevent="collapsed = !collapsed">
      <div class="row" v-if="!loading">
        <div class="col-6 d-flex">
          <div class="mr-3">
            <font-awesome-icon
              icon="caret-right"
              :style="iconStyle"
              class="collapse-button"/>
          </div>
          <div class="mb-2">
            <h5>
              <router-link :to="'/biobank/' + biobank.id">
                <span
                  class="fa fa-table mr-2 icon-alignment text-dark"
                  aria-hidden="true"
                  aria-labelledby="biobank-name"></span>
                <span id="biobank-name">{{ biobank.name }}</span>
              </router-link>
            </h5>
            <small>
              <quality :attribute="biobank" summary />
            </small>
            <span
              v-if="biobank.covid19biobank && biobank.covid19biobank.length > 0">
              <b-img
                class="biobank-icon covid-icon"
                :src="require('../../assets/custom_icons/covid19.png')"
                title="Covid-19"/>
            </span>
          </div>
        </div>
        <div class="col-5">
          <small>
            <view-generator :viewmodel="biobankcardViewmodel" />
          </small>
        </div>
        <div class="col-1 px-1">
          <collection-selector
            class="mt-auto text-right"
            v-if="biobank.collections.length > 0"
            :collectionData="biobank.collections"
            icon-only
            bookmark
            @checked="handleCheckAll"></collection-selector>
        </div>
      </div>
      <div v-else class="col-12 text-center">
        <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
      </div>
    </div>
    <div class="card-body table-card" v-if="!collapsed && !loading">
      <collections-table
        v-if="biobank.collections.length > 0"
        :collections="sortedCollections"></collections-table>
    </div>
  </div>
</template>

<script>
import CollectionSelector from '../buttons/CollectionSelector'
import CollectionsTable from '../tables/CollectionsTable.vue'
import quality from '../generators/view-components/quality.vue' /* soon will turn into a generated view */
import { mapGetters, mapState } from 'vuex'
import { sortCollectionsByName } from '../../utils/sorting'
import { getBiobankDetails } from '../../utils/templateMapper'
import ViewGenerator from '../generators/ViewGenerator.vue'

export default {
  name: 'biobank-card',
  components: {
    CollectionsTable,
    quality,
    CollectionSelector,
    ViewGenerator
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
  methods: {
    handleCheckAll: function (checked) {
      if (checked === true) {
        this.collapsed = false
      }
    }
  },
  computed: {
    ...mapState(['qualityStandardsDictionary', 'biobankColumns']),
    ...mapGetters(['selectedCollections']),
    biobankcardViewmodel () {
      const { viewmodel } = getBiobankDetails(this.biobank)
      const attributes = []

      for (const item of this.biobankColumns) {
        if (item.showOnBiobankCard) {
          attributes.push(
            viewmodel.attributes.find(vm => vm.label === item.label)
          )
        }
      }
      return { attributes }
    },
    biobankInSelection () {
      if (!this.biobank.collections) return false

      const biobankCollectionSelection = this.biobank.collections
        .filter(bcf => !bcf.parent_collection)
        .map(bc => ({ label: bc.label || bc.name, value: bc.id }))
      return this.selectedCollections
        .map(sc => sc.value)
        .some(id => biobankCollectionSelection.map(pc => pc.value).includes(id))
    },
    sortedCollections () {
      return sortCollectionsByName(this.biobank.collections)
    },
    loading () {
      return typeof this.biobank === 'string'
    },
    iconStyle () {
      return {
        transform: `rotate(${this.collapsed ? 0 : 90}deg)`,
        transition: 'transform 0.2s'
      }
    }
  }
}
</script>

<style>
.table-card {
  padding: 0.1rem;
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
  left: 2px;
}
</style>
