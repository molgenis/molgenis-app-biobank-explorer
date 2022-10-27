/* eslint-disable camelcase */
import state from '../store/state'

export const getSize = obj => {
  return obj.size
    ? [`${obj.size} samples`]
    : obj.order_of_magnitude && obj.order_of_magnitude.size
      ? [obj.order_of_magnitude.size]
      : []
}

export const mapToString = (object, property, prefix, suffix) => {
  if (!object) return ''

  prefix = prefix ? `${prefix} ` : ''
  suffix = suffix ? ` ${suffix}` : ''
  return object[property] ? `${prefix}${object[property]}${suffix}` : ''
}

export const mapObjArray = (objects) => {
  if (!objects) return []
  if (!objects.some(o => o.uri)) return objects.map(item => item.label || item.name)
  else return objects.map(item => ({ label: item.label || item.name, uri: item.uri || '#' }))
}

export const mapUrl = url =>
  url && (url.startsWith('http') ? url : 'http://' + url)

export const getNameOfHead = head => {
  if (!head) return ''

  const { first_name, last_name, role } = head

  let name = ''

  if (first_name) name += `${first_name} `
  if (last_name) name += `${last_name} `
  if (role) name += `(${role})`

  return name !== '' ? name.trim() : undefined
}

export const getName = contact => {
  const { title_before_name, first_name, last_name, title_after_name } = contact

  let name = ''

  if (title_before_name) name += `${title_before_name} `
  if (first_name) name += `${first_name} `
  if (last_name) name += `${last_name} `
  if (title_after_name) name += ` ${title_after_name}`

  return name !== '' ? name.trim() : undefined
}

export const mapRange = (min, max, unit) => {
  let range = ''
  if ((min || min === 0) && max) {
    range = `${min}-${max} `
  } else if (min || min === 0) {
    range = `> ${min} `
  } else if (max) {
    range = `< ${max} `
  }
  if (range.length > 0 && unit.length) {
    range += unit.map(unit => unit.label).join()
  } else {
    range = undefined
  }
  return range
}

/**
 *
 * @param {*} object collection / biobank
 * @param {*} columns column config
 * @returns viewmodel
 */
export const getViewmodel = (object, columns) => {
  const attributes = []

  for (const columnInfo of columns) {
    let attributeValue

    switch (columnInfo.type) {
      case 'range': {
        const { min, max, unit } = columnInfo
        attributeValue = mapRange(object[min], object[max], object[unit]) || ''
        break
      }
      case 'object': {
        attributeValue = mapToString(object[columnInfo.column], columnInfo.property, columnInfo.prefix, columnInfo.suffix)
        break
      }
      case 'array': {
        attributeValue = object[columnInfo.column]
        break
      }
      case 'quality':
        attributeValue = object.quality
        break
      case 'mref':
      case 'categoricalmref': {
        attributeValue = mapObjArray(object[columnInfo.column])
        break
      }
      default: {
        attributeValue = mapToString(object, columnInfo.column, columnInfo.prefix, columnInfo.suffix)
      }
    }

    const attribute = { label: columnInfo.label, type: columnInfo.type, value: attributeValue }

    if (columnInfo.showCopyIcon) {
      attribute.linkValue = columnInfo.copyValuePrefix ? `${columnInfo.copyValuePrefix}${attributeValue}` : attributeValue
    }
    attributes.push(attribute)
  }

  return { attributes }
}

const mapSubcollections = (collections, level) => {
  const subCollections = []

  for (const collection of collections) {
    if (collection.sub_collections && collection.sub_collections.length) {
      const viewmodel = getViewmodel(collection, state.collectionColumns)
      viewmodel.sub_collections = mapSubcollections(collection.sub_collections, ++level)

      subCollections.push({
        level,
        ...collection,
        viewmodel
      })
    } else {
      subCollections.push({
        level,
        ...collection,
        viewmodel: getViewmodel(collection, state.collectionColumns)
      })
    }
  }
  return subCollections
}

export const getCollectionDetails = collection => {
  const viewmodel = getViewmodel(collection, state.collectionColumns)

  if (collection.sub_collections && collection.sub_collections.length) {
    viewmodel.sub_collections = mapSubcollections(collection.sub_collections, 1)
  }

  return {
    ...collection,
    viewmodel
  }
}

/**
 * Get all the types available within the collection tree
 */
function extractCollectionTypes (collections, prevCollectionHashmap) {
  let collectionTypes = prevCollectionHashmap && Object.keys(prevCollectionHashmap).length ? prevCollectionHashmap : {}

  for (const collection of collections) {
    if (collection.type) {
      const foundTypes = collection.type.map(type => type.label)

      for (const type of foundTypes) {
        // use it as a hashmap
        if (!collectionTypes[type]) {
          collectionTypes[type] = ''
        }
      }
    }

    if (collection.sub_collections && collection.sub_collections.length) {
      const newHashmap = extractCollectionTypes(collection.sub_collections, collectionTypes)
      collectionTypes = { ...collectionTypes, ...newHashmap }
    }
  }
  return collectionTypes
}

export const getBiobankDetails = (biobank) => {
  // check if biobank is only the id (lazy loading)
  if (typeof biobank === 'string') {
    return biobank
  }
  /* new Set makes a hashmap out of an array which makes every entry unique, then we convert it back to an array */
  biobank.collection_types = []

  if (biobank.collections.length) {
    biobank.collection_types = Object.keys(extractCollectionTypes(biobank.collections))
    biobank.collectionDetails = []

    const parentCollections = biobank.collections.filter(collection => !collection.parent_collection)

    for (const collection of parentCollections) {
      biobank.collectionDetails.push(getCollectionDetails(collection))
    }
  }

  return {
    ...biobank,
    viewmodel: getViewmodel(biobank, state.biobankColumns)
  }
}

export const collectionReportInformation = collection => {
  const collectionReport = {}

  collectionReport.head = getNameOfHead(collection.head) || undefined

  if (collection.contact) {
    collectionReport.contact = {
      name: getName(collection.contact),
      email: collection.contact.email ? collection.contact.email : undefined,
      phone: collection.contact.phone ? collection.contact.phone : undefined
    }
  }

  if (collection.biobank) {
    collectionReport.biobank = {
      id: collection.biobank.id,
      name: collection.biobank.name,
      juridical_person: collection.biobank.juridical_person,
      country: collection.country.name,
      report: `/biobank/${collection.biobank.id}`,
      website: mapUrl(collection.biobank.url),
      email: collection.biobank.contact ? collection.biobank.contact.email : undefined,
      partnerCharter: collection.biobank.partner_charter_signed ? 'yes' : 'no'
    }
  }

  if (collection.network) {
    collectionReport.networks = collection.network.map(network => {
      return {
        name: network.name,
        report: `/network/${network.id}`
      }
    })
  }

  collectionReport.certifications = mapObjArray(collection.quality)

  collectionReport.collaboration = []

  if (collection.collaboration_commercial) { collectionReport.collaboration.push({ name: 'Commercial', value: 'yes' }) }
  if (collection.collaboration_non_for_profit) { collectionReport.collaboration.push({ name: 'Not for profit', value: 'yes' }) }

  // Give this information to the report, so we can use it in the breadcrumb.
  if (collection.parent_collection) {
    collectionReport.parentCollection = collection.parent_collection
  }

  return collectionReport
}
export const mapNetworkInfo = data => {
  return data.network.map(network => {
    return {
      name: { value: network.name, type: 'string' },
      report: { value: `/network/${network.id}`, type: 'report' }
    }
  })
}

export const mapContactInfo = instance => {
  return {
    name: {
      value: getNameOfHead(instance.head),
      type: 'string'
    },
    website: { value: mapUrl(instance.url), type: 'url' },
    email: {
      value: instance.contact ? instance.contact.email : undefined,
      type: 'email'
    },
    juridical_person: { value: instance.juridical_person, type: 'string' },
    country: {
      value: instance.country ? instance.country.name : undefined,
      type: 'string'
    }
  }
}

export const mapNetworkData = network => {
  return {
    'Common collection focus': {
      value: network.common_collection_focus,
      type: 'bool'
    },
    'Common charter': {
      value: network.common_charter,
      type: 'bool'
    },
    'Common SOPS': {
      value: network.common_sops,
      type: 'bool'
    },
    'Data access policy': {
      value: network.common_data_access_policy,
      type: 'bool'
    },
    'Sample access policy': {
      value: network.common_sample_access_policy,
      type: 'bool'
    },
    'Common MTA': {
      value: network.common_mta,
      type: 'bool'
    },
    'Common image access policy': {
      value: network.common_image_access_policy,
      type: 'bool'
    },
    'Common image MTA': {
      value: network.common_image_mta,
      type: 'bool'
    },
    'Common representation': {
      value: network.common_representation,
      type: 'bool'
    },
    'Common URL': {
      value: network.common_url,
      type: 'bool'
    }
  }
}
