def get_all_ids(data):
    return [item['id'] for item in data]


def remove_rows(session, entity, ids):
    if len(ids) > 0:
        session.delete_list(entity, ids)


def get_all_rows(session, entity):
    data = []
    while True:
        if len(data) == 0:
            # api can handle 10.000 max per request
            data = session.get(entity=entity, num=10000, start=len(data))
            if len(data) == 0: break  # if the table is empty
        else:
            newdata = session.get(entity=entity, num=10000, start=len(data))
            if len(newdata) > 0:
                data.extend(data)
            else:
                break

    return data

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

def bulk_add_all(session, entity, data):
    maxUpdateCount = 1000

    if len(data) <= maxUpdateCount:
         session.add_all(entity=entity, entities=data)
         return

    numberOfCycles = int(len(data) / maxUpdateCount)

    for cycle in range(numberOfCycles):
        nextBatchStart = int(cycle * maxUpdateCount)
        nextBatchStop = int(maxUpdateCount + cycle * maxUpdateCount)
        itemsToAdd = data[nextBatchStart:nextBatchStop]
        session.add_all(entity=entity, entities=itemsToAdd)
