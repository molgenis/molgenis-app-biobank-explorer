<template>
  <table class="mg-report-details-list mb-3">
    <caption v-show="false">Details list</caption>
    <tr v-for="(value, key) in reportDetails" v-if="showRow(value)">
      <!-- Header -->
      <th scope="row" class="pr-1" v-if="showKey(value.type)">{{key}}:</th>

      <!--Type bool-->
      <td v-if="value.type==='bool'">
        <span v-if="value.value" class="badge badge-success">yes</span>
        <span v-else class="badge badge-danger">no</span>
      </td>
      <!--Type string-->
      <td v-else-if="value.type.includes('string')">{{value.value}}</td>
      <!--Type url-->
      <td v-else-if="value.type === 'url'">
        <a :href="value.value" target="_blank" rel="noreferrer">
          <i class="fa fa-globe" aria-hidden="true"></i> Website
        </a>
      </td>
      <!--Type email-->
      <td v-else-if="value.type === 'email'">
        <a :href="'mailto:' + value.value">
          <i class="fa fa-paper-plane" aria-hidden="true"></i> Email
        </a>
      </td>
      <!--Type phone-->
      <td v-else-if="value.type === 'phone'">
        <i class="fa fa-phone" aria-hidden="true"></i> {{value.value}}
      </td>
      <!--Type list-->
      <td v-else-if="value.type==='list' && value.value.length > 0">
          <span v-for="val in value.value" class="m-1 badge"
                :class="'badge-'+ (value.badgeColor ? value.badgeColor : 'success')">{{val}}</span>
      </td>
      <!--Type report-->
      <td v-else-if="value.type === 'report'">
        <a :href="value.value">
          <i class="fa fa-address-card" aria-hidden="true"></i> Overview
        </a>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'ReportDetailsList',
    // Object with as key the variable, as value an object with two keys: value and type
    props: {
      reportDetails: {
        [String]: {
          value: String,
          type: 'string' | 'email' | 'url' | 'bool' | 'list' | 'phone' | 'report' | 'string-with-key',
          batchColor: {
            type: 'success' | 'warning' | 'info' | 'secondary' | 'danger' | 'light' | 'dark',
            required: false
          }
        }
      }
    },
    methods: {
      showRow (value) {
        return (value.value && value.value.length !== 0) || value.type === 'bool'
      },
      showKey (type) {
        return ['bool', 'string-with-key', 'list'].includes(type)
      }
    }
  }
</script>
