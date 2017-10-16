<template>
  <div>
    <img :src=imgSource :alt="quality" width="161" height="56"/>
  </div>
</template>

<style>
  .biobank_card {
    margin-top: 1em;
  }

  .biobank_header:hover {
    cursor: pointer;
    cursor: hand;
  }
</style>

<script>
  import '../assets/img/CEN_TS_16826_1_2015_E.png'
  import '../assets/img/CEN_TS_16826_2_2015_E.png'
  import '../assets/img/CEN_TS_16827_1_2015_E.png'
  import '../assets/img/CEN_TS_16827_2_2015_E.png'
  import '../assets/img/CEN_TS_16827_3_2015_E.png'
  import '../assets/img/CEN_TS_16835_1_2015_E.png'
  import '../assets/img/CEN_TS_16835_2_2015_E.png'
  import '../assets/img/CEN_TS_16835_3_2015_E.png'
  import '../assets/img/CEN_TS_16853_2_2015_E.png'
  import '../assets/img/CEN_TS_16945_2016_E.png'
  import '../assets/img/CEN_TS_19827_3_2015_E.png'
  import '../assets/img/EN_ISO_15189_2012_E.png'

  export default {
    name: 'quality-logo',
    props: ['quality'],
    computed: {
      imgSource: function get () {
        return window.__webpack_public_path__ + 'img/' + this.quality.replace(/[- :/]/g, '_') + '_E.png'
      }
    }
  }
</script>
