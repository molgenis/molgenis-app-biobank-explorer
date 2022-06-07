import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { createInQuery, createQuery } from '../../utils'
import { COLLECTION_API_PATH, COLLECTION_QUALITY_INFO_API_PATH } from '../actions'
/**/
import { flatten } from 'lodash'
import initialCollectionColumns from '../../config/initialCollectionColumns'

export const COLLECTION_REPORT_ATTRIBUTE_SELECTOR = () => {
  const collectionRsql = initialCollectionColumns.filter(icc => icc.rsql).map(prop => prop.rsql)

  let rsqlStart = '*,'

  if (collectionRsql.length) {
    rsqlStart += collectionRsql.join(',')
  }

  return `${rsqlStart},biobank(id,name,juridical_person,country,url,contact),contact(title_before_name,first_name,last_name,title_after_name,email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials(label,uri),data_categories)`
}

export const collectionActions = {

  async initializeCollectionRelationData ({ commit }) {
    // biobank_label is a mapping in the collection table to the name column of biobank table
    const url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank(id,name,label),name,label,collaboration_commercial,parent_collection&expand=biobank&size=10000&sort=biobank_label'

    const response = await api.get(url).catch(error => commit('SetError', error))
    commit('SetAllCollectionRelationData', response)
  },
  async updateCollectionRelationData ({ state, getters, commit }) {
    // &q=ressource_types=in=(BIOBANK);materials=in=(DNA,PLASMA)
    // biobank_label is a mapping in the collection table to the name column of biobank table
    if (Object.keys(getters.activeFilters).length > 0) {
      const dynamicFilters = []
      const allFilt = getters.getFilters
      for (const filter in allFilt) {
        if (allFilt[filter].dynamic) {
          dynamicFilters.push(allFilt[filter])
        }
      }
      console.log(state.filterOptionDictionary)
      // for (const filter in dynamicFilters) {
      //   for (const activeFilter in getters.activeFilters) {
      //     // skip the filter that was just changed
      //     const dynamicFilterName = dynamicFilters[filter].name
      //     if (activeFilter !== dynamicFilterName) {
      //       // var tempList = ''
      //       const table = dynamicFilters[filter].tableName
      //       const query = '/api/v2/' + table + '?filter=id'
      //       const response = await api.get(query).catch(error => commit('SetError', error))
      //       for (const item in response.items) {
      //         const filterOption = response.items[item].id
      //         const url = '/api/v2/eu_bbmri_eric_collections?q=country=in=(AT)'
      //         const optionString = ';materials=in=(' + filterOption + ')'
      //         const response_ = await api.get(url + optionString).catch(error => commit('SetError', error))
      //         commit('setDynamicFilterData', { response_, filterOption })
      //       }
      //     }
      //   }
      // }
    }
  },
  /*
   * Retrieves all collection identifiers matching the collection filters, and their biobanks
   */
  async GetCollectionInfo ({ state, commit, getters, dispatch }) {
    // check if initial data is present, else fetch that first
    if (state.collectionRelationData.length === 0) {
      await dispatch('initializeCollectionRelationData')
    }

    commit('SetCollectionInfo', undefined)
    let url = '/api/data/eu_bbmri_eric_collections?filter=id&size=10000&sort=biobank_label'
    if (getters.rsql) {
      url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
    }
    api.get(url)
      .then(response => {
        commit('SetCollectionInfo', response)
        commit('CalculateBiobankCount', getters)
      }, error => {
        commit('SetError', error)
      })
  },
  GetCollectionReport ({ commit }, collectionId) {
    commit('SetLoading', true)
    api.get(`${COLLECTION_API_PATH}/${collectionId}?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR()}`).then(response => {
      commit('SetCollectionReport', response)
      commit('SetLoading', false)
    }, error => {
      commit('SetError', error)
      commit('SetLoading', false)
    })
  },
  // We need to get id's to use in RSQL later, because we can't do a join on this table
  GetCollectionIdsForQuality ({ state, commit }) {
    const collectionQuality = state.route.query.collection_quality ? state.route.query.collection_quality : null
    const qualityIds = state.filters.selections.collection_quality ?? collectionQuality
    const selection = 'assess_level_col'
    if (qualityIds && qualityIds.length > 0) {
      const query = encodeRsqlValue(transformToRSQL({
        operator: 'AND',
        operands: flatten([
          state.filters.satisfyAll.includes('collection_quality')
            ? createQuery(qualityIds, selection, state.filters.satisfyAll.includes('collection_quality'))
            : createInQuery(selection, qualityIds)
        ])
      }
      ))
      api.get(`${COLLECTION_QUALITY_INFO_API_PATH}?attrs=collection(id)&q` + query).then(response => {
        commit('SetCollectionIdsWithSelectedQuality', response)
      })
    } else {
      commit('SetCollectionIdsWithSelectedQuality', [])
    }
  },
  AddCollectionsToSelection ({ commit, getters }, { collections, bookmark }) {
    commit('SetCartValidationStatus', false)
    commit('SetCollectionsToSelection', { collections, bookmark })
    commit('SetSearchHistory', getters.getHumanReadableString)
  },
  GetPodiumCollections ({ state, commit }) {
    if (state.isPodium && state.podiumCollectionIds.length === 0) { // only fetch once.
      api.get("/api/data/eu_bbmri_eric_collections?num=10000&filter=id&q=podium!=''").then(response => {
        commit('SetPodiumCollections', response)
      })
    }
  },
  GetFilterReduction ({ state, commit, getters }) {
    // prepare async function and build correct query URLs for
    // the api/v2 - implementation of sql: DISTINCT command.
    // E.G. for country: ?aggs=x==country;distinct==country
    async function fetchData (url, filterName) {
      // asnyc function so we can load data and commit it right away
      api.get(url).then(response => {
        const load = { filter: filterName, options: response.aggs.xLabels }
        commit('SetFilterReduction', load)
      }, error => {
        commit('SetError', error)
      })
    }
    // prepare baseUrl and set list for dynamic filters that will be updated
    const baseUrl = '/api/v2/eu_bbmri_eric_collections'
    const dynamicFilters = []
    const dynFilt = getters.getFilters

    for (const filter in dynFilt) {
      if (dynFilt[filter].dynamic) {
        dynamicFilters.push(dynFilt[filter].name)
      }
    }
    // if there is no activeFilter (anymore):
    // reset the dynamic filters:
    commit('ResetDynamicFilters', dynamicFilters)
    if (Object.keys(getters.activeFilters).length === 0) {
      return 0
    }

    // iterate over previously defined dynamic filters
    // and create one query URL for each dynamic filter
    for (const filter in dynamicFilters) {
      const filterName = dynamicFilters[filter]
      const unique = `?aggs=x==${filterName};distinct==${filterName}`

      var additionalFilters = '&q='

      for (const activeFilter in getters.activeFilters) {
      // skip the filter that was just changed
        if (activeFilter !== filterName) {
          var tempList = ''
          // iterate over active filters and add its ID to tempList (E.G: DNA,SERUM,)
          for (const option in getters.activeFilters[activeFilter]) {
            tempList = tempList + `${getters.activeFilters[activeFilter][option]},`
          }
          // remove the last comma from URL:
          tempList = tempList.slice(0, -1)
          additionalFilters = additionalFilters + `${activeFilter}=in=(${tempList});`
        }
      }

      // remove the last semicolon from URL:
      additionalFilters = additionalFilters.slice(0, -1)
      // construct query URL and fetch data for each dynamic filter:
      var url = baseUrl + unique + additionalFilters
      if (url.at(url.length - 1) === 'q') {
        url = url.slice(0, -2)
      }

      // /api/v2/eu_bbmri_eric_collections?aggs=x==materials;distinct==materials&q=country=in=(DE)
      // /api/v2/eu_bbmri_eric_collections?aggs=x==country;distinct==country&q=materials=in=(DNA)
      console.log(state.collectionRelationData)
      // console.log(state.biobanks)

      fetchData(url, filterName)
    }
  }
}
