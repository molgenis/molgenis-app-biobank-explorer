<template>
  <table class="table table-condensed table-responsive">
    <thead>
    <tr>
      <th></th>
      <th>Collection</th>
      <th>Type</th>
      <th>Materials</th>
      <th>Standards</th>
      <th>#Samples</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="collection in collections">
      <td>
        <a :href="'/menu/main/dataexplorer/details/eu_bbmri_eric_collections/' + collection.id">
          <i class="fa fa-th fa-lg collection-detail-btn" aria-hidden="true"></i>
        </a>
      </td>

      <td class="table-text-content-columns" v-for="column in columns">
        <span v-if="column === 'name'">{{collection[column]}}</span>
        <span v-else-if="column === 'standards'">
          <ul class="list-unstyled">
            <li v-for="standard in collection[column]">
              {{ standard.label }} <i class="fa fa-check"></i>
            </li>
          </ul>
        </span>

        <span v-else-if="column === 'type'">{{ getCollectionType(collection) }}</span>
        <span v-else-if="column === 'materials'">{{ getCollectionMaterials(collection) }}</span>
        <span v-else-if="column === 'size'">{{ collection[column] }}</span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style>
  .collection-detail-btn {
    color: #d46907;
  }

  .table-text-content-columns {
    font-size: 13px;
  }

  .fa-check {
    color: green;
  }
</style>

<script>
  import utils from 'src/utils'

  export default {
    name: 'collections-table',
    props: ['collections'],
    data () {
      return {
        columns: ['name', 'type', 'materials', 'standards', 'size']
      }
    },
    methods: {
      getCollectionMaterials (collection) {
        return utils.getUniqueIdArray(collection.materials.map(material => material.label)).join(', ')
      },
      getCollectionType (collection) {
        return utils.getUniqueIdArray(collection.type.map(type => type.label)).join(', ')
      }
    }
  }
</script>
