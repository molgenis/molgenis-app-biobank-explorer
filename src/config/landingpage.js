export const landingpage = {
  enabled: true,
  page_header: 'BBMRI-ERIC Directory',
  page_search: {
    buttonText: 'Search',
    searchPlaceholder: 'Find a biobank or collection',
    ariaLabel: 'Searchbox for finding a biobank or collection'
  },
  page_cta: [
    {
      buttonText: 'Learn how',
      buttonUrl: '#',
      bodyHtml: `<h2>BBMRI Directory</h2>
        <p>Make your biobank visible</p>
        <p>Make your collections accessible</p>`
    },
    {
      buttonText: 'References',
      buttonUrl: '#',
      bodyHtml: `<h2>Services we offer</h2>
        <p>Manuals &amp; templates</p>`
    },
    {
      buttonText: 'Support',
      buttonUrl: '#',
      bodyHtml: `<h2>Support</h2>
        <p>Contact the servicedesk</p>`
    }
  ],
  page_biobank_spotlight: {
    header: 'Biobank of interest',
    biobankName: 'A BioBank',
    biobankId: '',
    bodyHtml: '<p>Lorum ipsum dolor amet</p>'
  },
  page_collection_spotlight: {
    header: 'New collections',
    collections: [
      {
        id: '',
        name: 'Collection 1'
      },
      {
        id: '',
        name: 'Collection 2'
      },
      {
        id: '',
        name: 'Collection 3'
      },
      {
        id: '',
        name: 'Collection 4'
      }
    ]
  }
}
