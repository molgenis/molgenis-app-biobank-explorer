<template>
  <div class="container">
    <a :href="home">< Back to home</a>
    <h5>
      <span class="line-center">BBMRI-ERIC Directory</span>
    </h5>
    <router-view></router-view>
  </div>
</template>

<style scoped>
  .line-center {
    margin: 0;
    padding: 0 10px;
    background: #fff;
    display: inline-block;
  }

  h5 {
    margin-top: 1em;
    text-align: center;
    position: relative;

  }

  h5:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: solid 1px black;
    z-index: -1; /* Makes solid line go behind text present inside H5 element */
  }
</style>

<script>
  import { INITIAL_STATE } from './store/state'

  export default {
    name: 'biobank-explorer',
    data () {
      return {
        home: INITIAL_STATE.serverUrl
      }
    }
  }
</script>
