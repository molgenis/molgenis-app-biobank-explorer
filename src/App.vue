<template>
  <div
    @click="$root.$emit('bv::hide::popover')"
    :class="{ 'molgenis-negative-top-margin': removeFreemarkerMargin }"
    class="app-layout">
    <div
      v-if="applicationNotification"
      class="alert alert-warning"
      role="alert">
      {{ applicationNotification }}
    </div>
    <b-alert v-if="errorMessage" show variant="danger" dismissible>
      {{ errorMessage }}
    </b-alert>
    <Transition>
      <div
        v-if="notificationMessage"
        class="d-flex justify-content-center align-items-center">
        <div
          ref="copy-link-toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          class="toast-container toast-container-top-center mt-1 alert-info">
          <div
            class="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true">
            <div class="toast-body alert-info">
              {{ notificationMessage }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'biobank-explorer',
  computed: {
    ...mapGetters({
      errorMessage: 'getErrorMessage',
      loading: 'loading',
      notificationMessage: 'getNotificationMessage'
    }),
    ...mapState(['removeFreemarkerMargin', 'applicationNotification'])
  },
  methods: {
    ...mapMutations(['MapQueryToState', 'ConfigureFilters', 'SetNotification']),
    ...mapActions(['GetApplicationContext', 'GetQualityStandardInformation'])
  },
  watch: {
    $route () {
      this.MapQueryToState()
    },
    loading (loading) {
      if (!loading) {
        this.MapQueryToState()
      }
    },
    notificationMessage () {
      const notificationTimer = setTimeout(() => {
        this.SetNotification(undefined)
        clearTimeout(notificationTimer)
      }, 1500)
    }
  },
  beforeMount () {
    this.ConfigureFilters()
    this.MapQueryToState()
    this.GetQualityStandardInformation()
    this.GetApplicationContext()
  }
}
</script>

<style>
.app-layout {
  width: 80%;
  margin: 0 auto;
}

.mg-page-content {
  padding-top: 0 !important;
}

.custom-control-label::before {
  border-color: black; /* makes checkboxes stand out more for better UX */
}

/* Countering freemarker container */
.molgenis-negative-top-margin {
  margin-top: -2rem;
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
  position: absolute;
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
