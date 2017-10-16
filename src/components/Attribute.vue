<template>
  <div v-if="attribute.fieldType != 'COMPOUND'"> <!--TODO: implement compound-->
    <b>{{attribute.label}}: </b>
    <a v-if="attribute.fieldType==='HYPERLINK'" :href="value">{{value}}</a>
    <span v-else-if="attribute.fieldType==='BOOL'">
      <i class="fa fa-check" aria-hidden="true" v-if="value===true"></i>
      <i class="fa fa-times" aria-hidden="true" v-else></i>
    </span>
    <span v-else-if="attribute.fieldType==='XREF' | attribute.fieldType==='CATEGORICAL'">{{value[getRefLabel()]}}</span>
    <ul v-else-if="attribute.fieldType==='MREF' | attribute.fieldType==='CATEGORICAL_MREF'" ><li v-for="val in value">{{val[getRefLabel()]}}</li><li v-if="value.length === 0">None</li></ul>
    <span v-else>{{value}}<span v-show="!value">-</span></span>
  </div>
</template>
<style lang="scss">
  @import "~variables";
  @import "~mixins";

  .fa-check {
    color: $green
  }

  .fa-times {
    color: $red
  }
</style>
<script>
  export default {
    name: 'attribute',
    props: ['attribute', 'value'],
    methods: {
      getRefLabel: function () {
        let self = this
        const label = self.attribute.refEntity.attributes.find(attr => attr.labelAttribute).name
        return label
      }
    }
  }
</script>
