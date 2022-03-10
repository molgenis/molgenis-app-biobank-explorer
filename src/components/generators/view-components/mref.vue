<template>
  <tr v-if="attribute && attribute.value && attribute.value.length">
    <th scope="row" class="pr-1 align-top text-nowrap">
      {{ displayName(attribute) }}
    </th>
    <td>
      <template v-if="dataContainsUri">
        <a
          v-for="(item, index) in attribute.value"
          tabindex="0"
          :href="item.uri"
          target="_blank"
          class="badge text-break mr-2 mb-2 p-2"
          :class="'badge-' + badgeColor"
          :key="`${index}-${displayName(item)}`">
          {{ displayName(item) }}
          <span class="fa fa-external-link" aria-hidden="true"></span>
        </a>
      </template>
      <template v-else>
        <span
          @click.stop
          tabindex="0"
          v-for="(value, index) in attribute.value"
          class="badge text-break mr-2 mb-2 p-2"
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
      if (
        this.attribute.value.length &&
        typeof this.attribute.value[0] === 'object'
      ) {
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
  font-size: 0.75rem;
  white-space: normal;
  transition: transform 0.1s;
  box-shadow: 0 0 0 1px white;
  text-align: left;
}
.badge:hover,
.badge:focus {
  position: relative;
  transform: scale(1.5);
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
