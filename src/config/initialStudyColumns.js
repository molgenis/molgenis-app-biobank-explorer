const initialStudyColumns = [
  { label: 'Id:', column: 'id', type: 'string', showCopyIcon: true },
  { label: 'Title:', column: 'title', type: 'string' },
  { label: 'Type:', column: 'type', type: 'string' },
  { label: 'Sex:', column: 'sex', type: 'categoricalmref' },
  { label: 'Description:', column: 'description', type: 'string' },
  { label: 'Number of subjects:', column: 'number_of_subjects', type: 'int' },
  { label: 'Age:', type: 'range', min: 'age_low', max: 'age_high', unit: 'age_unit' }
]

module.exports = initialStudyColumns
