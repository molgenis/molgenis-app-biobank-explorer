import { collectionMutations } from '../../../../../src/store/collection/collectionMutations'
import { mockCollectionResponse, mockState } from '../../mockData'
let state

describe('Collection mutations', () => {
  beforeEach(() => {
    state = mockState()
  })
  it('can SetAllCollectionRelationData', () => {
    collectionMutations.SetAllCollectionRelationData(state, mockCollectionResponse)

    const collectionBiobankDictionaryExpectation = {
      'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124': 'AMC Renal Transplant Biobank',
      'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211': 'ARGOS Biobank',
      'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92': 'ARREST Biobank',
      'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89': 'AGNES Biobank',
      'bbmri-eric:ID:NL_AMCBB:collection:AB17-022': 'Amsterdam UMC Biobank: Location AMC'
    }

    const collectionNameDictionaryExpectation = {
      'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124': 'AMC Renal Transplant Biobank',
      'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211': 'Association study of coronary heart disease Risk factors in the Genome using an Old-versus-young Setting',
      'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92': 'Amsterdam Ressucitation Studies',
      'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89': 'Arrhythmia genetics in the Netherlands',
      'bbmri-eric:ID:NL_AMCBB:collection:AB17-022': 'Physical Activity and Dietary intervention in OVArian cancer (PADOVA): a RCT evaluating effects on body composition, physical function, and fatigue'
    }

    const nonCommercialCollectionsExpectation = ['bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89', 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124', 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211', 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92', 'bbmri-eric:ID:NL_AMCBB:collection:AB17-022']

    const collectionRelationDataExpectation = [
      {
        biobankId: 'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE',
        biobankName: 'AGNES Biobank',
        collectionId: 'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89',
        collectionName: 'Arrhythmia genetics in the Netherlands',
        commercialUse: undefined,
        isSubcollection: false,
        parentCollection: undefined
      },
      {
        biobankId: 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM',
        biobankName: 'AMC Renal Transplant Biobank',
        collectionId: 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124',
        collectionName: 'AMC Renal Transplant Biobank',
        commercialUse: undefined,
        isSubcollection: false,
        parentCollection: undefined
      },
      {
        biobankId: 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE',
        biobankName: 'ARGOS Biobank',
        collectionId: 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211',
        collectionName: 'Association study of coronary heart disease Risk factors in the Genome using an Old-versus-young Setting',
        commercialUse: undefined,
        isSubcollection: false,
        parentCollection: undefined
      },
      {
        biobankId: 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE',
        biobankName: 'ARREST Biobank',
        collectionId: 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92',
        collectionName: 'Amsterdam Ressucitation Studies',
        commercialUse: undefined,
        isSubcollection: false,
        parentCollection: undefined
      },
      {
        biobankId: 'bbmri-eric:ID:NL_AMCBB',
        biobankName: 'Amsterdam UMC Biobank: Location AMC',
        collectionId: 'bbmri-eric:ID:NL_AMCBB:collection:AB17-022',
        collectionName: 'Physical Activity and Dietary intervention in OVArian cancer (PADOVA): a RCT evaluating effects on body composition, physical function, and fatigue',
        commercialUse: undefined,
        isSubcollection: false,
        parentCollection: undefined
      }]

    expect(state.collectionBiobankDictionary).toStrictEqual(collectionBiobankDictionaryExpectation)
    expect(state.collectionNameDictionary).toStrictEqual(collectionNameDictionaryExpectation)
    expect(state.nonCommercialCollections).toStrictEqual(nonCommercialCollectionsExpectation)
    expect(state.collectionRelationData).toStrictEqual(collectionRelationDataExpectation)
  })
})
