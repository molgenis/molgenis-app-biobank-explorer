const initialCollectionColumns = [{ label: 'Type:', column: 'type' },
  { label: 'Sex:', column: 'sex' },
  { label: 'Materials:', column: 'materials' },
  { label: 'Storage:', column: 'storage_temperatures' },
  { label: 'Data:', column: 'data_categories' },
  { label: 'Diagnosis:', column: 'diagnosis_available', rsql: 'diagnosis_available(label,uri,code)' },
  { label: 'Data use conditions:', column: 'data_use', rsql: 'data_use(label,uri)' }]

module.exports = initialCollectionColumns
