<template>
  <table class="table table-striped">
    <thead>
    <tr>
      <th></th>
      <th>Name</th>
      <th>Type</th>
      <th>Materials</th>
      <th>Standards</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="collection in collections">
      <th scope="row">
        <a :href="'/menu/main/dataexplorer/details/eu_bbmri_eric_collections/' + collection.id"
           class="btn btn-primary btn-sm">
          <i class="fa fa-info-circle" aria-hidden="true"></i>
        </a>
      </th>

      <td v-for="column in columns">
        <span v-if="column === 'name'">{{collection[column]}}</span>
        <span v-else-if="column === 'standards'">
          <ul class="list-unstyled">
            <li v-for="standard in collection[column]">
              {{ standard.label }} <i class="fa fa-check"></i>
            </li>
          </ul>
        </span>

        <ul class="list-unstyled" v-else>
          <li v-for="info in collection[column]">{{info.label}}</li>
        </ul>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<style>
  .fa-check {
    color: green;
  }
</style>

<script>
  export default {
    name: 'collections-table',
    props: ['collections'],
    data () {
      return {
        columns: ['name', 'type', 'materials', 'standards']
      }
    }
  }
</script>
