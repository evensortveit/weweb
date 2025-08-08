export default {
  editor: {
    label: {
      en: 'Rich Text',
    },
    icon: 'file-text',
  },
  properties: {
    supabaseUrl: {
      label: {
        en: 'Supabase URL',
      },
      type: 'Text',
      bindable: true,
    },
    supabaseKey: {
      label: {
        en: 'Supabase Key',
      },
      type: 'Text',
      bindable: true,
    },
    documentId: {
      label: {
        en: 'Document ID',
      },
      type: 'Text',
      bindable: true,
    },
    modelValue: {
      label: {
        en: 'Content',
      },
      type: 'Object',
      bindable: true,
    },
  },
}
