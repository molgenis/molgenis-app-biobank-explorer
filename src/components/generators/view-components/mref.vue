<template>
  <tr v-if="attribute && attribute.value && attribute.value.length">
    <th scope="row" class="pr-1 align-top text-nowrap">{{ displayName(attribute) }}</th>
    <td>
      <template v-if="dataContainsUri">
        <a v-for="(item, index) in attribute.value"
          :href="item.uri"
          target="_blank"
          class="m-1 badge text-break"
          :class="'badge-' + badgeColor"
          :key="`${index}-${displayName(item)}`">
          {{ displayName(item) }}
          <span class="ml-1 fa fa-external-link" aria-hidden="true"></span>
        </a>
      </template>
      <template v-else>
        <span
          v-for="(value, index) in attribute.value"
          class="m-1 badge text-break"
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
    attribute: {
      type: Object
    }
  },
  computed: {
    dataContainsUri () {
      if (this.attribute.value.length && typeof this.attribute.value[0] === 'object') {
        return this.attribute.value.some(item => item.uri)
      } else {
        return ''
      }
    },
    badgeColor () {
      return this.attribute.badgeColor || 'info'
    }
  },
  methods: {
    displayName (item) {
      return item.label || item.name || item.id
    }
  }
}
</script>

<style scoped>
.badge {
  white-space: normal;
  transition: transform 0.1s;
  box-shadow: 0 0 0 1px white;
  text-align: left;
}
.badge:hover {
  position: relative;
  transform: scale(1.4);
  z-index: 9000;
}
.fa-external-link {
  top: 1px;
  position: relative;
}

.fa-external-link:hover {
  cursor: pointer;
}
</style>
