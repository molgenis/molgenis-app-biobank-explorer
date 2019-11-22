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

const mapObjArrayToStringArrayIfExists = (obj) => obj ? obj.map((item) => item.label) : []

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

export const mapDetailsListContent = (report) => {
  return {
    contact: {
      name: {
        value: report.head_lastname ? `${report.head_firstname} ${report.head_lastname} ${report.head_role ? '(' + report.head_role + ')' : ''} ` : undefined,
        type: 'string'
      },
      email: {
        value: report.contact ? report.contact.email : undefined,
        type: 'email'
      },
      phone: {
        value: report.contact ? report.contact.phone : undefined,
        type: 'phone'
      }
    },
    biobank: {
      name: {value: report.biobank.name, type: 'string'},
      juridical_person: {value: report.biobank.juridical_person, type: 'string'},
      country: {value: report.country.name, type: 'string'},
      website: {value: report.biobank.url, type: 'url'},
      email: {value: report.biobank.contact.email, type: 'email'}
    },
    quality: {
      'Partner charter': {value: report.biobank.partner_charter_signed, type: 'bool'},
      Certification: {value: mapObjArrayToStringArrayIfExists(report.biobank.quality), type: 'list'}
    },
    collaboration: {
      Commercial: {value: report.collaboration_commercial, type: 'bool'},
      'Not for profit': {value: report.collaboration_non_for_profit, type: 'bool'}
    }
  }
}
