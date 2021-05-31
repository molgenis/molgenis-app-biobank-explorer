from molgenis.client import Session
import molgenis_utilities

class bbmri_session(Session):
    package = "eu_bbmri_eric_"
    importTableSequence = ["persons", "networks", "biobanks", "collections"]
    deleteTableSequence = reversed(importTableSequence)

    def __init__(self, url, national_nodes, username=None, password=None, token=None):
        super().__init__(url, token)
        self.national_nodes = national_nodes
        self.target = url

        if username and password:
            self.login(username=username, password=password)

    @property
    def national_nodes(self):
        return self._national_nodes
    
    @national_nodes.setter
    def national_nodes(self, value):
        nodes = []

        if value is dict:
            nodes.append(value)
        else:
            nodes = value

        for node in nodes:
            self.validate_national_node(node)

        self._national_nodes = nodes

    def validate_national_node(self, node):
        if "national_node" not in node:
            raise ValueError("Argument should have key: 'national_node', which is the prefix of the national node example: 'NL'")
        if "source" not in node:
            raise ValueError("Argument should have key: 'source', which is the complete url to the source directory")
        return True

    
    def create_national_node_entityPrefix(self, nationalNode):
        return f"{self.package}{nationalNode['national_node']}_"

    def import_national_node_to_own_entity(self, nationalNode):
        self.validate_national_node(nationalNode)

        sourceSession = Session(url=nationalNode["source"])

        # imports
        for entityName in self.importTableSequence:
            targetEntityPrefix = self.create_national_node_entityPrefix(nationalNode=nationalNode)
            targetEntity = f"{targetEntityPrefix}{entityName}"
            sourceTable = f"{self.package}{entityName}"
            sourceData = molgenis_utilities.get_all_rows(session=sourceSession, entity=sourceTable)

            # import all the data
            if len(sourceData) > 0:
                print("Importing data to", targetEntity)
                preppedSourceData = molgenis_utilities.transform_to_molgenis_upload_format(
                    session=sourceSession, entity=sourceTable, data=sourceData)

                if len(preppedSourceData) > 0:
                    molgenis_utilities.bulk_add_all(session=self, entity=targetEntity,
                                data=preppedSourceData)  # add to node specific table
    
    def delete_national_node_own_entity_data(self, nationalNode):
        self.validate_national_node(node=nationalNode)
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
        if not self.national_nodes:
            raise ValueError("No national nodes found to update")

        for nationalNode in self.national_nodes:
            self.delete_national_node_own_entity_data(nationalNode=nationalNode)
            self.import_national_node_to_own_entity(nationalNode=nationalNode)
