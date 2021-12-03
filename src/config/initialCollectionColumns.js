const initialCollectionColumns = [
  { label: 'Id:', column: 'id', type: 'string' },
  { label: 'Website:', column: 'url', type: 'hyperlink' },
  { label: 'Size:', column: 'order_of_magnitude', type: 'object', property: 'size', display: 'badge' },
  { label: 'Available:', column: 'size', type: 'int', display: 'badge', suffix: 'samples' },
  { label: 'Age:', type: 'range', min: 'age_low', max: 'age_high', unit: 'age_unit' },
  { label: 'Type:', column: 'type', type: 'mref' },
  { label: 'Sex:', column: 'sex', type: 'categoricalmref' },
  { label: 'Materials:', column: 'materials', type: 'categoricalmref' },
  { label: 'Storage:', column: 'storage_temperatures', type: 'categoricalmref' },
  { label: 'Data:', column: 'data_categories', type: 'categoricalmref' },
  { label: 'Diagnosis:', column: 'diagnosis_available', type: 'mref', rsql: 'diagnosis_available(label,uri,code)' },
  { label: 'Data use conditions:', column: 'data_use', type: 'mref', rsql: 'data_use(label,uri)' }]

module.exports = initialCollectionColumns
