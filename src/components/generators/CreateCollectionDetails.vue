<template>
  <tr v-if="getValue() != ''">
    <th scope="row" class="pr-1">{{ property.label }}</th>
    <td>
      <template v-if="dataContainsUri">
        <a v-for="(obj, index) in getValue()"
          :href="obj.uri"
          target="_blank"
          class="m-1 badge"
          :class="'badge-' + badgeColor"
          :key="index + obj.label">
          {{ obj.label }}
          <span class="ml-1 fa fa-external-link" aria-hidden="true"></span>
        </a>
      </template>
      <template v-else>
        <span
          v-for="(value, index) in getValue()"
          class="m-1 badge"
          :key="index"
          :class="'badge-' + badgeColor">{{ value }}
        </span>
      </template>
    </td>
  </tr>
</template>

<script>
import { createColumnKey } from '../../utils/generatorUtils'
export default {
  props: {
    collection: {
      type: Object,
      required: true
    },
    /**
     * Array with objects stating: 'label': 'This is:', column: 'name_of_property'
     */
    property: {
      type: Object,
      required: true
    },
    badgeColor: {
      type: String,
      default: () => 'info'
    }
  },
  computed: {
    columnKey () {
      return createColumnKey(this.property.column)
    },
    dataContainsUri () {
      return typeof this.collection[this.columnKey].value[0] === 'object' &&
             this.collection[this.columnKey].value.some(item => item.uri)
    }
  },
  methods: {
    getValue () {
      if (this.collection[this.columnKey] &&
          this.collection[this.columnKey].value &&
          this.collection[this.columnKey].value.length) {
        return this.collection[this.columnKey].value
      }

      return ''
    }
  }
}
</script>

<style scoped>
.badge {
  transition: transform 0.1s;
  box-shadow: 0 0 0 1px white;
}
.badge:hover {
  transform: scale(1.4);
}
.fa-external-link {
  top: 1px;
  position: relative;
}

.fa-external-link:hover {
  cursor: pointer;
}
</style>
