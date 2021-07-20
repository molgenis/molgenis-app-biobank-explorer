<template>
  <table class="sub-collection-table" :class="'ml-' + level">
    <thead>
      <tr class="sub-table-row">
        <th scope="col">Subcollection</th>
        <th scope="col">Type</th>
        <th scope="col">Materials</th>
        <th scope="col">Standards</th>
        <th scope="col">#Samples</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="subCollection in subCollections">
        <tr class="sub-table-row" :key="subCollection.id">
          <td
            class="table-text-content-columns-sub"
            v-for="column in columns"
            :key="column">
            <span v-if="column === 'name'">
              <router-link :to="'/collection/' + subCollection.id">
                {{ subCollection[column] }}
              </router-link>
            </span>
            <span v-else-if="column === 'type'">{{
              getCollectionType(subCollection)
            }}</span>
            <span v-else-if="column === 'materials'">{{
              getCollectionMaterials(subCollection)
            }}</span>
            <span v-else-if="column === 'quality'">
              <quality-column
                :qualities="subCollection[column]"
                :spacing=0
                :qualityInfo="qualityStandardsDictionary"></quality-column>
            </span>
            <span v-else-if="column === 'size'">{{
              subCollection[column]
            }}</span>
          </td>
        </tr>
        <tr
          v-if="subCollection.sub_collections.length"
          :key="'subsubs-' + subCollection.id">
          <td colspan="5" class="sub-table-cell">
            <b-button
              :class="visible[subCollection.id] ? null : 'collapsed'"
              :aria-expanded="visible[subCollection.id] ? 'true' : 'false'"
              :aria-controls="'collapse-' + subCollection.id"
              @click="toggleVisible(subCollection.id)"
              class="m-1"
              size="sm"
              variant="primary">
              <i
                class="fa fa-caret-down"
                aria-hidden="true"
                v-if="visible[subCollection.id]"></i>
              <i class="fa fa-caret-right" aria-hidden="true" v-else></i>
              Sub collections
            </b-button>
            <b-collapse
              :id="'collapse-' + subCollection.id"
              v-model="visible[subCollection.id]">
              <sub-collections-table
                :subCollections="subCollection.sub_collections"
                :level="level + 2"></sub-collections-table>
            </b-collapse>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style>
.sub-collection-table thead th {
  font-size: 12px;
}

.table-text-content-columns-sub {
  font-size: 12px;
  padding: 5px;
}

.sub-table-row td {
  padding: 5px;
}

.sub-table-row th {
  padding: 5px;
}
</style>

<script>
import { mapState } from 'vuex'
import utils from '../../utils'
import QualityColumn from './QualityColumn'

export default {
  name: 'sub-collections-table',
  props: {
    subCollections: {
      type: Array,
      required: true
    },
    level: {
      default: 2,
      type: Number
    }
  },
  data () {
    return {
      columns: ['name', 'type', 'materials', 'quality', 'size'],
      visible: this.subCollections.reduce((result, subCollection) => {
        result[subCollection.id] = false
        return result
      }, {})
    }
  },
  computed: {
    ...mapState(['qualityStandardsDictionary'])
  },
  methods: {
    getCollectionMaterials (collection) {
      return utils
        .getUniqueIdArray(
          collection.materials.map((material) => material.label)
        )
        .join(', ')
    },
    getCollectionType (collection) {
      return utils
        .getUniqueIdArray(collection.type.map((type) => type.label))
        .join(', ')
    },
    toggleVisible (id) {
      this.visible[id] = !this.visible[id]
    }
  },
  components: {
    QualityColumn
  }
}
</script>
