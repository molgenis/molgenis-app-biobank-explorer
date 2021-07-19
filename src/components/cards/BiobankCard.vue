<template>
  <div
    :class="[{ 'border-secondary': biobankInSelection }, 'card biobank-card']">
    <div
      class="card-header biobank-card-header"
      @click.prevent="collapsed = !collapsed">
      <div class="row">
        <div class="collapse-column" v-if="!loading">
          <font-awesome-icon
            icon="caret-right"
            :style="iconStyle"
            class="collapse-button mr-2"
          />
        </div>
        <div class="col-md-5 d-flex flex-column" v-if="!loading">
          <div class="mb-2">
            <h5>
              <router-link :to="'/biobank/' + biobank.id">
                <span
                  class="fa fa-table mr-2 icon-alignment"
                  aria-hidden="true"
                  aria-labelledby="biobank-name"></span>
              </router-link>
              <span id="biobank-name">{{ biobank.name }}</span>
            </h5>

            <small v-if="biobank.quality && biobank.quality.length > 0">
              <info-popover label="Quality mark(s):" bold-text icon-before-label>
                <table>
                  <tbody>
                    <tr
                      :key="`${biobank.id}-${quality.label}`"
                      v-for="quality in biobank.quality">
                      <td class="text-nowrap align-top font-weight-bold p-2">
                        {{ quality.label }}
                      </td>
                      <td class="py-2">
                        {{ qualityStandardsDictionary[quality.label] }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </info-popover>
              <quality-column
                :qualities="biobank.quality"
                :spacing="0"></quality-column>
            </small>
            <span v-if="availableCovidTypes">
              <b-img
                class="biobank-icon covid-icon"
                :src="require('../../assets/custom_icons/covid19.png')"
                title="Covid-19"/>
            </span>
          </div>
          <collection-selector
            class="align-with-table mt-auto w-25"
            v-if="biobank.collections.length > 0"
            :collectionData="biobank.collections"
            icon-only
            router-enabled></collection-selector>
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
              <small>{{ availableCovidTypes }}</small>
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
        :collections="sortedCollections"></collections-table>
    </div>
  </div>
</template>

<script>
import CollectionSelector from '../buttons/CollectionSelector'
import CollectionsTable from '../tables/CollectionsTable.vue'
import { mapGetters, mapState } from 'vuex'
import utils from '../../utils'
import { sortCollectionsByName } from '../../utils/sorting'
import QualityColumn from '../tables/QualityColumn'
import 'array-flat-polyfill'
import InfoPopover from '../popovers/InfoPopover.vue'

export default {
  name: 'biobank-card',
  components: {
    CollectionsTable,
    QualityColumn,
    CollectionSelector,
    InfoPopover
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
    ...mapState(['qualityStandardsDictionary']),
    ...mapGetters(['selectedCollections']),
    biobankInSelection () {
      if (!this.biobank.collections) return false

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
  /* background-color: #e4e4e4; */
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

/* can go: */

/* Add popover overrides so that it is always clearly visible in any theme (even custom ones) */
.quality-marks-popover {
  background-color: white !important;
  border: solid black 0.5px;
  max-width: 40rem;
}

.quality-marks-popover[x-placement^='top'] > .arrow::before {
  border-top-color: black !important;
}
.quality-marks-popover[x-placement^='top'] > .arrow::after {
  border-top-color: white !important;
}

.quality-marks-popover[x-placement^='bottom'] > .arrow::before {
  border-bottom-color: black !important;
}
.quality-marks-popover[x-placement^='bottom'] > .arrow::after {
  border-bottom-color: white !important;
}

.popover-trigger-area {
  position: relative;
}

/* for touch screens, so you have a nice area to press and still get a popover */
.popover-trigger-area::after {
  content: '';
  position: absolute;
  top: -0.5rem;
  bottom: -1rem;
  right: -7rem;
  left: -0.5rem;
}

.collapse-column {
  margin-left: 10px;
  margin-right: 6px;
  display: table-cell !important;
  vertical-align: middle;
}

.collapse-button {
  cursor: pointer;
}
</style>
