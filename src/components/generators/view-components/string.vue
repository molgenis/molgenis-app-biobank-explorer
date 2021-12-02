<template>
  <tr v-if="attribute && attribute.value.length">
    <th scope="row" class="pr-1 align-top">{{ displayName(attribute) }}</th>
    <td>
      <template v-if="attribute.badgeColor">
        <span
          class="m-1 badge"
          :class="'badge-' + badgeColor">
          {{ attribute.value }}
        </span>
      </template>
      <template v-else>
        <span
          class="m-1">
          {{ attribute.value }}
        </span>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    attribute: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
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
