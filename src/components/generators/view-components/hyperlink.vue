<template>
  <tr v-if="attribute.value && attribute.value.length">
    <th scope="row" class="pr-1 align-top">{{ displayName(attribute) }}</th>
    <td>
      <span>
        <a target="_blank" :href="attribute.value">{{ attribute.value }}</a>
      </span>
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
  methods: {
    displayName (item) {
      return item.label || item.name || item.id
    }
  }
}
</script>
