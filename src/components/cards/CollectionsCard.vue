<template>
  <table class="table table-striped">
    <thead>
      <th></th>
      <th v-for="column in columns">{{ column }}</th>
    </thead>

    <tbody>
      <tr v-for="collection in collections"></tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: 'collection-card',
    props: ['collections'],
    data () {
      return {
        columns: ['name', 'type', 'materials', 'order_of_magnitude', 'standards']
      }
    }
  }
</script>
