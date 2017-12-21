<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" :href="home">
        <img class="img-responsive" width="140" height="35" src="https://molgenis114.gcc.rug.nl/logo/bbmri-eric-logo-ohnezusatz.png" alt="BBMRI-ERIC">
      </a>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-molgenis-navbar" aria-controls="bs-molgenis-navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="bs-molgenis-navbar">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link"
              :href="home + '/menu/main/redirect?url=https://molgenis114.gcc.rug.nl/menu/main/apps/aaaacx4r5ehjr6qwhylusdiaai'">
              Biobank explorer - BETA
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
              :href="home + '/menu/main/dataexplorer?entity=eu_bbmri_eric_collections&amp;mod=data&amp;attrs[]=country&amp;attrs[]=biobank&amp;attrs[]=collection&amp;hideselect=true'">
              Directory 3.2
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
              :href="home + '/menu/main/dataexplorer?entity=eu_bbmri_eric_collections&amp;mod=data&amp;attrs%5B%5D=country&amp;attrs%5B%5D=biobank&amp;attrs%5B%5D=collection&amp;hideselect=true&amp;filter=type==RD'">
              Rare Disease Biobanks
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
              :href="home + '/menu/main/redirect?url=https://drive.google.com/file/d/0B0PMkmx_peQ7cmhkdFBncTRzSTg/view?usp=sharing'">
              User Manual
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container mt-1">
      <router-view></router-view>
    </div>
  </div>
</template>

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
