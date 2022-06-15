<template>
  <div>
    <b-form-checkbox
      id="covidBiobankNetwork"
      :checked="network"
      @change="setNetwork($event)"
      name="covidBiobankNetwork">
      Biobanks providing COVID-19 services
    </b-form-checkbox>
    <b-form-checkbox
      id="covidCollectionNetwork"
      :checked="collectionNetwork"
      @change="setCollectionNetwork($event)"
      name="covidCollectionNetwork">
      COVID-19 collections
    </b-form-checkbox>
  </div>
</template>

<script>
/* istanbul ignore file */

import { mapState, mapMutations } from 'vuex'
const covid19NetworkId = 'bbmri-eric:networkID:EU_BBMRI-ERIC:networks:COVID19'

export default {
  name: 'CovidNetworkFilter',
  methods: {
    ...mapMutations(['UpdateFilterSelection']),

    setNetwork (checked) {
      let networkSelection = this.filters.selections.network || []

      if (checked && !networkSelection.includes(covid19NetworkId)) {
        networkSelection.push(covid19NetworkId)
      } else if (!checked) {
        networkSelection = networkSelection.filter(network => network !== covid19NetworkId)
      }
      this.UpdateFilterSelection({ name: 'network', value: networkSelection })
    },
    setCollectionNetwork (checked) {
      let collectionNetworkSelection = this.filters.selections.collection_network || []

      if (checked && !collectionNetworkSelection.includes(covid19NetworkId)) {
        collectionNetworkSelection.push(covid19NetworkId)
      } else if (!checked) {
        collectionNetworkSelection = collectionNetworkSelection.filter(network => network !== covid19NetworkId)
      }
      this.UpdateFilterSelection({ name: 'collection_network', value: collectionNetworkSelection })
    }
  },
  computed: {
    ...mapState(['filters']),
    network: {
      get () {
        const network = this.filters.selections.network
        if (
          network &&
          network.length > 0 &&
          network.includes(covid19NetworkId)
        ) {
          return true
        }
        return false
      }
    },
    collectionNetwork: {
      get () {
        const network = this.filters.selections.collection_network
        if (
          network &&
          network.length > 0 &&
          network.includes(covid19NetworkId)
        ) {
          return true
        }
        return false
      }
    }
  }
}
</script>
