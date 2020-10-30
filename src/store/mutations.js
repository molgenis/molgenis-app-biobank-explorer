import { getUniqueIdArray } from '../utils'
import { fixCollectionTree } from './helpers'
import { covid19NetworkFacetName, covid19NetworkId, covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from './helpers/covid19Helper'
import Vue from 'vue'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

const combineCodeAndLabels = (diagnoses) => {
  return diagnoses.map(diagnosis => {
    diagnosis.originalLabel = diagnosis.label
    diagnosis.label = diagnosis.code + ' - ' + diagnosis.label
    return diagnosis
  })
}

const getUniqueFilterMatches = (filter, selector) => {
  const matches = filter.map((match) => { return match[selector].id })
  return getUniqueIdArray(matches)
}

const hasFilterWithoutMatches = (filter, matches) => {
  return filter.length && !matches.length
}

export default {
  /**
   * Update the options for the different filters available in the biobank explorer
   */
  SetCountries (state, countries) {
    state.country.options = countries
  },
  SetMaterials (state, materials) {
    state.materials.options = materials
  },
  SetCollectionQuality (state, collectionQuality) {
    state.collection_quality.options = collectionQuality
  },
  SetBiobankQuality (state, biobankQuality) {
    state.biobank_quality.options = biobankQuality
  },
  SetCollectionTypes (state, types) {
    state.type.options = types
  },
  SetDataTypes (state, dataTypes) {
    state.dataType.options = dataTypes
  },
  SetDiagnosisAvailable (state, diagnoses) {
    state.diagnosis_available.options = combineCodeAndLabels(diagnoses)
  },
  SetSearch (state, search) {
    state.search = search
  },
  SetCollectionQualityCollections (state, collections) {
    state.collection_quality.collections = hasFilterWithoutMatches(state.collection_quality.filters, collections) ? ['invalid_collection'] : getUniqueFilterMatches(collections, 'collection')
  },
  SetBiobankQualityBiobanks (state, biobanks) {
    state.biobank_quality.biobanks = hasFilterWithoutMatches(state.biobank_quality.filters, biobanks) ? ['invalid_biobank'] : getUniqueFilterMatches(biobanks, 'biobank')
  },
  SetCovid19 (state, covid19) {
    state.covid19.options = covid19
  },
  SetNetworkOptions (state, network) {
    const networkOptionsWithoutCovid19 = network.filter(network => network.id !== covid19NetworkId)
    state.biobank_network.options = networkOptionsWithoutCovid19
    state.collection_network.options = networkOptionsWithoutCovid19
  },
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  UpdateFilter (state, { name, filters }) {
    if (name === covid19NetworkFacetName) this.commit('SetCovid19Network', filters)
    if (name === 'search') state.search = ''
    else {
      state[name].filters = filters
    }
  },
  /**
   * Reset all filters in the state
   */
  ResetFilters (state) {
    state.diagnosis_available.filters = []
    state.materials.filters = []
    state.country.filters = []
    state.collection_quality.filters = []
    state.collection_quality.collections = []
    state.biobank_quality.filters = []
    state.biobank_quality.biobanks = []
    state.type.filters = []
    state.dataType.filters = []
    state.covid19.filters = []
    state.covid19network.filters = []
    state.biobank_network.filters = []
    state.collection_network.filters = []
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
      state.diagnosis_available.filters = combineCodeAndLabels(params.diagnoses)
    }

    if (query.collection_quality) {
      state.collection_quality.filters = query.collection_quality.split(',')
    }

    if (query.search) {
      state.search = query.search
    }

    if (query.country) {
      state.country.filters = query.country.split(',')
    }

    if (query.materials) {
      state.materials.filters = query.materials.split(',')
    }

    if (query.type) {
      state.type.filters = query.type.split(',')
    }

    if (query.dataType) {
      state.dataType.filters = query.dataType.split(',')
    }

    if (query.covid19) {
      state.covid19.filters = query.covid19.split(',')
    }

    if (query.biobank_network) {
      state.biobank_network.filters = query.biobank_network.split(',')
    }

    if (query.biobank_quality) {
      state.biobank_quality.filters = query.biobank_quality.split(',')
    }

    if (query.collection_network) {
      state.collection_network.filters = query.collection_network.split(',')
    }

    if (query.covid19network) {
      const selectedCovid19NetworkIds = query.covid19network.split(',')
      state.covid19network.filters = selectedCovid19NetworkIds
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
