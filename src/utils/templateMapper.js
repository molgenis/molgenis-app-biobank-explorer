/* eslint-disable camelcase */
export const getSize = obj => {
  return obj.size
    ? [`${obj.size} samples`]
    : obj.order_of_magnitude && obj.order_of_magnitude.size
      ? [obj.order_of_magnitude.size]
      : []
}
export const mapObjArray = (objects) => {
  if (!objects) return []
  if (!objects.some(o => o.uri)) return objects.map(item => item.label)
  else return objects.map(item => ({ label: item.label, uri: item.uri || '#' }))
}

export const mapUrl = url =>
  url && (url.startsWith('http') ? url : 'http://' + url)

export const getNameOfHead = element => {
  const { head_firstname, head_lastname, head_role } = element

  let name = ''

  if (head_firstname) name += `${head_firstname} `
  if (head_lastname) name += `${head_lastname} `
  if (head_role) name += `(${head_role})`

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

export const mapAgeRange = (minAge, maxAge, ageUnit) => {
  let ageRange = ''
  if ((minAge || minAge === 0) && maxAge) {
    ageRange = `${minAge}-${maxAge} `
  } else if (minAge || minAge === 0) {
    ageRange = `> ${minAge} `
  } else if (maxAge) {
    ageRange = `< ${maxAge} `
  }
  if (ageRange.length > 0 && ageUnit.length) {
    ageRange += ageUnit.map(unit => unit.label).join()
  } else {
    ageRange = undefined
  }
  return ageRange
}

export const mapCollectionsDetailsTableContent = collection => {
  return {
    ...collection,
    sub_collections: collection.sub_collections ? collection.sub_collections.map(subCol => mapCollectionsDetailsTableContent(subCol)) : [],
    Size: {
      value: getSize(collection),
      type: 'list',
      badgeColor: 'success'
    },
    Age: {
      value: mapAgeRange(collection.age_low, collection.age_high, collection.age_unit),
      type: 'string-with-key'
    },
    Type: {
      value: mapObjArray(collection.type),
      type: 'list',
      badgeColor: 'info'
    },
    Sex: {
      value: mapObjArray(collection.sex),
      type: 'list',
      badgeColor: 'secondary'
    },
    Materials: {
      value: mapObjArray(collection.materials),
      type: 'list',
      badgeColor: 'danger'
    },
    Storage: {
      value: mapObjArray(collection.storage_temperatures),
      type: 'list',
      badgeColor: 'warning'
    },
    Data: {
      value: mapObjArray(collection.data_categories),
      type: 'list',
      badgeColor: 'info'
    },
    Diagnosis: {
      value: mapObjArray(collection.diagnosis_available),
      type: 'list',
      badgeColor: 'primary'
    },
    DataUse: {
      value: mapObjArray(collection.data_use),
      type: 'list',
      badgeColor: 'success'
    }
  }
}

export const collectionReportInformation = collection => {
  const collectionReport = {}

  collectionReport.head = getNameOfHead(collection) || undefined

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
      value: getNameOfHead(instance),
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
