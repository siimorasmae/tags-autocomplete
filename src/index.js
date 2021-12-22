import TagsAutocomplete from './tags-autocomplete.vue';

export default {
  id: 'tags-autocomplete',
  name: 'Tags Autocomplete',
  description: 'Over the internet, imagine that!',
  icon: 'local_offer',
  component: TagsAutocomplete,
  types: ['json', 'csv', 'string'],
  recommendedDisplays: ['labels'],
  options: [
    {
      field: 'url',
      name: 'Autocomplete URL*',
      type: 'string',
      meta: {
        width: 'full',
        interface: 'input',
        options: {
          placeholder: 'https://example.com/search?q={{value}}',
          font: 'monospace',
        },
      },
    },
    {
      field: 'resultsPath',
      name: 'Results path*',
      type: 'string',
      meta: {
        width: 'half',
        interface: 'input',
        options: {
          placeholder: 'results.tags',
          font: 'monospace',
        },
      },
    },
    {
      field: 'valuesToMap',
      name: 'Values to save (CSV)*',
      type: 'string',
      meta: {
        width: 'half',
        interface: 'input',
        options: {
          placeholder: 'name, uuid',
          font: 'monospace',
        },
        // note: 'Must include "Value to display"',
      },
      schema: {
        default_value: 'name',
      },
    },
    {
      field: 'displayValue',
      name: 'Value to display*',
      type: 'string',
      meta: {
        width: 'half',
        interface: 'input',
        options: {
          placeholder: 'name',
          font: 'monospace',
        },
      },
      schema: {
        default_value: 'name',
      },
    },
  ],
};