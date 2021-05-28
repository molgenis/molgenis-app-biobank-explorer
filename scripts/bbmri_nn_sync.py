from molgenis.client import Session
from molgenis_utilities import remove_rows, get_all_ids, get_all_rows, bulk_add_all, transform_to_molgenis_upload_format
from bbmri_validations import validate_bbmri_id, validate_generic_bbmri_id, validate_bbmri_data
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

def create_nn_entityPrefix(nationalNode):
    return f"{package}{nationalNode['national_node']}_"

# return a list of old id's, per entity, so we can remove all of these from the combined entity
def delete_national_node_own_entity_data(nationalNode):
    print("Deleting data for", nationalNode["national_node"], "on", target)
    targetEntityPrefix = create_nn_entityPrefix(nationalNode=nationalNode)

    previousIdsPerEntity = {}

    for entityName in deleteTableSequence:
        targetEntity = f"{targetEntityPrefix}{entityName}"
        targetData = get_all_rows(session=targetSession, entity=targetEntity)
        ids = get_all_ids(targetData)
        previousIdsPerEntity[entityName] = ids
        
        if len(ids) > 0:
            # delete from node specific
            print("Deleting data in", targetEntity)
            remove_rows(session=targetSession, entity=targetEntity, ids=ids)
    
    return previousIdsPerEntity


def import_national_node_to_own_entity(nationalNode):
    sourceSession = Session(url=nationalNode["source"])

    # imports
    for entityName in importTableSequence:
        targetEntityPrefix = create_nn_entityPrefix(nationalNode=nationalNode)
        targetEntity = f"{targetEntityPrefix}{entityName}"
        sourceTable = f"{package}{entityName}"
        sourceData = get_all_rows(session=sourceSession, entity=sourceTable)

        # import all the data
        if len(sourceData) > 0:
            print("Importing data to", targetEntity)
            preppedSourceData = transform_to_molgenis_upload_format(
            session=sourceSession, entity=sourceTable, data=sourceData)

            if len(preppedSourceData) > 0:
                bulk_add_all(session=targetSession, entity=targetEntity, data=preppedSourceData) # add to node specific table

def sync_eric_with_national_nodes():
    for nationalNode in externalNationalNodes:
        delete_national_node_own_entity_data(nationalNode=nationalNode)
        import_national_node_to_own_entity(nationalNode=nationalNode)

sync_eric_with_national_nodes()


# loop over nodes
# get current and new ids, keep them in a list
# compare them
# delete ids not in list on target
# update others
