import re

idSpecByEntity = {
    "persons": "contactID",
    "contact": "contactID",
    "networks": "networkID",
    "biobanks": "ID",
    "collections": "ID",  # collectionID
    "sub_collections": "ID" # ref-check
}

registeredNationalNodes = ['AT', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'EE', 'EU',
                           'FI', 'FR', 'GR', 'IT', 'LV', 'MT', 'NL', 'NO', 'PL', 'SE', 'TR', 'UK', 'IARC']


def validate_bbmri_id(entity, nn, bbmriId):
    errors = []
    
    if not entity in idSpecByEntity:
        return True # no constraints found

    idSpec = idSpecByEntity[entity]

    idConstraint = f"bbmri-eric:{idSpec}:{nn}_"  # for error messages
    globalIdConstraint = f"bbmri-eric:{idSpec}:EU_" # for global refs
    extIdConstraint = "bbmri-eric:ID:EXT_"

    extIdRegex = f"^{extIdConstraint}"
    idRegex = f"^{idConstraint}"
    globalIdRegex = f"^{globalIdConstraint}"

    if nn not in registeredNationalNodes:
        if not re.search(extIdRegex, bbmriId):
            errors.append(
                f"{bbmriId} is not a registered national node and must start with: {extIdConstraint} for entity: {entity}")

    if re.search(extIdRegex, bbmriId):
        errors.append(
            f"Error in {bbmriId} found for {nn}, id's belonging to a registered national node must start with {idConstraint} for entity: {entity}")

    if not re.search(idRegex, bbmriId) and not re.search(globalIdRegex, bbmriId): # they can ref to a global 'EU' entity.
        errors.append(
            f"{bbmriId} in entity: {entity} does not start with {idConstraint} (or {globalIdConstraint} if it's a xref/mref)")

    if re.search('[^A-Za-z0-9:_-]', bbmriId):
        errors.append(
            f"{bbmriId} in entity: {entity} contains characters other than: A-Z a-z 0-9 : _ -")

    if re.search('::', bbmriId):
        errors.append(
            f"{bbmriId} in entity: {entity} contains :: indicating an empty component in ID hierarchy")

    if not re.search('[A-Z]{2}_[A-Za-z0-9-_:]+$', bbmriId):
        errors.append(
            f"{bbmriId} in entity: {entity} does not comply with a two letter national node code, an _ and alphanumeric characters (a : is allowed) afterwards \n\r e.g: NL_myid1234")

    for error in errors:
        print(error)

    return len(errors) == 0


def _validate_id_in_nn_entry(entity: str, nn: dict, entry: dict):
    bbmriId = entry['id']

    if not validate_bbmri_id(entity=entity, nn=nn, bbmriId=bbmriId):
        print(
            f"{bbmriId} in entity: {entity} contains references to an entry with an invalid id")
        return False
    else:
        return True

def validate_refs_in_entry(nn, entry, possible_entity_references):

    for entity_reference in possible_entity_references:
        if not entity_reference in entry or entity_reference not in idSpecByEntity:
            continue

        refData = entry[entity_reference]

        # check if its an xref
        if type(refData) is dict:
            return _validate_id_in_nn_entry(entity=entity_reference, nn=nn, entry=refData)
        else:
            for ref in refData:
                if type(ref) is dict:
                    return _validate_id_in_nn_entry(entity=entity_reference, nn=nn, entry=ref)        
                else:
                    if not validate_bbmri_id(entity=entity_reference, nn=nn, bbmriId=ref):
                        return False
    return True