<template>
  <p v-if="description" class="mg-report-description">
    <strong>Description: </strong>{{description.substr(0,maxLength)}}
    <span v-if="description.length > (maxLength - 1)">
      <span :style="{ display : descriptionClosed ? 'none' : 'inline'}">
        {{description.substr(maxLength)}}
      </span>
      <button @click="toggleDescription" class="btn btn-link p-0">
        <span v-if="descriptionClosed"> ... show more <em class="fa fa-angle-down"></em></span>
        <span v-else> show less <em class="fa fa-angle-up"></em></span>
      </button>
    </span>
  </p>
</template>

<script>
  export default {
    name: 'ReportDescription',
    props: {
      description: String,
      maxLength: Number
    },
    methods: {
      toggleDescription () {
        this.descriptionClosed = !this.descriptionClosed
      }
    },
    data () {
      return {
        descriptionClosed: true
      }
    }
  }
</script>
