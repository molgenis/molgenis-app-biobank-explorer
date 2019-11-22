export const mapContactInfo = (biobank) => {
  return {
    website: {value: biobank.url, type: 'url'},
    email: {value: biobank.email, type: 'email'},
    juridical_person: {value: biobank.juridical_person, type: 'string'},
    country: {value: biobank.country ? biobank.country.name : undefined, type: 'string'}
  }
}

export const mapCollectionsData = (collections) => {
  return collections.map(
    (collection) => {
      return {
        description: collection.description,
        parentCollection: collection.parent_collection,
        subCollections: mapCollectionsData(collection.sub_collections),
        name: collection.name,
        id: collection.id,
        tableContent: {
          stringValues: {},
          listValues: {
            Size: {
              values: collection.order_of_magnitude.size ? [collection.order_of_magnitude.size] : [],
              badgeColor: 'success'
            },
            Materials: {
              values: collection.materials ? collection.materials.map((material) => material.label) : [],
              badgeColor: 'danger'
            },
            Data: {
              values: collection.data_categories ? collection.data_categories.map((data) => data.label) : [],
              badgeColor: 'primary'
            }
          }
        }
      }
    })
}
