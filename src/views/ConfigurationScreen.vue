<template>
<span>{{ appConfig}}</span>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  methods: {
    ...mapActions(['GetApplicationConfiguration'])
  },
  computed: {
    ...mapState(['appConfig'])
  },
  mounted () {
    this.GetApplicationConfiguration()
  }
}
</script>
