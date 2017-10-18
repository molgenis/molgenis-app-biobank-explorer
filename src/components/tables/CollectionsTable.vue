<template>
  <table class="table table-striped">
    <thead>
    <th></th>
    <th v-for="column in columns">{{ column }}</th>
    </thead>

    <tbody>
    <tr v-for="collection in collections">
      <td>
        {{ collection }}
        <a :href="'/menu/main/dataexplorer/details/eu_bbmri_eric_collections/' + collection.id"
           class="btn btn-primary btn-sm"><i class="fa fa-info-circle" aria-hidden="true"></i></a>
      </td>

      <td v-for="column in columns"
    </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: 'collections-table',
    props: ['collections'],
    data () {
      return {
        columns: ['name', 'type', 'materials', 'order_of_magnitude', 'standards']
      }
    }
  }
</script>
