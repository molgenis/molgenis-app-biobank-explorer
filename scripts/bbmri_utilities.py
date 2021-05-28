
from molgenis_utilities import get_one_to_manys
from bbmri_validations import all_bbmri_ids_valid

def bbmri_data_to_valid_upload_format(session, entity, data):
    one_to_manys = get_one_to_manys(session=session, entity=entity)
    upload_format = []
    for items in data:
        for item in items:
            idsInItem = []
            new_item = item
            if '_href' in new_item:
                del new_item['_href']
            for one_to_many in one_to_manys:
                if one_to_many in new_item:
                    del new_item[one_to_many]

            for key in new_item:
                if type(new_item[key]) is dict:
                    if 'id' in new_item[key]:
                        ref = new_item[key]['id']
                        idsInItem.append(ref)
                        new_item[key] = ref
                elif type(new_item[key]) is list:
                    if len(new_item[key]) > 0:
                        # get id for each new_item in list
                        for l in new_item[key]:
                            mref = ""

                            if l is dict:
                                mref = [l['id']]
                                idsInItem.extend(mref)
                            else:
                                mref = l
                                idsInItem.append(l)
                            
                            if mref != "":
                                new_item[key] = mref

            # check if anything references to an invalid Id, if so discard all.
            if all_bbmri_ids_valid(idsInItem):
                upload_format.append(new_item)

    return upload_format