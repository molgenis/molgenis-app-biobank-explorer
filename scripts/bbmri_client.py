from molgenis.client import Session
import bbmri_validations
import molgenis_utilities

class BBMRISession(Session):
    package = "eu_bbmri_eric_"
    import_table_sequence = ["persons", "networks", "biobanks", "collections"]
    combined_entity_cache = {}
    tables_to_cache_for_import = ['eu_bbmri_eric_bio_qual_info', 'eu_bbmri_eric_col_qual_info']

    def __init__(self, url, national_nodes, username=None, password=None, token=None):
        super().__init__(url, token)
        self.national_nodes = national_nodes
        self.target = url

        if username and password:
            self.login(username=username, password=password)

    @property
    def get_national_node_codes(self):
        return [node['national_node'] for node in self._national_nodes]

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
    
    def get_qualified_entity_name(self, entity_name: str, national_node_code: str = None):
        if national_node_code:
            return  f"{self.package}{national_node_code}_{entity_name}"
        else:
            return  f"{self.package}{entity_name}"
    
    def filter_national_node_data(self, data: list[dict], national_node_code: str):
        national_node_signature = f":{national_node_code}_"
        data_from_national_node = [row for row in data if national_node_signature in row['id']]
        return data_from_national_node

    def validate_national_node(self, node: str):
        if "national_node" not in node:
            raise ValueError(
                "Argument should have key: 'national_node', which is the prefix of the national node example: 'NL'")
        if "source" not in node:
            raise ValueError(
                "Argument should have key: 'source', which is the complete url to the source directory")
        return True

    def cache_combined_entity_data(self):
        for entity in self.import_table_sequence:
            source_entity = self.get_qualified_entity_name(entity_name=entity)
            source_data = molgenis_utilities.get_all_rows(
                session=self, entity=source_entity)
            source_one_to_manys = molgenis_utilities.get_one_to_manys(
                session=self, entity=source_entity)
            uploadable_source = molgenis_utilities.transform_to_molgenis_upload_format(
                data=source_data, one_to_manys=source_one_to_manys)

            self.combined_entity_cache[entity] = uploadable_source

        for global_entity in self.tables_to_cache_for_import:
            source_data = molgenis_utilities.get_all_rows(
                session=self, entity=global_entity)
            source_one_to_manys = molgenis_utilities.get_one_to_manys(
                session=self, entity=global_entity)
            uploadable_source = molgenis_utilities.transform_to_molgenis_upload_format(
                data=source_data, one_to_manys=source_one_to_manys)

            self.combined_entity_cache[global_entity] = uploadable_source


    def import_national_node_to_own_entity(self, national_node):
        if national_node not in self.national_nodes:
            self.national_nodes.append(national_node)

        source_session = Session(url=national_node["source"])

        nnc = national_node['national_node']

        # imports
        for entity_name in self.import_table_sequence:
            target_entity = self.get_qualified_entity_name(entity_name=entity_name, national_node_code=nnc)
            source_entity = self.get_qualified_entity_name(entity_name=entity_name)
            sourceData = molgenis_utilities.get_all_rows(
                session=source_session, entity=source_entity)
            source_one_to_manys = molgenis_utilities.get_one_to_manys(
                session=source_session, entity=source_entity)

            # import all the data
            if len(sourceData) > 0:
                print("Importing data to", target_entity)
                prepped_source_data = molgenis_utilities.transform_to_molgenis_upload_format(
                    data=sourceData, one_to_manys=source_one_to_manys)

                if len(prepped_source_data) > 0:
                    molgenis_utilities.bulk_add_all(session=self, entity=target_entity,
                                                    data=prepped_source_data)  # add to node specific table
    
    # import contents from a national node entity to the eric entity (combined table)
    def import_national_node_to_eric_entity(self, national_node):
        if national_node not in self.national_nodes:
            self.national_nodes.append(national_node)

        nnc = national_node['national_node']
        print("Importing data for",
              national_node["national_node"], "on", self.target, "\n")

        for entity_name in self.import_table_sequence:
            target_entity  = self.get_qualified_entity_name(entity_name=entity_name)
            source_entity= self.get_qualified_entity_name(entity_name=entity_name, national_node_code=nnc)
            source_data = molgenis_utilities.get_all_rows(session=self, entity=source_entity)

            # check if ids already exist
            target_data = molgenis_utilities.get_all_rows(
                session=self, entity=target_entity)
            targetIds = molgenis_utilities.get_all_ids(target_data)

            source_ids = molgenis_utilities.get_all_ids(source_data)
            validIds = [sourceId for sourceId in source_ids if bbmri_validations.validate_bbmri_id(
                entity=entity_name, nn=nnc, bbmriId=sourceId)]

            # check for target ids because there could be eric leftovers from the national node in the table.
            validEntries = [validData for validData in source_data if validData['id']
                            in validIds and validData['id'] not in targetIds]

            # validate the references
            sourceReferences = molgenis_utilities.get_all_references_for_entity(
                session=self, entity=source_entity)
            combinedReferenceProperties = sourceReferences['xref']
            combinedReferenceProperties.extend(sourceReferences['one_to_many'])
            valid_source = [validEntry for validEntry in validEntries if bbmri_validations.validate_refs_in_entry(
                nn=nnc, entry=validEntry, parent_entity=entity_name, possible_entity_references=combinedReferenceProperties)]

            if len(valid_source) > 0:
                print("Importing data to", target_entity)
                prepped_source_data = molgenis_utilities.transform_to_molgenis_upload_format(
                    data=valid_source, one_to_manys=sourceReferences['one_to_many'])

                if len(prepped_source_data) > 0:

                    try:
                        molgenis_utilities.bulk_add_all(session=self, entity=target_entity,
                                                        data=prepped_source_data)  # add to node specific table
                        print('Imported:', len(prepped_source_data), 'rows', 'to', target_entity, 'out of', len(source_ids))
                    except Exception as e: # rollback
                        print('\n')
                        print('---' * 10)
                        print('Failed to import, following error occurred:', e)
                        print('---' * 10, end='\n')

                        cached_data = self.combined_entity_cache[entity_name]
                        original_data = self.filter_national_node_data(data=cached_data, national_node_code=nnc)
                        ids_to_revert = molgenis_utilities.get_all_ids(data=prepped_source_data)

                        if len(ids_to_revert) > 0:
                            molgenis_utilities.remove_rows(session=self, entity=target_entity, ids=ids_to_revert)
                        
                        if len(original_data) > 0:
                            molgenis_utilities.bulk_add_all(session=self, entity=target_entity, data=original_data)
                            print('Rolled back', target_entity, 'with previous data for', nnc, end='\n')
  
                    

    def delete_national_node_own_entity_data(self, national_node):
        if national_node not in self.national_nodes:
            self.national_nodes.append(national_node)

        nnc = national_node["national_node"]

        print("Deleting data for", nnc, "on", self.target, "\n")

        previous_ids_per_entity = {}
   
        for entity_name in reversed(self.import_table_sequence):
            target_entity = self.get_qualified_entity_name(entity_name=entity_name, national_node_code=nnc)
            target_data = molgenis_utilities.get_all_rows(
                session=self, entity=target_entity)
            ids = molgenis_utilities.get_all_ids(target_data)
            previous_ids_per_entity[entity_name] = ids

            if len(ids) > 0:
                # delete from node specific
                print("Deleting data in", target_entity)
                try:
                    molgenis_utilities.remove_rows(session=self, entity=target_entity, ids=ids)
                except Exception as e:
                    raise e

        return previous_ids_per_entity


    def prepare_deletion_of_node_data(self):
        # varify we have it cached, if not start caching
        if not all(entity_name in self.combined_entity_cache for entity_name in self.import_table_sequence):
            self.cache_combined_entity_data()

        for global_entity in self.tables_to_cache_for_import:
            source_data = self.combined_entity_cache[global_entity]
            source_ids = molgenis_utilities.get_all_ids(source_data)
            molgenis_utilities.remove_rows(session=self, entity=global_entity, ids=source_ids)

    def finish_importing_of_node_data(self):
        self.replace_global_entities()

    def delete_national_node_data_from_eric_entity(self, national_node):
        # sanity check
        if not all(entity_name in self.combined_entity_cache for entity_name in self.import_table_sequence):
            self.cache_combined_entity_data()

        nnc = national_node['national_node']
        
        for entity_name in reversed(self.import_table_sequence):
            print('\nRemoving data from the entity:', entity_name, 'for:', nnc, end='\n')
            entity_cached_data = self.combined_entity_cache[entity_name]
            target_entity  = self.get_qualified_entity_name(entity_name=entity_name)
            national_node_data_for_entity = self.filter_national_node_data(data=entity_cached_data, national_node_code=nnc)
            ids_for_national_node_data = molgenis_utilities.get_all_ids(data=national_node_data_for_entity)

            if len(ids_for_national_node_data) > 0:
                try:
                    molgenis_utilities.remove_rows(session=self, entity=target_entity, ids=ids_for_national_node_data)
                    print('Removed:', len(ids_for_national_node_data), 'rows', end='\n')
                except Exception as e:
                    raise e
            else:
                print('Nothing to remove for', target_entity, end='\n\n')
    
    def replace_global_entities(self):
        print("Placing back the global entities")
        for global_entity in self.tables_to_cache_for_import:
            source_data = self.combined_entity_cache[global_entity]
            if len(source_data) > 0:
                molgenis_utilities.bulk_add_all(session=self, entity=global_entity, data=source_data)
                print('Placed back:', len(source_data), 'rows', 'to', global_entity)
            else:
                print('No rows found to place back')

    def update_external_entities(self):
        if not self.national_nodes:
            raise ValueError("No national nodes found to update")

        for national_node in self.national_nodes:
            self.delete_national_node_own_entity_data(national_node=national_node)
            print("\n")

            self.import_national_node_to_own_entity(national_node=national_node)
            print("\n")


    def update_eric_entities(self):
        if not self.national_nodes:
            raise ValueError("No national nodes found to update")

        self.prepare_deletion_of_node_data()
        
        try:
            for national_node in self.national_nodes:
                self.delete_national_node_data_from_eric_entity(national_node=national_node)
                print("\n")
                self.import_national_node_to_eric_entity(national_node=national_node)
                print("\n")
        finally:
            self.finish_importing_of_node_data()

