<template>
  <table class="mg-report-details-table">
    <caption v-show="false">Collection details</caption>
    <tr v-for="(value,key) in tableContent.stringValues" v-if="value">
      <th scope="row">{{key}}:</th>
      <td>{{value}}</td>
    </tr>

    <tr v-for="(values,key) in tableContent.listValues" v-if="values.values.length > 0">
      <th scope="row">{{key}}:</th>
      <td>
        <span v-for="value in values.values" class="badge m-1" :class="'badge-' + values.badgeColor">{{value}}</span>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'ReportDetailsTable',
    props: {
      tableContent: {
        stringValues: {[String]: String},
        listValues: {
          [String]: {
            values: Array,
            badgeColor: 'success' | 'warning' | 'info' | 'secondary' | 'danger' | 'light' | 'dark'
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
