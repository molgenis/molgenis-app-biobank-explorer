from molgenis.client import Session
from dev import config

target = config['TARGET']
username = config["USERNAME"]
password = config["PASSWORD"]
externalNationalNodes = config['NODES']

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

def get_all_ids(data):
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


def transform_to_molgenis_upload_format(session, entity, data):
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


def process_external_national_node(nationalNode):
    print("Processing", nationalNode["source"])
    sourceSession = Session(url=nationalNode["source"])
    targetTablePrefix = f"{package}{nationalNode['country']}_"
    targetEntityCache = {}

    # remove all data in tables
    for tableName in deleteTableSequence:
        print("Clearing data from", tableName)
        targetTable = f"{targetTablePrefix}{tableName}"

        targetData = get_all_rows(session=targetSession, entity=targetTable)
        ids = get_all_ids(targetData)

        # save this to a dictionary, so we can compare for deletions of source
        targetEntityCache[targetTable]["data"] = targetData
        targetEntityCache[targetTable]["ids"] = ids

        remove_rows(session=targetSession, entity=targetTable, ids=ids)

    print("\n\r")

    removedFromSource = {}

    # imports
    for tableName in importTableSequence:
        print("Importing data to", tableName)
        sourceTable = f"{package}{tableName}"
        sourceData = get_all_rows(session=sourceSession, entity=sourceTable)
        sourceDataIds = get_all_ids(sourceData)
        
        targetTable = f"{targetTablePrefix}{tableName}"
        cachedTargetIds = targetEntityCache[targetTable]["ids"]
        targetCombinedTable = f"{package}{tableName}"

        ## compare cache with actual data and add id's if any, to delete them afterwards
        removedFromSource[targetCombinedTable] = [dataId for dataId in cachedTargetIds if dataId not in sourceDataIds]

        if len(sourceData) > 0:
            preppedSourceData = transform_to_molgenis_upload_format(
            session=sourceSession, entity=sourceTable, data=sourceData)
            targetSession.add_all(entity=targetTable, entities=preppedSourceData)

    # cleanup
    for tableName in deleteTableSequence:
        targetCombinedTable = f"{package}{tableName}"
        entriesToDelete = removedFromSource[targetCombinedTable]

        if len(entriesToDelete) > 0:
            print("Removing", len(entriesToDelete), "entries from", targetCombinedTable)
            remove_rows(session=targetSession, entity=targetCombinedTable, ids=entriesToDelete)
    
    print("Done")


def sync_eric_with_national_nodes():
    for nationalNode in externalNationalNodes:
        process_external_national_node(nationalNode=nationalNode)


sync_eric_with_national_nodes()


# loop over nodes
# get current and new ids, keep them in a list
# compare them
# delete ids not in list on target
# update others
