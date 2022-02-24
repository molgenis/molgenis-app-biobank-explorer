const initialBiobankColumns = [
  { label: 'Id:', column: 'id', type: 'string' },
  { label: 'Name:', column: 'name', type: 'string' },
  { label: 'Collection types:', column: 'collection_types', type: 'array', showOnBiobankCard: true },
  { label: 'Juridical person:', column: 'juridical_person', type: 'string', showOnBiobankCard: true },
  { label: 'Covid-19:', column: 'covid19biobank', type: 'mref', showOnBiobankCard: true, badgeColor: 'light' }
]

module.exports = initialBiobankColumns
