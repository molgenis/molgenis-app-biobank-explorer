<template>
  <div v-if="attribute.quality && attribute.quality.length > 0">
    <info-popover
      v-if="summary"
      label="Quality mark(s):"
      bold-text
      icon-before-label>
      <table>
        <tbody>
          <tr
            :key="`${attribute.id}-${quality.label}`"
            v-for="quality in attribute.quality">
            <td class="text-nowrap align-top font-weight-bold p-2">
              {{ quality.label }}
            </td>
            <td class="py-2">
              {{ qualityStandardsDictionary[quality.label] }}
            </td>
          </tr>
        </tbody>
      </table>
    </info-popover>
    <quality-column
      :qualities="attribute.quality"
      :spacing="0"
      :quality-info="summary ? {} : qualityStandardsDictionary"></quality-column>
  </div>
</template>

<script>
import QualityColumn from '../../tables/QualityColumn.vue'
import InfoPopover from '../../popovers/InfoPopover.vue'
import { mapState } from 'vuex'

export default {
  name: 'quality',
  components: {
    QualityColumn,
    InfoPopover
  },
  props: {
    /**
     * Collection or Biobank with a quality property
     */
    attribute: {
      type: Object,
      required: true,
      default: () => {}
    },
    summary: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState(['qualityStandardsDictionary'])
  }
}
</script>
