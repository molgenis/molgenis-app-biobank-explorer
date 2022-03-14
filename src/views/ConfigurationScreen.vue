<template>
<span>TODO</span>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['GetApplicationConfiguration'])
  },
  mounted () {
    this.GetApplicationConfiguration()
  }
}
</script>
