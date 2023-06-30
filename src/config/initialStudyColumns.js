const initialStudyColumns = [
  { label: 'Id:', column: 'id', type: 'string', showCopyIcon: true },
  { label: 'Name:', column: 'name', type: 'string' },
  { label: 'Description:', column: 'description', type: 'longtext' }
  // { label: 'Design:', column: 'study_design', type: 'mref', property: 'label' },
  // { label: 'Number of participants:', column: 'numbero_of_participants', type: 'int' },
  // { label: 'Number of donors:', column: 'numbero_of_sample_donors', type: 'int' },
  // { label: 'Age:', type: 'range', min: 'age_low', max: 'age_high', unit: 'age_unit' },
  // { label: 'Sex:', column: 'sex', type: 'categoricalmref' },
  // { label: 'Materials:', column: 'materials', type: 'categoricalmref' },
  // { label: 'Inclusion criteria:', column: 'inclusion_criteria', type: 'categoricalmref' }
]

module.exports = initialStudyColumns
