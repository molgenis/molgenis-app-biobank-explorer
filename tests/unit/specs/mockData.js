import state from '../../../src/store/state'
import filterDefinitions from '../../../src/config/initialFilterFacets'
import i18n from '../../../src/config/i18n'
export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export const baseGetters = {
  uiText: () => i18n.en
}

const mockStateTemplate = {
  // routersync
  route: {
    query: {}
  },
  ...state,
  i18n
}

mockStateTemplate.filterFacets = filterDefinitions

export const mockState = () => JSON.parse(JSON.stringify(mockStateTemplate))

export const mockFilters = { selections: { country: ['EU'], commercial_use: ['false'] }, satisfyAll: [], labels: { country: ['Europe'], commercial_use: ['Non-commercial use'] } }
export const mockFilterOptionDictionary = {
  diagnosis_available: [{ text: '[ ORPHA:352530 ] - Intellectual disability-obesity-brain malformations-facial dysmorphism syndrome', value: 'ORPHA:352530' }],
  country: [{ text: 'Austria', value: 'AT' }]
}

export const mockFilterLoadingDict = { country: '/api/data/eu_bbmri_eric_collections?size=1&filter=id&q=materials=in=(DNA);' }

export const mockSelectedCollections = [{ label: 'Collection A', value: 'A' }, { label: 'Collection B', value: 'B' }]

export const mockCollectionResponse = {
  items: [
    {
      links: {
        self: 'https://localhost/api/data/eu_bbmri_eric_collections/bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89'
      },
      data: {
        id: 'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89',
        biobank: {
          links: {
            self: 'https://localhost/api/data/eu_bbmri_eric_biobanks/bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE'
          },
          data: {
            id: 'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE',
            name: 'AGNES Biobank'
          }
        },
        name: 'Arrhythmia genetics in the Netherlands'
      }
    },
    {
      links: {
        self: 'https://localhost/api/data/eu_bbmri_eric_collections/bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124'
      },
      data: {
        id: 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124',
        biobank: {
          links: {
            self: 'https://localhost/api/data/eu_bbmri_eric_biobanks/bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM'
          },
          data: {
            id: 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM',
            name: 'AMC Renal Transplant Biobank'
          }
        },
        name: 'AMC Renal Transplant Biobank'
      }
    },
    {
      links: {
        self: 'https://localhost/api/data/eu_bbmri_eric_collections/bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211'
      },
      data: {
        id: 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211',
        biobank: {
          links: {
            self: 'https://localhost/api/data/eu_bbmri_eric_biobanks/bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE'
          },
          data: {
            id: 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE',
            name: 'ARGOS Biobank'
          }
        },
        name: 'Association study of coronary heart disease Risk factors in the Genome using an Old-versus-young Setting'
      }
    },
    {
      links: {
        self: 'https://localhost/api/data/eu_bbmri_eric_collections/bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92'
      },
      data: {
        id: 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92',
        biobank: {
          links: {
            self: 'https://localhost/api/data/eu_bbmri_eric_biobanks/bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE'
          },
          data: {
            id: 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE',
            name: 'ARREST Biobank'
          }
        },
        name: 'Amsterdam Ressucitation Studies'
      }
    },
    {
      links: {
        self: 'https://localhost/api/data/eu_bbmri_eric_collections/bbmri-eric:ID:NL_AMCBB:collection:AB17-022'
      },
      data: {
        id: 'bbmri-eric:ID:NL_AMCBB:collection:AB17-022',
        biobank: {
          links: {
            self: 'https://localhost/api/data/eu_bbmri_eric_biobanks/bbmri-eric:ID:NL_AMCBB'
          },
          data: {
            id: 'bbmri-eric:ID:NL_AMCBB',
            name: 'Amsterdam UMC Biobank: Location AMC'
          }
        },
        name: 'Physical Activity and Dietary intervention in OVArian cancer (PADOVA): a RCT evaluating effects on body composition, physical function, and fatigue'
      }
    }]
}

export const mockStudyResponse = {
  id: 's-001',
  title: 'Important study',
  description: 'An important clinical study',
  type: 'Observational',
  age_unit: [
    {
      _href: '/api/v2/eu_bbmri_eric_age_units/YEAR',
      id: 'YEAR',
      label: 'Year'
    }
  ],
  also_known: [
    {
      _href: '/api/v2/eu_bbmri_eric_also_known_in/s001-aka-cs-001',
      id: 'id:001',
      name_system: 'Another catalog',
      pid: 'cs-001',
      url: 'https://another-catalog.eu/study/cs-001',
      withdrawn: false,
      label: 'Another Catalog'
    }
  ],
  collections: [
    {
      id: 'c-001',
      name: 'beautiful collection',
      description: 'beautiful samples',
      order_of_magnitude: {
        _href: '/api/v2/eu_bbmri_eric_biobank_size/3',
        size: '777'
      },
      country: {
        name: 'Genovia'
      },
      network: [
        {
          id: 'network-x',
          name: 'Network x'
        },
        {
          id: 'network-y',
          name: 'Network y'
        }
      ],
      biobank: {
        id: 'b-001',
        name: 'beautiful biobank',
        juridical_person: 'Is this even a person?',
        email: 'info@beautiful-biobank.gnv',
        url: 'https://beautiful-biobank.gnv'
      }
    }
  ],
  age_low: 16,
  number_of_subjects: 373,
  sex: [
    {
      _href: '/api/v2/eu_bbmri_eric_sex_types/MALE',
      id: 'MALE',
      label: 'Male'
    },
    {
      _href: '/api/v2/eu_bbmri_eric_sex_types/FEMALE',
      id: 'FEMALE',
      label: 'Female'
    }
  ]
}
