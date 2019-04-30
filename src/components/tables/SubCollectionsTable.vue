<template>
  <table class="sub-collection-table">
    <thead>
      <tr class="sub-table-row">
        <th></th>
        <th>Subcollection</th>
        <th>Type</th>
        <th>Materials</th>
        <th>Standards</th>
        <th>#Samples</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="subCollection in subCollections">
        <tr class="sub-table-row">
          <td></td>
          <td class="table-text-content-columns-sub" v-for="column in columns">
            <span v-if="column === 'name'">
              <a :href="'/menu/main/dataexplorer/details/eu_bbmri_eric_collections/' + subCollection.id">
                {{subCollection[column]}}
              </a>
            </span>
            <span v-else-if="column === 'type'">{{ getCollectionType(subCollection) }}</span>
            <span v-else-if="column === 'materials'">{{ getCollectionMaterials(subCollection) }}</span>
            <span v-else-if="column === 'quality'">
              <quality-column :qualities="subCollection[column]" :spacing=0></quality-column>
            </span>
            <span v-else-if="column === 'size'">{{ subCollection[column] }}</span>
          </td>
        </tr>
        <tr v-if="subCollection.sub_collections.length">
          <td colspan="5" class="sub-table-cell">
            <sub-collections-table :subCollections="subCollection.sub_collections"></sub-collections-table>
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
  import utils from '../../utils'
  import QualityColumn from './QualityColumn'

  export default {
    name: 'sub-collections-table',
    props: {
      subCollections: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        columns: ['name', 'type', 'materials', 'quality', 'size']
      }
    },
    methods: {
      getCollectionMaterials (collection) {
        return utils.getUniqueIdArray(collection.materials.map(material => material.label)).join(', ')
      },
      getCollectionType (collection) {
        return utils.getUniqueIdArray(collection.type.map(type => type.label)).join(', ')
      }
    },
    components: {
      QualityColumn
    }
  }
</script>
