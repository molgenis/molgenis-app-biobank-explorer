<template>
  <tr v-if="attribute && attribute.value && attribute.value.length">
    <th scope="row" class="pr-1 align-top text-nowrap">
      {{ displayName(attribute) }}
    </th>
    <td>
      <template v-if="dataContainsUri">
        <div
          v-for="(item, index) in attribute.value"
          :key="`${index}-${displayName(item)}`">
          <a
            v-if="item.uri && item.uri.length"
            :href="item.uri"
            target="_blank"
            class="text-break mr-2 mb-2">
            {{ displayName(item) }}
          </a>
          <span v-else>{{ displayName(item) }}</span>
        </div>
      </template>
      <template v-else>
        <span>{{ attribute.value.join(", ") }}</span>
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
        return this.attribute.value.some((item) => item.uri)
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

<style scoped>
.fa-external-link {
  top: 1px;
  position: relative;
}

.fa-external-link:hover {
  cursor: pointer;
}
</style>
