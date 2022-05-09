const initialBiobankColumns = [
  { label: 'Id:', column: 'id', type: 'string' },
  { label: 'PID:', column: 'pid', type: 'string' },
  { label: 'Name:', column: 'name', type: 'string' },
  { label: 'PID:', column: 'pid', type: 'string', showCopyIcon: true, copyValuePrefix: 'http://hdl.handle.net/' },
  { label: 'Description:', column: 'description', type: 'longtext' },
  { label: 'Quality labels:', column: 'quality', type: 'quality', showOnBiobankCard: true },
  { label: 'Collection types:', column: 'collection_types', type: 'array', showOnBiobankCard: true },
  { label: 'Juridical person:', column: 'juridical_person', type: 'string', showOnBiobankCard: true },
  { label: 'Covid-19:', column: 'covid19biobank', type: 'mref', showOnBiobankCard: true, badgeColor: 'light' }
]

module.exports = initialBiobankColumns
