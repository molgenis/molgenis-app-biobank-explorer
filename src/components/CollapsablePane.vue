<template>
  <div class="card pane">
    <h5 class="card-header" @click="toggleOptions">
      <i class="fa fa-caret-up" aria-hidden="true" v-if="showContent"></i>
      <i class="fa fa-caret-down" aria-hidden="true" v-else></i>
      {{paneTitle}}
    </h5>
    <div class="card-block info" v-show="showContent" v-if="entity._meta">
      <div v-for="attr in entity._meta.attributes">
        <attribute :value="entity[attr.name]" :attribute="attr"></attribute>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "~variables";
  @import "~mixins";
  .info {
    background-color: $white;
  }
  .pane {
    background-color: inherit;

  }
</style>
<script>
  import Attribute from './Attribute'
  export default {
    name: 'collapsable-pane',
    props: ['paneTitle', 'excluded', 'entity'],
    components: {Attribute},
    data: function () {
      return {
        showContent: false
      }
    },
    methods: {
      toggleOptions () {
        this.showContent = !this.showContent
        return this.showContent
      }
    }

  }
</script>
