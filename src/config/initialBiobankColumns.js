const initialBiobankColumns = [
  { label: 'Id:', column: 'id', type: 'string' },
  { label: 'Name:', column: 'name', type: 'string' },
  { label: 'Collection types:', column: 'collection_types', type: 'array' },
  { label: 'Juridical person:', column: 'juridical_person', type: 'string' },
  { label: 'Covid-19:', column: 'covid19biobank', type: 'mref' }
]

module.exports = initialBiobankColumns
