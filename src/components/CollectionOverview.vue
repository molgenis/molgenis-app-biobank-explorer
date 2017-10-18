<template>
  <table class="table table-striped">
    <thead>
    <tr>
      <th></th>
      <th v-for="column in columns" @click="sortBy(column)" :class="{ active: sortKey == column }">
        {{ column | styleHeader }}
        <i class="fa fa-caret-up" aria-hidden="true" v-if="sortOrders[column] > 0"></i>
        <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      </th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="collection in filteredCollections">
      <td><a :href="serverUrl + '/menu/main/dataexplorer/details/eu_bbmri_eric_collections/' + collection.id"
             class="btn btn-primary btn-sm"><i class="fa fa-info-circle" aria-hidden="true"></i></a></td>
      <td v-for="column in columns">
        <span v-if="column === 'name'">{{collection[column]}}</span>
        <span v-else-if="column === 'order_of_magnitude'">
          {{collection[column].size}}
        </span>
        <span v-else-if="column === 'standards'">
          <quality-logo v-for="quality in collection[column]" :quality="quality.label"
                        :key="quality.label"></quality-logo>
        </span>

        <ul v-else>
          <li v-for="info in collection[column]">{{info.label}}</li>
        </ul>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style>
  th.active {
    color: #01549b;
  }

  th.active .arrow {
    opacity: 1;
  }
</style>

<script>
  import QualityLogo from './QualityLogo'
  import { INITIAL_STATE } from '../store/state'

  export default {
    name: 'collection-overview',
    props: ['filterKey', 'collections'],
    components: {QualityLogo},
    data: function () {
      const sortOrders = {}
      this.columns.forEach(function (key) {
        sortOrders[key] = 1
      })

      return {
        columns: ['name', 'type', 'materials', 'order_of_magnitude', 'standards'],
        sortKey: '',
        sortOrders: sortOrders,
        serverUrl: INITIAL_STATE.serverUrl
      }
    },
    computed: {
      filteredCollections: function () {
        const sortKey = this.sortKey
        const filterKey = this.filterKey && this.filterKey.toLowerCase()
        const order = this.sortOrders[sortKey] || 1
        let collections = this.collections

        if (filterKey) {
          collections = collections.filter(function (collection) {
            return Object.keys(collection).some(function (key) {
              return String(collection[key]).toLowerCase().indexOf(filterKey) > -1
            })
          })
        }

        if (sortKey) {
          collections = collections.slice().sort(function (a, b) {
            a = a[sortKey]
            b = b[sortKey]
            return (a === b ? 0 : a > b ? 1 : -1) * order
          })
        }

        const materialTypeFilters = this.$store.state.filters.material_types.selectedOptions
        const qualityFilters = this.$store.state.filters.quality.selectedOptions

        return collections.filter(collection => {
          if (materialTypeFilters.length === 0 && qualityFilters.length === 0) {
            return true
          }

          const collectionsContainingMaterial = collection.materials.find(collectionMaterial => {
            return materialTypeFilters.includes(collectionMaterial.id)
          })

          const collectionsContainingQuality = collection.standards.find(collectionStandard => {
            return qualityFilters.includes(collectionStandard.id)
          })

          return (materialTypeFilters.length > 0 && qualityFilters.length === 0 && !!collectionsContainingMaterial) ||
            (materialTypeFilters.length === 0 && qualityFilters.length > 0 && !!collectionsContainingQuality) ||
            (!!collectionsContainingMaterial && !!collectionsContainingQuality)
        })
      }
    },
    filters: {
      styleHeader: ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase().replace(/_/g, ' ')
    },
    methods: {
      sortBy: function (key) {
        this.sortKey = key
        this.sortOrders[key] = this.sortOrders[key] * -1
      }
    }
  }
</script>
