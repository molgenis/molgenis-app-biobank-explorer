<template>
  <ul class="list-unstyled">
    <li v-for="quality in qualities" :style="margin" :key="quality.id">
      <a :href="quality.certification_report" target="_blank" rel="noopener noreferrer" v-if="quality.certification_report">
        <span v-if="!quality.certification_image_link">
          {{ quality.label }} <i class="fa fa-check" aria-hidden="true"></i>
        </span>
        <span v-else>
          <img :src="quality.certification_image_link" class="quality-logo"
               :alt="generateQualityLabel(quality)"/>
        </span>
      </a>
      <span v-else>
        <span v-if="!quality.certification_image_link">
          {{ quality.label }}<i class="fa fa-check" aria-hidden="true"></i>
        </span>
        <span v-else>
          <img :src="quality.certification_image_link" class="quality-logo"
               :alt="generateQualityLabel(quality)"/>
        </span>
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'quality-column',
  props: ['qualities', 'spacing'],
  computed: {
    margin () {
      return `margin-top:${this.spacing}rem;margin-bottom:${this.spacing};`
    }
  },
  methods: {
    generateQualityLabel (quality) {
      return quality.label !== 'Others' ? quality.label : quality.certification_number
    }
  }
}
</script>

<style scoped>
  li{
    white-space: nowrap;
  }
  .fa-check {
    color: green;
  }
  .quality-logo{
    max-width:9rem;
    max-height:4rem;
  }
</style>
