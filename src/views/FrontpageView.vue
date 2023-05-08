<template>
  <main>
    <section class="d-flex justify-content-center">
      <frontpage-header :header-text="'BBMRI-ERIC Directory'">
        <frontpage-search
          :buttonText="search.buttonText"
          :ariaLabel="search.ariaLabel"
          :searchPlaceholder="search.searchPlaceholder"/>
      </frontpage-header>
    </section>
    <section
      class="d-flex justify-content-between mx-5 my-5 cta-container w-75 mx-auto">
      <frontpage-call-to-action :key="index + cta.ctaText" v-for="(cta, index) in callToActions" :ctaUrl="cta.ctaUrl" :ctaText="cta.ctaText" :bodyHtml="cta.bodyHtml"/>
    </section>
    <section class="d-flex justify-content-between mx-auto mb-5 w-75">
      <frontpage-biobank-spotlight
        :headerText="biobankSpotlight.header"
        :biobankName="biobankSpotlight.biobankName"
        :biobankId="biobankSpotlight.biobankId"
        :bodyHtml="biobankSpotlight.bodyHtml"
        :buttonText="biobankSpotlight.buttonText"/>
      <frontpage-collection-spotlight
        :headerText="collectionSpotlight.header"
        :collections="collectionSpotlight.collections"/>
    </section>
  </main>
</template>

<script>
import FrontpageBiobankSpotlight from '../components/frontpage-components/FrontpageBiobankSpotlight.vue'
import FrontpageCallToAction from '../components/frontpage-components/FrontpageCallToAction.vue'
import FrontpageHeader from '../components/frontpage-components/FrontpageHeader.vue'
import FrontpageCollectionSpotlight from '../components/frontpage-components/FrontpageCollectionSpotlight.vue'
import FrontpageSearch from '../components/frontpage-components/FrontpageSearch.vue'
import { mapState } from 'vuex'

export default {
  components: {
    FrontpageHeader,
    FrontpageSearch,
    FrontpageCallToAction,
    FrontpageBiobankSpotlight,
    FrontpageCollectionSpotlight
  },
  computed: {
    ...mapState(['landingpage']),
    search () {
      return this.landingpage.page_search
    },
    biobankSpotlight () {
      return this.landingpage.page_biobank_spotlight
    },
    collectionSpotlight () {
      return this.landingpage.page_collection_spotlight
    },
    callToActions () {
      return this.landingpage.page_call_to_actions
    }
  }
}
</script>
