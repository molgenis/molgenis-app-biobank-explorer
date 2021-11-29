<template>
  <tr v-if="attribute.values">
    <th scope="row" class="pr-1">{{ displayName(attribute) }}</th>
    <td>
      <template v-if="dataContainsUri">
        <a v-for="(item, index) in attribute.values"
          :href="item.uri"
          target="_blank"
          class="m-1 badge"
          :class="'badge-' + badgeColor"
          :key="`${index}-${displayName(item)}`">
          {{ displayName(item) }}
          <span class="ml-1 fa fa-external-link" aria-hidden="true"></span>
        </a>
      </template>
      <template v-else>
        <span
          v-for="(value, index) in attribute.values"
          class="m-1 badge"
          :key="index"
          :class="'badge-' + badgeColor">
          {{ value }}
        </span>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    badgeColor: {
      type: String,
      default: () => 'info'
    },
    attribute: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dataContainsUri () {
      if (this.attribute.values.length && typeof this.attribute.values[0] === 'object') {
        return this.attribute.values.some(item => item.uri)
      } else {
        return ''
      }
    }
  },
  methods: {
    displayName (item) {
      return item.label || item.name || item.id
    }
  }
}
</script>
