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
          @click.prevent="copyOnClipboard(attribute.linkValue, $event)"
          v-b-tooltip.hover="'Copy on clipboard'"
          class="fa fa-clipboard">
        </span>
        <b-toast id="feedback-toast" static auto-hide>
          Copied {{ attribute.linkValue }}
        </b-toast>
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
    },
    copyOnClipboard (link, event) {
      navigator.clipboard.writeText(link)
      this.$bvToast.toast(`Copied ${link}`, {
        variant: 'primary',
        autoHideDelay: 100,
        appendToast: false,
        noCloseButton: true,
        toaster: 'b-toaster-top-center'
      })
    }
  },
  mounted () {
    console.log(this.attribute)
  }
}
</script>

<style scoped>

.fa-clipboard {
  margin-left: 5px;
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
