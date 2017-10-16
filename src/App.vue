<template>
  <div class="container">
      <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import "~variables";
  @import "~mixins";

  #app {
    background-color: $white;
    text-align: left!important;

  }
</style>

<script>
  import './assets/img/favicon.ico'

  export default {
    name: 'molgenis-app'
  }
</script>
