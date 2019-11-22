<template>
  <dl class="mg-report-details-list">
    <dd v-for="(value, key) in reportDetails">
      <!--Type bool-->
      <span v-if="value.type==='bool'">
        {{key}}:
        <span v-if="value.value" class="badge badge-success">yes</span>
        <span v-else class="badge badge-danger">no</span>
      </span>
      <span v-else-if="value.value">
        <!--Type string-->
        <span v-if="value.type === 'string'">{{value.value}}</span>
        <!--Type url-->
        <a v-else-if="value.type === 'url'" :href="value.value">
          <em class="fa fa-globe"></em> Website
        </a>
        <!--Type email-->
        <a v-else-if="value.type === 'email'" :href="'mailto:' + value.value">
          <em class="fa fa-paper-plane"></em> Email
        </a>
        <!--Type phone-->
        <span v-else-if="value.type === 'phone'">
          <em class="fa fa-phone"></em> {{value.value}}
        </span>
        <!--Type list-->
        <span v-else-if="value.type==='list' && value.value.length > 0">
          {{key}}:
          <span v-for="val in value.value" class="badge"
                :class="'badge-'+ (value.badgeColor ? value.badgeColor : 'success')">{{val}}</span>
        </span>
      </span>
    </dd>
  </dl>
</template>

<script>
  export default {
    name: 'ReportDetailsList',
    // Object with as key the variable, as value an object with two keys: value and type
    props: {reportDetails: {[String]: {value: String, type: 'string' | 'email' | 'url' | 'bool' | 'list' | 'phone'}}}
  }
</script>
