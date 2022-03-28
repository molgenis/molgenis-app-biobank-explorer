<template>
  <tr v-if="attribute && attribute.value && attribute.value.length">
    <th scope="row" class="pr-1 align-top text-nowrap">{{ displayName(attribute) }}</th>
    <td>
      <template v-if="attribute.badgeColor">
        <span
          class="badge"
          :class="'badge-' + badgeColor">
          {{ attribute.value }}
        </span>
      </template>
      <template v-else>
        <span>
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
      type: Object
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
.fa-external-link {
  top: 1px;
  position: relative;
}

.fa-external-link:hover {
  cursor: pointer;
}

.badge {
  padding: 0.5rem;
}
</style>
