<template>
  <table class="table table-striped">
    <thead>
      <th></th>
      <th>Name</th>
      <th>Type</th>
      <th>Materials</th>
      <th>Order of Magnitude</th>
      <th>Standards</th>
    </thead>

    <tbody>
    <tr v-for="collection in collections">
      <td>
        <a :href="'/menu/main/dataexplorer/details/eu_bbmri_eric_collections/' + collection.id"
           class="btn btn-primary btn-sm">
          <i class="fa fa-info-circle" aria-hidden="true"></i>
        </a>
      </td>

      <td v-for="column in columns">
        <span v-if="column === 'name'">{{collection[column]}}</span>
        <span v-else-if="column === 'order_of_magnitude'">{{collection[column].size}}</span>
        <span v-else-if="column === 'standards'">
          <standard-logo
            v-for="standard in collection[column]"
            :standard="standard.label"
            :key="standard.label">
          </standard-logo>
        </span>

        <ul v-else>
          <li v-for="info in collection[column]">{{info.label}}</li>
        </ul>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import StandardLogo from '../StandardLogo.vue'

  export default {
    name: 'collections-table',
    props: ['collections'],
    data () {
      return {
        columns: ['name', 'type', 'materials', 'order_of_magnitude', 'standards']
      }
    },
    components: {
      StandardLogo
    }
  }
</script>
