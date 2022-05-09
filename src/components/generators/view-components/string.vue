<template>
  <tr v-if="attribute && attribute.value && attribute.value.length">
    <th scope="row" class="pr-1 align-top text-nowrap">
      {{ displayName(attribute) }}
    </th>
    <td>
      <template v-if="attribute.badgeColor">
        <span class="badge mb-2" :class="'badge-' + badgeColor">
          {{ attribute.value }}
        </span>
      </template>
      <template v-else>
        <span>
          {{ attribute.value }}
        </span>
      </template>
      <template v-if="attribute.linkValue">
        <span
          id="copy-icon"
          @click.prevent="copyToClipboard(attribute.linkValue)"
          v-b-tooltip.hover="'Copy to clipboard'"
          class="fa fa-clipboard ml-1">
        </span>
      </template>
    </td>
  </tr>
</template>

<script>
import { mapMutations } from 'vuex'

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
    ...mapMutations(['SetNotification']),
    displayName (item) {
      return item.label || item.name || item.id
    },
    copyToClipboard (link) {
      navigator.clipboard.writeText(link)
      this.SetNotification(`Copied ${link}`)
    }
  }
}
</script>

<style scoped>

.fa-clipboard {
  position: relative;
  font-size: large;
}

.fa-clipboard:hover {
  cursor: pointer;
}

.fa-external-link {
  top: 1px;
  position: relative;
}

.fa-external-link:hover {
  cursor: pointer;
}

.badge {
  text-align: left;
  padding: 0.5rem;
  font-size: 0.75rem;
  border-radius: 0;
}

.badge-light {
  border: 1px solid #000;
}
</style>
