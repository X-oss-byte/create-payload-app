export const Forms = {
  // the slug is used for naming the collection in the database and the APIs that are open. For example: api/pages/${id}
  slug: 'pages',
  admin: {
    // this is the name of a field which will be visible for the edit screen and is also used for relationship fields
    useAsTitle: 'fullTitle',
    // defaultColumns is used on the listing screen in the admin UI for the collection
    defaultColumns: [
      'fullTitle',
      'author',
      'createdAt',
      'status',
    ],
  },
  // the access is set to allow read for anyone
  access: {
    // allow guest users to fetch pages
    read: () => true,
  },
  // versioning with drafts enabled tells Payload to save documents to a separate collection in the database and allow publishing
  fields: [
    {
      name: 'title',
      label: 'Page Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Layout',
          fields: [
            {
              type: 'text',
              name: 'content',
            }
          ]
        }
      ]
    },
  ],
};

export default Forms;
