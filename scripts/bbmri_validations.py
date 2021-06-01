import re

idSpecByEntity = {
    "persons": "contactID",
    "networks": "networkID",
    "biobanks": "ID",
    "collections": "ID" #collectionID
}

registeredNationalNodes =['AT','BE','BG','CH','CY','CZ','DE','EE','EU','FI','FR','GR','IT','LV','MT','NL','NO','PL','SE','TR','UK','IARC']

def validate_generic_bbmri_id(bbmriId): 
    constraints = [f"^bbmri-eric:{idSpecByEntity[idSpec]}:" for idSpec in idSpecByEntity]

    if re.search('[^A-Za-z0-9:_-]', bbmriId):
        print(bbmriId, "Failed on criteria:", '[^A-Za-z0-9:_-]')
        return False

    if not re.search('[A-Z]{2}_[A-Za-z0-9-_]+$', bbmriId):
        print(bbmriId, "Failed on criteria:", '[A-Z]{2}_[A-Za-z0-9-_]+$/i')
        return False

    if re.search('::', bbmriId):
        print(bbmriId, "Failed on criteria:", '::')
        return False

    for regex in constraints:
        if re.search(regex, bbmriId):
            return True
        else:
            print(bbmriId, "Failed on criteria:", regex)
            return False
    
def all_bbmri_ids_valid(idList):
    for bbmriId in idList:
        if not validate_generic_bbmri_id(bbmriId=bbmriId):
            return False
    return True


def validate_bbmri_id(entity, nn, bbmriId):
    errors = []
    idSpec = idSpecByEntity[entity] # is this truly correct?! 

    idConstraint = f"bbmri-eric:{idSpec}:{nn}_" # for error messages
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


def validate_bbmri_data(data):
    uniqueIds =[]
    validatedData = []
    for item in data:
        bbmriId = item["id"]
        if validate_generic_bbmri_id(bbmriId=bbmriId):
            if bbmriId not in uniqueIds:
                uniqueIds.append(bbmriId)
                validatedData.append(data)
    return validatedData