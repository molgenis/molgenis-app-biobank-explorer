<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" :href="homeLink">
        <img class="img-responsive" width="140" height="35"
             :src="imageSourceLink" alt="BBMRI-ERIC">
      </a>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-molgenis-navbar"
              aria-controls="bs-molgenis-navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="bs-molgenis-navbar">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link"
               :href="directoryLink">
              Directory 4.0
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
               :href="advancedDirectoryLink">
              Directory 4.0 (Advanced search)
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
               :href="rareDiseaseBiobanksLink">
              Rare Disease Biobanks
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
               :href="userManualLink">
              User Manual
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
               :href="referencesLink">
              References
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link"
               :href="feedbackLink">
              Feedback
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
        homeLink: INITIAL_STATE.serverUrl,
        imageSourceLink: INITIAL_STATE.imageSourceLink,
        directoryLink: INITIAL_STATE.menuLinks.directoryLink,
        advancedDirectoryLink: INITIAL_STATE.menuLinks.advancedDirectoryLink,
        rareDiseaseBiobanksLink: INITIAL_STATE.menuLinks.rareDiseaseBiobanksLink,
        userManualLink: INITIAL_STATE.menuLinks.userManualLink,
        referencesLink: INITIAL_STATE.menuLinks.referencesLink,
        feedbackLink: INITIAL_STATE.menuLinks.feedbackLink
      }
    }
  }
</script>
