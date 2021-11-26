import state from '../../../src/store/state'
import filterDefinitions from '../../../src/utils/filterDefinitions'

export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

const mockStateTemplate = {
  // routersync
  route: {
    query: {}
  },
  ...state
}

mockStateTemplate.filterFacets = filterDefinitions(mockStateTemplate)

export const mockState = () => JSON.parse(JSON.stringify(mockStateTemplate))

export const mockFilters = { selections: { country: ['EU'], commercial_use: ['false'] }, satisfyAll: [], labels: { country: ['Europe'], commercial_use: ['Non-commercial use'] } }
export const mockGetFilters = filterDefinitions(mockState())
export const mockFilterOptionDictionary = { diagnosis_available: [{ text: '[ ORPHA:352530 ] - Intellectual disability-obesity-brain malformations-facial dysmorphism syndrome', value: 'ORPHA:352530' }] }

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

export const fruitOptions = [
  { text: 'Apricots', value: 'apricots' },
  { text: 'Apple', value: 'apple' },
  { text: 'Avocados', value: 'avocados' },
  { text: 'Bananas', value: 'bananas' },
  { text: 'Boysenberries', value: 'boysenberries' },
  { text: 'Blueberries', value: 'blueberries' },
  { text: 'Breadfruit', value: 'breadfruit' },
  { text: 'Bing Cherry', value: 'bing cherry' },
  { text: 'Cherries', value: 'cherries' },
  { text: 'Cherimoya', value: 'cherimoya' },
  { text: 'Cantaloupe', value: 'cantaloupe' },
  { text: 'Carambola', value: 'carambola' },
  { text: 'Crab apples', value: 'crab apples' },
  { text: 'Clementine', value: 'clementine' },
  { text: 'Cucumbers', value: 'cucumbers' },
  { text: 'Damson plum', value: 'damson plum' },
  { text: 'Dinosaur Eggs (Pluots)', value: 'dinosaur eggs (pluots)' },
  { text: 'Dates', value: 'dates' },
  { text: 'Dewberries', value: 'dewberries' },
  { text: 'Dragon Fruit', value: 'dragon fruit' },
  { text: 'Elderberry', value: 'elderberry' },
  { text: 'Eggfruit', value: 'eggfruit' },
  { text: 'Evergreen Huckleberry', value: 'evergreen huckleberry' },
  { text: 'Entawak', value: 'entawak' },
  { text: 'Fig', value: 'fig' },
  { text: 'Farkleberry', value: 'farkleberry' },
  { text: 'Finger Lime', value: 'finger lime' },
  { text: 'Grapefruit', value: 'grapefruit' },
  { text: 'Grapes', value: 'grapes' },
  { text: 'Gooseberries', value: 'gooseberries' },
  { text: 'Guava', value: 'guava' },
  { text: 'Honeydew melon', value: 'honeydew melon' },
  { text: 'Hackberry', value: 'hackberry' },
  { text: 'Honeycrisp Apples', value: 'honeycrisp apples' },
  { text: 'Indonesian Lime', value: 'indonesian lime' },
  { text: 'Imbe', value: 'imbe' },
  { text: 'Indian Fig', value: 'indian fig' },
  { text: 'Jackfruit', value: 'jackfruit' },
  { text: 'Java Apple', value: 'java apple' },
  { text: 'Jambolan', value: 'jambolan' },
  { text: 'Kiwi', value: 'kiwi' },
  { text: 'Kaffir Lime', value: 'kaffir lime' },
  { text: 'Kumquat', value: 'kumquat' },
  { text: 'Lime (Lemon)', value: 'lime (lemon)' },
  { text: 'Longan', value: 'longan' },
  { text: 'Lychee', value: 'lychee' },
  { text: 'Loquat', value: 'loquat' },
  { text: 'Lychee', value: 'lychee' },
  { text: 'Mango', value: 'mango' },
  { text: 'Mandarin Orange', value: 'mandarin orange' },
  { text: 'Mulberry', value: 'mulberry' },
  { text: 'Melon', value: 'melon' },
  { text: 'Nectarine', value: 'nectarine' },
  { text: 'Navel Orange', value: 'navel orange' },
  { text: 'Nashi Pear (Asian Pear)', value: 'nashi pear (asian pear)' },
  { text: 'Olive', value: 'olive' },
  { text: 'Orange', value: 'orange' },
  { text: 'Ogeechee Limes', value: 'ogeechee limes' },
  { text: 'Oval Kumquat', value: 'oval kumquat' },
  { text: 'Papaya', value: 'papaya' },
  { text: 'Persimmon', value: 'persimmon' },
  { text: 'Paw Paw', value: 'paw paw' },
  { text: 'Prickly Pear', value: 'prickly pear' },
  { text: 'Peach', value: 'peach' },
  { text: 'Plum', value: 'plum' },
  { text: 'Pomegranate', value: 'pomegranate' },
  { text: 'Pineapple', value: 'pineapple' },
  { text: 'Passion Fruit', value: 'passion fruit' },
  { text: 'Quince', value: 'quince' },
  { text: 'Queen Anne Cherry', value: 'queen anne cherry' },
  { text: 'Quararibea cordata', value: 'quararibea cordata' },
  { text: 'Rambutan', value: 'rambutan' },
  { text: 'Raspberries', value: 'raspberries' },
  { text: 'Rose Hips', value: 'rose hips' },
  { text: 'Rose-Apple', value: 'rose-apple' },
  { text: 'Star Fruit', value: 'star fruit' },
  { text: 'Strawberries', value: 'strawberries' },
  { text: 'Sugar-apple', value: 'sugar-apple' },
  { text: 'Sugar Baby Watermelon', value: 'sugar baby watermelon' },
  { text: 'Soursop', value: 'soursop' },
  { text: 'Tomato', value: 'tomato' },
  { text: 'Tangerine', value: 'tangerine' },
  { text: 'Tamarind', value: 'tamarind' },
  { text: 'Tart Cherries', value: 'tart cherries' },
  { text: 'Ugli Fruit', value: 'ugli fruit' },
  { text: 'Uniq Fruit', value: 'uniq fruit' },
  { text: 'Ugni', value: 'ugni' },
  { text: 'Vanilla Bean', value: 'vanilla bean' },
  { text: 'Velvet Pink Banana', value: 'velvet pink banana' },
  { text: 'Voavanga', value: 'voavanga' },
  { text: 'Watermelon', value: 'watermelon' },
  { text: 'Wolfberry', value: 'wolfberry' },
  { text: 'White Mulberry', value: 'white mulberry' },
  { text: 'Xigua (Chinese Watermelon)', value: 'xigua (chinese watermelon)' },
  { text: 'Ximenia caffra fruit', value: 'ximenia caffra fruit' },
  { text: 'Xango Mangosteen Fruit Juice', value: 'xango mangosteen fruit juice' },
  { text: 'Yellow Passion Fruit', value: 'yellow passion fruit' },
  { text: 'Yunnan Hackberry', value: 'yunnan hackberry' },
  { text: 'Yangmei', value: 'yangmei' },
  { text: 'Zig Zag Vine fruit', value: 'zig zag vine fruit' },
  { text: 'Zinfandel Grapes', value: 'zinfandel grapes' },
  { text: 'Zucchini', value: 'zucchini' }]
