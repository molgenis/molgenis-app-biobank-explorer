from molgenis.client import Session
import bbmri_validations
import molgenis_utilities

class bbmri_session(Session):
    package = "eu_bbmri_eric_"
    importTableSequence = ["persons", "networks", "biobanks", "collections"]
    deleteTableSequence = reversed(importTableSequence)

    def __init__(self, url, nationalNodes, username=None, password=None, token=None):
        super().__init__(url, token)
        self.nationalNodes = nationalNodes
        self.target = url

        if username and password:
            self.login(username=username, password=password)

    @property
    def nationalNodes(self):
        return self._nationalNodes
    
    @nationalNodes.setter
    def nationalNodes(self, value):
        nodes = []

        if value is dict:
            nodes.append(value)
        else:
            nodes = value

        for node in nodes:
            self.validate_national_node(node)

        self._nationalNodes = nodes

    def validate_national_node(self, node):
        if "national_node" not in node:
            raise ValueError("Argument should have key: 'national_node', which is the prefix of the national node example: 'NL'")
        if "source" not in node:
            raise ValueError("Argument should have key: 'source', which is the complete url to the source directory")
        return True

    
    def create_national_node_entityPrefix(self, nationalNode):
        return f"{self.package}{nationalNode['national_node']}_"

    def import_national_node_to_own_entity(self, nationalNode):
        if nationalNode not in self.nationalNodes:
            self.nationalNodes.append(nationalNode)

        sourceSession = Session(url=nationalNode["source"])

        # imports
        for entityName in self.importTableSequence:
            targetEntityPrefix = self.create_national_node_entityPrefix(nationalNode=nationalNode)
            targetEntity = f"{targetEntityPrefix}{entityName}"
            sourceEntity = f"{self.package}{entityName}"
            sourceData = molgenis_utilities.get_all_rows(session=sourceSession, entity=sourceEntity)
            sourceOneToManys = molgenis_utilities.get_one_to_manys(session=sourceSession, entity=sourceEntity)

            # import all the data
            if len(sourceData) > 0:
                print("Importing data to", targetEntity)
                preppedSourceData = molgenis_utilities.transform_to_molgenis_upload_format(
                    session=sourceSession, entity=sourceEntity, oneToManys=sourceOneToManys, data=sourceData)

                if len(preppedSourceData) > 0:
                    molgenis_utilities.bulk_add_all(session=self, entity=targetEntity,
                                data=preppedSourceData)  # add to node specific table
    

    # import contents from a national node entity to the eric entity (combined table)
    def import_national_node_to_eric_entity(self, nationalNode):
        if nationalNode not in self.nationalNodes:
            self.nationalNodes.append(nationalNode)
        
        nn = nationalNode['national_node']

        for entityName in self.importTableSequence:
            sourceEntityPrefix = self.create_national_node_entityPrefix(nationalNode=nationalNode)
            targetEntity = f"{self.package}{entityName}"
            sourceEntity = f"{sourceEntityPrefix}{entityName}"
            sourceData = molgenis_utilities.get_all_rows(session=self, entity=sourceEntity)

            # check if ids already exist
            targetData = molgenis_utilities.get_all_rows(session=self, entity=targetEntity)
            targetIds = molgenis_utilities.get_all_ids(targetData)

            sourceIds = molgenis_utilities.get_all_ids(sourceData)
            validIds = [sourceId for sourceId in sourceIds if bbmri_validations.validate_bbmri_id(entity=entityName, nn=nn, bbmriId=sourceId)]

            # check for target ids because there could be eric leftovers from the national node in the table.
            validEntries = [validData for validData in sourceData if validData['id'] in validIds and validData['id'] not in targetIds]

            # validate the one to manys
            sourceOneToManys = molgenis_utilities.get_one_to_manys(session=self, entity=sourceEntity)
            validSource = [validEntry for validEntry in validEntries if bbmri_validations.validate_refs_in_entry(nn=nn, entry=validEntry, oneToManys=sourceOneToManys)]

            if len(validSource) > 0:
                print("Importing data to", targetEntity)
                preppedSourceData = molgenis_utilities.transform_to_molgenis_upload_format(
                    session=self, entity=sourceEntity, oneToManys=sourceOneToManys, data=validSource)

                if len(preppedSourceData) > 0:
                    molgenis_utilities.bulk_add_all(session=self, entity=targetEntity,
                                data=preppedSourceData)
    
    def delete_national_node_own_entity_data(self, nationalNode):
        if nationalNode not in self.nationalNodes:
            self.nationalNodes.append(nationalNode)

        print("Deleting data for", nationalNode["national_node"], "on", self.target)
        targetEntityPrefix = self.create_national_node_entityPrefix(nationalNode=nationalNode)

        previousIdsPerEntity = {}

        for entityName in self.deleteTableSequence:
            targetEntity = f"{targetEntityPrefix}{entityName}"
            targetData = molgenis_utilities.get_all_rows(session=self, entity=targetEntity)
            ids = molgenis_utilities.get_all_ids(targetData)
            previousIdsPerEntity[entityName] = ids

            if len(ids) > 0:
                # delete from node specific
                print("Deleting data in", targetEntity)
                molgenis_utilities.remove_rows(session=self, entity=targetEntity, ids=ids)

        return previousIdsPerEntity
    
    def update_external_entities(self):
        if not self.nationalNodes:
            raise ValueError("No national nodes found to update")

        for nationalNode in self.nationalNodes:
            self.delete_national_node_own_entity_data(nationalNode=nationalNode)
            self.import_national_node_to_own_entity(nationalNode=nationalNode)

    def update_eric_entities(self):
        if not self.nationalNodes:
            raise ValueError("No national nodes found to update")

        for nationalNode in self.nationalNodes:
            # self.delete_national_node_own_entity_data(nationalNode=nationalNode)
            self.import_national_node_to_eric_entity(nationalNode=nationalNode)
    
    def copy_national_node_to_combined(self, nationalNode):
        if nationalNode not in self.nationalNodes:
            self.nationalNodes.append(nationalNode)

