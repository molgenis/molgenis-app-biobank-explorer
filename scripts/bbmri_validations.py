import re

idSpecByEntity = {
    "persons": "contactID",
    "networks": "networkID",
    "biobanks": "ID",
    "collections": "collectionID"
}

registeredNationalNodes =['AT','BE','BG','CH','CY','CZ','DE','EE','EU','FI','FR','GR','IT','LV','MT','NL','NO','PL','SE','TR','UK','IARC']

errors = []

def validate_bbmri_id(entity, nn, bbmriId):
    idSpec = idSpecByEntity[entity]
    idConstraint = f"bbmri-eric:{idSpec}_{nn}_" # for error messages
    extIdConstraint = "bbmri-eric:ID:EXT_"

    extIdRegex = f"^{extIdConstraint}"
    idRegex = f"^{idConstraint}"

    if nn not in registeredNationalNodes:
        if not re.search(extIdRegex, bbmriId):
            errors.append(f"{bbmriId} is not a registered national node and must start with: {extIdConstraint} for entity (table) {entity}")
    
    if re.search(extIdRegex, bbmriId):
        errors.append(f"Error in {bbmriId} found for {nn}, id's belonging to a registered national node must start with {idConstraint} for entity (table) {entity}")
       
    if not re.search(idRegex, bbmriId):
            errors.append(f"{bbmriId} in entity (table) {entity} does not start with {idConstraint}")

    if re.search('[^A-Za-z0-9:_-]', bbmriId):
        errors.append(f"{bbmriId} in entity (table) {entity} contains characters other than: A-Z a-z 0-9 : _ -")

    if re.search('::', bbmriId):
        errors.append(f"{bbmriId} in entity (table) {entity} contains :: indicating an empty component in ID hierarchy")

    for error in errors:
        print(error)
    
    return len(errors) == 0
