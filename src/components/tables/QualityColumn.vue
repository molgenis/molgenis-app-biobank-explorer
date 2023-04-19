<template>
  <ul class="list-unstyled text-nowrap m-0">
    <li
      v-for="quality in qualities"
      :style="margin"
      :key="quality.id"
      class="d-flex">
      <a
        :href="quality.certification_report"
        target="_blank"
        rel="noopener noreferrer"
        v-if="quality.certification_report">
        <span v-if="!quality.certification_image_link">
          {{ quality.label }}
        </span>
        <span v-else>
          <img
            :src="quality.certification_image_link"
            class="quality-logo"
            :alt="generateQualityLabel(quality)"/>
        </span>
      </a>
      <span v-else>
        <span v-if="!quality.certification_image_link">
          {{ quality.label }}
        </span>
        <span v-else>
          <img
            :src="quality.certification_image_link"
            class="quality-logo"
            :alt="generateQualityLabel(quality)"/>
        </span>
      </span>
      <info-popover
        v-if="qualityInfo && Object.keys(qualityInfo).length"
        class="ml-2"
        popover-placement="top">
        <div class="popover-content">
          <b>{{ quality.label }}</b>
          <p class="mt-1">
            {{ qualityInfo[quality.label] }}
          </p>
        </div>
      </info-popover>
    </li>
  </ul>
</template>

<script>
import InfoPopover from '../popovers/InfoPopover'
export default {
  components: { InfoPopover },
  name: 'quality-column',
  props: {
    qualities: {
      type: Array
    },
    spacing: {
      type: Number
    },
    qualityInfo: {
      type: Object
    }
  },
  computed: {
    margin () {
      return `margin-top:${this.spacing}rem;margin-bottom:${this.spacing};`
    }
  },
  methods: {
    generateQualityLabel (quality) {
      return quality.label !== 'Others'
        ? quality.label
        : quality.certification_number
    }
  }
}
</script>

<style scoped>
.quality-logo {
  max-width: 9rem;
  max-height: 4rem;
}

.popover-content {
  max-width: 20rem;
  word-break: break-word;
}

.fa-check {
  position: relative;
  top: 2px;
}
</style>
