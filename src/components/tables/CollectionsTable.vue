<template>
  <table class="table table-condensed table-responsive">
    <thead>
      <tr>
        <th scope="col" class="pr-2">
          <input
            ref="header_checkbox"
            type="checkbox"
            v-model="selectedAllCollections"
            :indeterminate.prop="someCollectionsSelected"
          />
        </th>
        <th scope="col">Collection</th>
        <th scope="col">Type</th>
        <th scope="col">Materials</th>
        <th scope="col">Standards</th>
        <th scope="col">#Samples</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(collection, index) in topLevelElements">
        <tr :key="index">
          <td class="pr-1">
            <input
              type="checkbox"
              @input="handleCollectionStatus"
              :checked="collectionSelected(collection.id)"
              :value="{
                label: collection.label || collection.name,
                value: collection.id,
              }"
            />
          </td>
          <td
            :class="{
              'table-text-content-columns-has-sub': hasSubCollections(
                collection
              ),
              'table-text-content-columns': !hasSubCollections(
                collection
              ),
            }"
            v-for="(column, index) in columns"
            :key="index"
          >
            <span v-if="column === 'name'">
              <router-link :to="'/collection/' + collection['id']">
                <button
                  class="btn btn-link collection-link text-left pt-0 border-0"
                >
                  {{ collection[column] }}
                </button>
              </router-link>
            </span>
            <span v-else-if="column === 'quality'">
              <quality-column
                :qualities="collection[column]"
                :spacing="0"
              ></quality-column>
            </span>
            <span v-else-if="column === 'type'">{{
              getCollectionType(collection)
            }}</span>
            <span v-else-if="column === 'materials'">{{
              getCollectionMaterials(collection)
            }}</span>
            <span v-else-if="column === 'size'">{{
              getCollectionSize(collection)
            }}</span>
          </td>
        </tr>
        <tr v-if="hasSubCollections(collection)" :key="collection.id">
          <td colspan="5" class="sub-table-cell">
            <b-link
              v-b-toggle="'collapse-' + collection.id"
              class="text-muted"
            >
              <span class="when-hidden">
                Show
                {{ collection.sub_collections.length }} subcollections
                <i class="fa fa-caret-down"></i>
              </span>
              <span class="when-visible">
                Hide subcollections
                <i class="fa fa-caret-up"></i>
              </span>
            </b-link>
            <b-collapse :id="'collapse-' + collection.id">
              <sub-collections-table
                :subCollections="collection.sub_collections"
              ></sub-collections-table>
            </b-collapse>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import utils from '../../utils'
import SubCollectionsTable from './SubCollectionsTable'
import { mapGetters, mapMutations } from 'vuex'
import QualityColumn from './QualityColumn'

export default {
  name: 'CollectionsTable',
  components: {
    SubCollectionsTable,
    QualityColumn
  },
  props: {
    collections: {
      type: Array,
      required: true
    },
    isSubCollectionsTableVisible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapGetters(['selectedCollections']),
    selectedAllCollections: {
      get () {
        return this.parentCollections.map(pc => pc.value).every(id => this.selectedCollections.map(sc => sc.value).includes(id))
      },
      set (newValue) {
        if (newValue === true) {
          this.AddCollectionToSelection({ collection: this.parentCollections, router: this.$router })
        } else {
          this.RemoveCollectionFromSelection({ collection: this.parentCollections, router: this.$router })
        }
      }
    },
    someCollectionsSelected () {
      return (this.parentCollections.map(pc => pc.value).some(id => this.selectedCollections.map(sc => sc.value).includes(id)) && !this.selectedAllCollections)
    },
    parentCollections () {
      return this.topLevelElements.map(tle => ({ label: tle.label || tle.name, value: tle.id }))
    },
    topLevelElements () {
      return this.collections.filter(collection => !collection.parent_collection)
    }
  },
  data () {
    return {
      columns: ['name', 'type', 'materials', 'quality', 'size'],
      quality_logo: { height: 4, width: 9 }
    }
  },
  methods: {
    ...mapMutations(['AddCollectionToSelection', 'RemoveCollectionFromSelection']),
    collectionSelected (collectionId) {
      return this.selectedCollections.map(sc => sc.value).indexOf(collectionId) >= 0
    },
    handleCollectionStatus (event) {
      const checkbox = event.target
      if (checkbox.checked === true) {
        this.AddCollectionToSelection({ collection: checkbox._value, router: this.$router })
      } else {
        this.RemoveCollectionFromSelection({ collection: checkbox._value, router: this.$router })
      }
    },
    getCollectionMaterials (collection) {
      return utils.getUniqueIdArray(collection.materials.map(material => material.label)).join(', ')
    },
    getCollectionType (collection) {
      return utils.getUniqueIdArray(collection.type.map(type => type.label)).join(', ')
    },
    hasSubCollections (collection) {
      return collection && collection.sub_collections && collection.sub_collections.length > 0
    },
    getCollectionSize (collection) {
      return collection.size || collection.order_of_magnitude.size
    }
  }
}
</script>

<style>
.collapsed > .when-visible {
  display: none;
}
:not(.collapsed) > .when-hidden {
  display: none;
}

.table-text-content-columns {
  font-size: 13px;
  font-weight: bold;
}

.table-text-content-columns-has-sub {
  font-size: 13px;
  font-weight: bold;
  border-style: hidden;
  border-width: 0px;
}

.sub-table-cell {
  padding-top: 0px;
}

.collection-link {
  white-space: normal !important;
  line-height: normal;
}
</style>
