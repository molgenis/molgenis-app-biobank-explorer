from molgenis.client import Session
from molgenis_utilities import remove_rows, get_all_ids, get_all_rows, bulk_add_all, separate_data_with_references, transform_to_molgenis_upload_format
from bbmri_validations import validate_bbmri_id, validate_generic_bbmri_id, validate_bbmri_data
from bbmri_utilities import bbmri_data_to_valid_upload_format
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


# def get_referenced_ids()

def process_external_national_node(nationalNode):
    nn = nationalNode['country']
    print("Processing", nationalNode["source"])
    sourceSession = Session(url=nationalNode["source"])
    targetTablePrefix = f"{package}{nn}_"

    # remove all data in tables
    for tableName in deleteTableSequence:
        targetTable = f"{targetTablePrefix}{tableName}"
        targetCombinedTable = f"{package}{tableName}"
        targetData = get_all_rows(session=targetSession, entity=targetTable)
        
        stuff = transform_to_molgenis_upload_format(targetSession, targetTable, targetData)

        print('----------------->',stuff, targetTable)

        ids = get_all_ids(targetData)
        
        if len(ids) > 0:

            # delete from node specific
            print("Clearing data from", targetTable, targetCombinedTable)
            remove_rows(session=targetSession, entity=targetTable, ids=ids)
         #   remove_rows(session=targetSession, entity=targetCombinedTable, ids=ids)


    print("\n\r")

    # imports
    for tableName in importTableSequence:
   
        sourceTable = f"{package}{tableName}"
        sourceData = get_all_rows(session=sourceSession, entity=sourceTable)
        validatedData = validate_bbmri_data(sourceData)
        
        targetTable = f"{targetTablePrefix}{tableName}"
        targetCombinedTable = f"{package}{tableName}"

        # import all the data
        if len(validatedData) > 0:
            print("Importing data to", tableName, targetTable, target)
            preppedSourceData = bbmri_data_to_valid_upload_format(
            session=sourceSession, entity=sourceTable, data=validatedData)
            bulk_add_all(session=targetSession, entity=targetTable, data=preppedSourceData) # add to node specific table
            # bulk_add_all(session=targetSession, entity=targetCombinedTable, data=preppedSourceData) # add to combined

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
