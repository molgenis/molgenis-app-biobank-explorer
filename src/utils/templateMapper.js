const mapObjArrayToStringArrayIfExists = (obj) => obj ? obj.map((item) => item.label) : []
const mapBoolToString = (bool) => bool ? 'Yes' : 'No'
const mapBadgeColorForBool = (bool) => bool ? 'success' : 'danger'

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
    ageRange += ageUnit.map((unit) => unit.label).join()
  } else {
    ageRange = undefined
  }
  return ageRange
}

export const mapDetailsTableContent = (report) => {
  return {
    stringValues: {
      Size: report.order_of_magnitude.size ? report.order_of_magnitude.size + ' participants' : undefined,
      Age: mapAgeRange(report.age_low, report.age_high, report.age_unit)
    },
    listValues: {
      Type: {
        values: mapObjArrayToStringArrayIfExists(report.type),
        badgeColor: 'info'
      },
      Sex: {
        values: mapObjArrayToStringArrayIfExists(report.sex),
        badgeColor: 'secondary'
      },
      Materials: {
        values: mapObjArrayToStringArrayIfExists(report.material),
        badgeColor: 'danger'
      },
      Storage: {
        values: mapObjArrayToStringArrayIfExists(report.storage_temperatures),
        badgeColor: 'warning'
      },
      Data: {
        values: mapObjArrayToStringArrayIfExists(report.data_categories),
        badgeColor: 'primary'
      },
      Diagnosis: {
        values: mapObjArrayToStringArrayIfExists(report.diagnosis_available),
        badgeColor: 'primary'
      }
    }
  }
}

export const mapCollectionDetailsListContent = (collection) => {
  return {
    contact: {
      name: {
        value: collection.head_lastname ? `${collection.head_firstname} ${collection.head_lastname} ${collection.head_role ? '(' + collection.head_role + ')' : ''} ` : undefined,
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
      name: {value: collection.biobank.name, type: 'string'},
      juridical_person: {value: collection.biobank.juridical_person, type: 'string'},
      country: {value: collection.country.name, type: 'string'},
      report: {value: `/biobank/report/${collection.biobank.id}`, type: 'report'},
      website: {value: collection.biobank.url, type: 'url'},
      email: {value: collection.biobank.contact ? collection.biobank.contact.email : undefined, type: 'email'}
    },
    networks: mapNetworkInfo(collection),
    quality: {
      'Partner charter': {value: collection.biobank.partner_charter_signed, type: 'bool'},
      Certification: {value: mapObjArrayToStringArrayIfExists(collection.biobank.quality), type: 'list'}
    },
    collaboration: {
      Commercial: {value: collection.collaboration_commercial, type: 'bool'},
      'Not for profit': {value: collection.collaboration_non_for_profit, type: 'bool'}
    }
  }
}

export const mapNetworkInfo = (data) => {
  return data.network.map((network) => {
    return {
      name: {value: network.name, type: 'string'},
      report: {value: `/network/report/${network.id}`, type: 'report'}
    }
  })
}

export const mapContactInfo = (instance) => {
  return {
    website: {value: instance.url, type: 'url'},
    email: {value: instance.contact ? instance.contact.email : undefined, type: 'email'},
    juridical_person: {value: instance.juridical_person, type: 'string'},
    country: {value: instance.country ? instance.country.name : undefined, type: 'string'}
  }
}

export const mapCollectionsData = (collections) => {
  return collections.map(
    (collection) => {
      return {
        description: collection.description ? collection.description : undefined,
        parentCollection: collection.parent_collection,
        subCollections: mapCollectionsData(collection.sub_collections),
        name: collection.name,
        id: collection.id,
        tableContent: {
          stringValues: {},
          listValues: {
            Size: {
              values: collection.order_of_magnitude.size ? [collection.order_of_magnitude.size] : [],
              badgeColor: 'success'
            },
            Materials: {
              values: mapObjArrayToStringArrayIfExists(collection.materials),
              badgeColor: 'danger'
            },
            Data: {
              values: mapObjArrayToStringArrayIfExists(collection.data_categories),
              badgeColor: 'primary'
            }
          }
        }
      }
    })
}

export const mapNetworkData = (network) => {
  return {
    stringValues: {},
    listValues: {
      'Common collection focus': {
        values: [mapBoolToString(network.common_collection_focus)],
        badgeColor: mapBadgeColorForBool(network.common_collection_focus)
      },
      'Common charter': {
        values: [mapBoolToString(network.common_charter)],
        badgeColor: mapBadgeColorForBool(network.common_charter)
      },
      'Common SOPS': {
        values: [mapBoolToString(network.common_sops)],
        badgeColor: mapBadgeColorForBool(network.common_sops)
      },
      'Data access policy': {
        values: [mapBoolToString(network.common_data_access_policy)],
        badgeColor: mapBadgeColorForBool(network.common_data_access_policy)
      },
      'Sample access policy': {
        values: [mapBoolToString(network.common_sample_access_policy)],
        badgeColor: mapBadgeColorForBool(network.common_sample_access_policy)
      },
      'Common MTA': {
        values: [mapBoolToString(network.common_mta)],
        badgeColor: mapBadgeColorForBool(network.common_mta)
      },
      'Common image access policy': {
        values: [mapBoolToString(network.common_image_access_policy)],
        badgeColor: mapBadgeColorForBool(network.common_image_access_policy)
      },
      'Common image MTA': {
        values: [mapBoolToString(network.common_image_mta)],
        badgeColor: mapBadgeColorForBool(network.common_image_mta)
      },
      'Common representation': {
        values: [mapBoolToString(network.common_representation)],
        badgeColor: mapBadgeColorForBool(network.common_representation)
      },
      'Common URL': {
        values: [mapBoolToString(network.common_url)],
        badgeColor: mapBadgeColorForBool(network.common_url)
      }
    }
  }
}
