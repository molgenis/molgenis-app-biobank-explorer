from molgenis.client import Session
from dev import config

target = config['TARGET']
username = config["USERNAME"]
password = config["PASSWORD"]
external_national_nodes = config['NODES']

package = "eu_bbmri_eric_"

importTableSequence = ["persons", "networks", "biobanks", "collections"]
deleteTableSequence = reversed(importTableSequence)

targetSession = Session(url=target)
targetSession.login(username=username, password=password)

def get_all_rows(session, entity):
    data = []
    while True:
        if len(data) is 0:
            # api can handle 10.000 max per request
            data = session.get(entity=entity, num=10000, start=len(data))
        else:
            newdata = session.get(entity=entity, num=10000, start=len(data))
            if len(newdata) > 0:
                data.extend(data)
            else:
                break

    return data

def get_all_ids(session, entity):
    data = get_all_rows(session=session, entity=entity)
    return [item['id'] for item in data]

def remove_rows(session, entity, ids):
    if len(ids) > 0:
        session.delete_list(entity, ids)

def get_one_to_manys(session, entity):
    '''Retrieves one-to-many's in table'''
    meta = session.get_entity_meta_data(entity)['attributes']
    one_to_manys = [attr for attr in meta if meta[attr]
                    ['fieldType'] == "ONE_TO_MANY"]
    return one_to_manys


def get_molgenis_upload_format(session, entity):
    # will have to change this eventually
    data = session.get(entity=entity, num=10000)
    one_to_manys = get_one_to_manys(session=session, entity=entity)
    upload_format = []
    for item in data:
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


def processExternalNationalNode(national_node):
    print("Processing", national_node["source"])
    sourceSession = Session(url=national_node["source"])
    targetTablePrefix = f"{package}{national_node['country']}_"
    targetIdsPerTable = {}
    # sourceIdsPerTable = {}

    # remove all data in tables
    for tableName in deleteTableSequence:
        print("Clearing data from", tableName)
        targetTable = f"{targetTablePrefix}{tableName}"

        ids = get_all_ids(session=targetSession, entity=targetTable)
        
        # save this to a dictionary, so we can compare for deletions of source
        targetIdsPerTable[tableName] = ids
        remove_rows(session=targetSession, entity=targetTable, ids=ids)

    print("\n\r")

    # imports
    for tableName in importTableSequence:
        print("Importing data to", tableName)
        sourceTable = f"{package}{tableName}"
        targetTable = f"{targetTablePrefix}{tableName}"

        combinedTable = f"{package}{tableName}"

        sourceData = get_molgenis_upload_format(
            session=sourceSession, entity=sourceTable)
        if len(sourceData) > 0:
            targetSession.add_all(entity=targetTable, entities=sourceData)
    print("Done")


def grabDataFromExternalNodes():
    for national_node in external_national_nodes:
        processExternalNationalNode(national_node=national_node)


grabDataFromExternalNodes()


# loop over nodes
# get current and new ids, keep them in a list
# compare them
# delete ids not in list on target
# update others
