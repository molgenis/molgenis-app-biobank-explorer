<template>
  <button type="button" class="btn btn-light btn-block" @click="sendToNegotiator">
    Send query to negotiator
  </button>
</template>

<script>
  import { SEND_TO_NEGOTIATOR } from '../../store/actions'

  export default {
    name: 'negotiator',
    methods: {
      sendToNegotiator () {
        this.$store.dispatch(SEND_TO_NEGOTIATOR)
      }
    }
  }
</script>
