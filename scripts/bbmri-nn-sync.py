from molgenis.client import Session

# DEVELOPMENT CODE
from dotenv import dotenv_values 
config = dotenv_values(".env.local")
## END OF DEVELOPMENT CODE

# replace & remove these values in production
target = config['TARGET'] 
username = config["USERNAME"]
password = config["PASSWORD"]
#

package = "eu_bbmri_eric_"

importTableSequence = ["persons", "networks", "biobanks", "collections"]
deleteTableSequence = reversed(importTableSequence)

sources = [{
    "country": 'NL',
    "source": 'https://catalogue.bbmri.nl/api/'
}]

targetSession = Session(url=target)
targetSession.login(username=username,password=password)

# api can handle 10.000 max per request
def get_10k_ids(target, entity):
    data = target.get(entity=entity, num=10000)
    return [item['id'] for item in data]

def wipe_table(target, entity):
    ids = get_10k_ids(target=target, entity=entity)
    if len(ids) > 0:
        target.delete_list(entity, ids)
    
    # Sanity check
    idsLeft = get_10k_ids(target=target, entity=entity)
    if len(idsLeft) > 0:
        wipe_table(target=target,entity=entity)

def get_one_to_manys(source, entity):
    '''Retrieves one-to-many's in table'''
    meta = source.get_entity_meta_data(entity)['attributes']
    one_to_manys = [attr for attr in meta if meta[attr]['fieldType'] == "ONE_TO_MANY"]
    return one_to_manys

def get_molgenis_upload_format(source, entity):
    data = source.get(entity=entity, num=10000)
    one_to_manys = get_one_to_manys(source=source, entity=entity)
    upload_format = []
    for _, item in enumerate(data):
        new_item = item
        del new_item['_href']
        for one_to_many in one_to_manys:
            del new_item[one_to_many]
        for key in new_item:
            if type(new_item[key]) is dict:
                ref = new_item[key]['id']
                new_item[key] = ref
            elif type(new_item[key]) is list:
                if len(new_item[key]) > 0:
                    # get id for each new_item in list
                    mref = [l['id'] for l in new_item[key]]
                    new_item[key] = mref
        upload_format.append(new_item)
    return upload_format

for national_node in sources:
    sourceSession = Session(url=national_node["source"])
    targetTablePrefix = f"{package}{national_node['country']}_"
    
    # remove all data in tables
    for tableName in deleteTableSequence:
        targetTable = f"{targetTablePrefix}{tableName}"
        wipe_table(target=targetSession, entity=targetTable)

    # imports
    for tableName in importTableSequence:
        sourceTable = f"{package}{tableName}"
        targetTable = f"{targetTablePrefix}{tableName}"
        sourceData = get_molgenis_upload_format(source=sourceSession, entity=sourceTable)
        if len(sourceData) > 0:
            targetSession.add_all(entity=targetTable, entities=sourceData)
