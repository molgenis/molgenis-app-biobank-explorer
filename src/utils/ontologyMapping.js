// Should be better to put this in the data model
const MAPPINGS = {
  properties: {
    diagnosis_available: 'http://purl.obolibrary.org/obo/OGMS_0000073',
    storage_temperatures: 'http://purl.obolibrary.org/obo/OMIABIS_0001013'
  },
  materials: {
    WHOLE_BLOOD: {
      code: 'OBI_0000655',
      uri: 'http://purl.obolibrary.org/obo/OBI_0000655',
      name: 'blood specimen'
    },
    FAECES: {
      code: 'OBI_0002503',
      uri: 'http://purl.obolibrary.org/obo/OBI_0002503',
      name: 'feces specimen'
    },
    PLASMA: {
      code: 'OBI_0100016',
      uri: 'http://purl.obolibrary.org/obo/OBI_0100016',
      name: 'blood plasma specimen'
    },
    SALIVA: {
      code: 'OBI_0002507',
      uri: 'http://purl.obolibrary.org/obo/OBI_0002507',
      name: 'saliva specimen'
    },
    SERUM: {
      code: 'OBI_0100017',
      uri: 'http://purl.obolibrary.org/obo/OBI_0100017',
      name: 'blood serum specimen'
    },
    TISSUE_FROZEN: {
      code: 'OBI_0000922',
      uri: 'http://purl.obolibrary.org/obo/OBI_0000922',
      name: 'frozen specimen'
    }
  },
  data_categories: {
    SURVEY_DATA: {
      code: 'OMIABIS_0000060',
      uri: 'http://purl.obolibrary.org/obo/OMIABIS_0000060',
      name: 'survey data'
    },
    MEDICAL_RECORDS: {
      code: 'OMIABIS_0001027',
      uri: 'http://purl.obolibrary.org/obo/OMIABIS_0001027',
      name: 'sample medical record'
    }
  }
}

export default MAPPINGS
