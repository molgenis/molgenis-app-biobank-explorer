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
          class="fa fa-clipboard ml-1">
        </span>
        <div class="d-flex justify-content-center align-items-center">
          <Transition>
              <div v-show="copiedValueShown"
                  ref="copy-link-toast"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                  class="toast-container toast-container-top-center mt-1 alert-info">
                <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                  <div class="toast-body alert-info">
                    Copied {{ attribute.linkValue }}
                  </div>
                </div>
              </div>
          </Transition>
        </div>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  data () {
    return {
      copiedValueShown: false
    }
  },
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
    copyOnClipboard (link) {
      navigator.clipboard.writeText(link)
      this.copiedValueShown = true
      const copiedValueTimer = setTimeout(() => {
        this.copiedValueShown = false
        clearTimeout(copiedValueTimer)
      }, 1500)
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

.toast-container {
  display: block;
  max-width: 25rem;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background-clip: padding-box;
  z-index: 1;
  border-radius: 0.25rem;
}

.toast-container-top-center {
  position: fixed;
  top: 0;
}

.toast-container .toast {
  max-width: 25rem;
  opacity: 1;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
