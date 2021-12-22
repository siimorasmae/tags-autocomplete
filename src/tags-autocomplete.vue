<template>
  <v-notice v-if="!url || !resultsPath || !valuesToMap" type="warning">
    One or more required options are missing
  </v-notice>

  <div v-else>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :autocomplete-items="autocompleteItems"
      :add-only-from-autocomplete="true"
      placeholder="Add tags..."
      @tags-changed="update"
      :add-from-paste="false"
    />
    <v-skeleton-loader class="ti-loader" v-if="isLoading" />
  </div>
</template>

<script>
import VueTagsInput from '@sipec/vue3-tags-input';
import { render } from 'micromustache';
import pick from 'lodash.pick';
import get from 'lodash.get';

export default {
  props: {
    value: {
			type: String,
			default: null,
		},
    url: String,
    resultsPath: String,
    valuesToMap: {
      type: String,
      default: 'name',
    },
    displayValue: {
      type: String,
      default: 'name',
    },
  },
  data() {
    return {
      tag: '',
      tags: [],
      autocompleteItems: [],
      debounce: null,
      isLoading: false,
    };
  },
  emits: ['input'],
  watch: {
    'tag': 'initItems',
    value: {
      handler (newVal) {
        if (newVal) this.tags = JSON.parse(JSON.stringify(newVal))
      },
      immediate: true,
    }
  },
  methods: {
    update(newTags) {
      this.autocompleteItems = [];
      this.tags = newTags;
      this.$emit('input', newTags);
    },
    initItems() {
      if (this.tag.length < 3) return;
      const url = render(this.url, { value: this.tag });

      clearTimeout(this.debounce);

      this.debounce = setTimeout(async () => {
        try {
          this.isLoading = true;
          const response = await fetch(url).then(res => res.json());
          const responseArray = get(response, this.resultsPath);
          const valuesArray = this.valuesToMap.split(',');
          const valuesTrim = valuesArray.map(s => s.trim());

          this.autocompleteItems = responseArray.map(tag => {
            const values= pick(tag, valuesTrim);

            return {
              ...values,
              text: tag[this.displayValue],
            }
          });
        } catch (error) {
          console.warn(`Tags autocomplete says: ${error}`)
        }

        this.isLoading = false;
      }, 600);
    },
  },
  components: {
    VueTagsInput,
  },
};
</script>

<style>
  .vue-tags-input {
    background: none !important;
    max-width: 100% !important;
  }
  .ti-input {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-height: var(--input-height);
    width: 100%;
    padding: var(--input-padding);
    padding-top: 0;
    padding-bottom: 0;
    color: var(--v-input-color);
    font-family: var(--v-input-font-family);
    background-color: var(--v-input-background-color);
    border: var(--border-width) solid var(--border-normal) !important;
    border-radius: var(--border-radius);
    -webkit-transition: border-color var(--fast) var(--transition);
    transition: border-color var(--fast) var(--transition);
  }
  .ti-new-tag-input-wrapper input {
    font-family: var(--v-input-font-family) !important;
    font-size: 15px;
    background: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    color: inherit;
  }
  .ti-new-tag-input-wrapper input::placeholder{
    color:var(--foreground-subdued)
  }
  .ti-autocomplete {
    max-height: 30vh;
    padding: 4px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--card-face-color) !important;
    border: none !important;
    border-radius: var(--border-radius);
    -webkit-box-shadow: 0 0 6px 0 rgba(var(--card-shadow-color),.2),0 0 12px 2px rgba(var(--card-shadow-color),.05);
    box-shadow: 0 0 6px 0 rgba(var(--card-shadow-color),.2),0 0 12px 2px rgba(var(--card-shadow-color),.05);
    -webkit-transition-timing-function: var(--transition-out);
    transition-timing-function: var(--transition-out);
    -webkit-transition-duration: var(--fast);
    transition-duration: var(--fast);
    -webkit-transition-property: opacity,-webkit-transform;
    transition-property: opacity,-webkit-transform;
    transition-property: opacity,transform;
    transition-property: opacity,transform,-webkit-transform;
    contain: content;
  }
  .ti-item {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    min-width: var(--v-list-item-min-width);
    max-width: var(--v-list-item-max-width);
    min-height: var(--v-list-item-min-height);
    max-height: var(--v-list-item-max-height);
    margin: var(--v-list-item-margin);
    padding: var(--v-list-item-padding);
    overflow: hidden;
    color: var(--v-list-item-color);
    text-decoration: none;
    border-radius: var(--v-list-item-border-radius);
  }
  .ti-tags {
    line-height: inherit !important;
  }
  .ti-tag {
    border-radius: var(--border-radius) !important;
    background: var(--primary) !important;
    padding: 0 8px !important;
    color: var(--foreground-inverted) !important;
  }
  .ti-tag span {
    font-size: 14px;
  }
  .ti-icon-close {
    color: var(--foreground-inverted);
  }
  .ti-tag.ti-deletion-mark {
    background: var(--danger) !important;
  }
  .ti-loader {
    position: absolute !important;
    opacity: 60%;
    top: 0;
    bottom: 0;
    height: auto !important;
  }
</style>