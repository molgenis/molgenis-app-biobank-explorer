import { fixCollectionTree } from './helpers'
import { covid19NetworkId, covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from './helpers/covid19Helper'
import Vue from 'vue'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

const combineCodeAndLabels = (diagnoses) => {
  return diagnoses.map(diagnosis => {
    diagnosis.originalLabel = diagnosis.label
    diagnosis.label = diagnosis.code + ' - ' + diagnosis.label
    return diagnosis
  })
}

export default {
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  UpdateFilter (state, { name, value }) {
    Vue.set(state.filters.selections, name, value)
  },
  UpdateAllFilters (state, selections) {
    state.filters.selections = {}
    for (const [key, value] of Object.entries(selections)) {
      Vue.set(state.filters.selections, key, value)
    }
  },
  /**
   * Reset all filters in the state
   */
  ResetFilters (state) {
    state.filters.selections = {}
  },
  SetBiobanks (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  SetBiobankIds (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  SetCollectionInfo (state, collectionInfo) {
    state.collectionInfo = collectionInfo
  },
  SetCovid19Network (state, covid19FacetSelectionIds) {
    const biobankNetwork = state.biobank_network.filters
    const collectionNetwork = state.collection_network.filters
    const addForBiobank = covid19FacetSelectionIds.includes(covid19BiobankNetworkSelectionId)
    const addForNetwork = covid19FacetSelectionIds.includes(covid19CollectionNetworkSelectionId)

    // clear state
    if (biobankNetwork.includes(covid19NetworkId)) biobankNetwork.splice(biobankNetwork.indexOf(covid19NetworkId), 1)
    if (collectionNetwork.includes(covid19NetworkId)) collectionNetwork.splice(collectionNetwork.indexOf(covid19NetworkId), 1)

    if (addForBiobank) Vue.set(state.biobank_network, 'filters', [...biobankNetwork, covid19NetworkId])
    else Vue.set(state.biobank_network, 'filters', biobankNetwork)

    if (addForNetwork) Vue.set(state.collection_network, 'filters', [...collectionNetwork, covid19NetworkId])
    else Vue.set(state.collection_network, 'filters', collectionNetwork)
  },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  SetBiobankReport (state, biobank) {
    state.biobankReport = biobank
  },
  SetCollectionReport (state, collection) {
    state.collectionReport = collection
  },
  SetNetworkReport (state, network) {
    state.networkReport.network = network
  },
  SetNetworkCollections (state, collections) {
    state.networkReport.collections = collections
  },
  SetNetworkBiobanks (state, biobanks) {
    state.networkReport.biobanks = biobanks
  },
  /**
   *
   * @param state
   * @param params
   */
  MapQueryToState (state, params) {
    const query = state.route.query

    if (params && params.diagnoses) {
      state.filters.selections.diagnosis_available = combineCodeAndLabels(params.diagnoses)
    }

    if (query.collection_quality) {
      state.filters.selections.collection_quality = query.collection_quality.split(',')
    }

    if (query.search) {
      state.filters.selections.search = query.search
    }

    if (query.country) {
      state.filters.selections.country = query.country.split(',')
    }

    if (query.materials) {
      state.filters.selections.materials = query.materials.split(',')
    }

    if (query.type) {
      state.filters.selections.type = query.type.split(',')
    }

    if (query.dataType) {
      state.filters.selections.dataType = query.dataType.split(',')
    }

    if (query.covid19) {
      state.filters.selections.covid19 = query.covid19.split(',')
    }

    if (query.biobank_network) {
      state.filters.selections.biobank_network = query.biobank_network.split(',')
    }

    if (query.biobank_quality) {
      state.filters.selections.biobank_quality = query.biobank_quality.split(',')
    }

    if (query.collection_network) {
      state.filters.selections.collection_network = query.collection_network.split(',')
    }

    if (query.covid19network) {
      const selectedCovid19NetworkIds = query.covid19network.split(',')
      state.filters.selections.covid19network = selectedCovid19NetworkIds
      this.commit('SetCovid19Network', selectedCovid19NetworkIds)
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }
  },
  SetError (state, error) {
    state.error = error
  },
  SetLoading (state, loading) {
    state.isLoading = loading
  },
  SetPodium (state, response) {
    state.isPodium = response.items.map(item => item.id.toLowerCase()).some(id => id.includes('podium'))
  },
  SetPodiumCollections (state, response) {
    state.podiumCollectionIds = response.items.map(pc => pc.data.id)
  },
  SetNegotiatorEntities (state, negotiatorConfig) {
    const negotiatorEntities = negotiatorConfig.items.map(nci => {
      return { id: nci.id, collectionEntityId: nci.entity.id, biobankEntityId: nci.biobankId.refEntityType.id } // We need to have the table
    }).filter(ne => negotiatorConfigIds.includes(ne.id))[0]

    if (negotiatorEntities) {
      state.negotiatorCollectionEntityId = negotiatorEntities.collectionEntityId
      state.negotiatorBiobankEntityId = negotiatorEntities.biobankEntityId
    }
  }
}
