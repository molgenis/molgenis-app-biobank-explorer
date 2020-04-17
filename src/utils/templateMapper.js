export const getSize = obj => {
  return obj.size
    ? [`${obj.size} samples`]
    : obj.order_of_magnitude && obj.order_of_magnitude.size
      ? [obj.order_of_magnitude.size]
      : []
}
export const mapObjArrayToStringArrayIfExists = obj =>
  obj ? obj.map(item => item.label) : []
export const mapUrl = url =>
  url && (url.startsWith('http') ? url : 'http://' + url)
export const getNameOfHead = element => {
  let name = ''
  if (element.head_lastname) {
    if (element.head_firstname) {
      name += element.head_firstname + ' '
    }
    name += element.head_lastname
    if (element.head_role) {
      name += ' (' + element.head_role + ')'
    }
  }
  if (name !== '') {
    return name
  }
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

export const mapDetailsTableContent = report => {
  return {
    Size: {
      value: getSize(report),
      type: 'list',
      badgeColor: 'success'
    },
    Age: {
      value: mapAgeRange(report.age_low, report.age_high, report.age_unit),
      type: 'string-with-key'
    },
    Type: {
      value: mapObjArrayToStringArrayIfExists(report.type),
      type: 'list',
      badgeColor: 'info'
    },
    Sex: {
      value: mapObjArrayToStringArrayIfExists(report.sex),
      type: 'list',
      badgeColor: 'secondary'
    },
    Materials: {
      value: mapObjArrayToStringArrayIfExists(report.materials),
      type: 'list',
      badgeColor: 'danger'
    },
    Storage: {
      value: mapObjArrayToStringArrayIfExists(report.storage_temperatures),
      type: 'list',
      badgeColor: 'warning'
    },
    Data: {
      value: mapObjArrayToStringArrayIfExists(report.data_categories),
      type: 'list',
      badgeColor: 'info'
    },
    Diagnosis: {
      value: mapObjArrayToStringArrayIfExists(report.diagnosis_available),
      type: 'list',
      badgeColor: 'primary'
    }
  }
}

export const mapCollectionDetailsListContent = collection => {
  return {
    contact: {
      name: {
        value: getNameOfHead(collection),
        type: 'string'
      },
      email: {
        value: collection.contact ? collection.contact.email : undefined,
        type: 'email'
      },
      phone: {
        value: collection.contact ? collection.contact.phone : undefined,
        type: 'phone'
      }
    },
    biobank: {
      name: { value: collection.biobank.name, type: 'string' },
      juridical_person: {
        value: collection.biobank.juridical_person,
        type: 'string'
      },
      country: { value: collection.country.name, type: 'string' },
      report: { value: `/biobank/${collection.biobank.id}`, type: 'report' },
      website: { value: mapUrl(collection.biobank.url), type: 'url' },
      email: {
        value: collection.biobank.contact
          ? collection.biobank.contact.email
          : undefined,
        type: 'email'
      },
      // 'Biobank id': { value: collection.biobank.id, type: 'string-with-header' },
      'Partner charter': {
        value: collection.biobank.partner_charter_signed,
        type: 'bool'
      }
    },
    networks: mapNetworkInfo(collection),
    quality: {
      Certification: {
        value: mapObjArrayToStringArrayIfExists(collection.quality),
        type: 'list'
      }
    },
    collaboration: {
      Commercial: { value: collection.collaboration_commercial, type: 'bool' },
      'Not for profit': {
        value: collection.collaboration_non_for_profit,
        type: 'bool'
      }
    }
  }
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

export const mapCollectionsData = collections => {
  return collections.map(collection => {
    return {
      description: collection.description ? collection.description : undefined,
      parentCollection: collection.parent_collection,
      // Max depth supported in current api call is sub-sub-collections, if you go deeper, you get an empty list
      subCollections:
        collection.sub_collections && collection.sub_collections.length > 0
          ? mapCollectionsData(collection.sub_collections)
          : [],
      name: collection.name,
      id: collection.id,
      content: {
        Size: {
          value: getSize(collection),
          type: 'list',
          badgeColor: 'success'
        },
        Materials: {
          value: mapObjArrayToStringArrayIfExists(collection.materials),
          type: 'list',
          badgeColor: 'danger'
        },
        Data: {
          value: mapObjArrayToStringArrayIfExists(collection.data_categories),
          type: 'list',
          badgeColor: 'info'
        }
      }
    }
  })
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
