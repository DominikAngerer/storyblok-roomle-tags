<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div class="uk-form-row" v-if="model.type == 'single'">
      <select class="uk-width-1-1" v-model="model.value">
          <option></option>
          <option v-for="tag in model.tags" v-bind:value="tag">{{ tag }}</option>
        </select>
    </div>
    <div class="uk-form-row" v-else>
      <label class="uk-margin-right uk-margin-bottom uk-display-block" v-for="tag in model.tags">
        <input v-model="model.values" type="checkbox" class="uk-margin-small-right" value="{{ tag }}">
        {{ tag }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loading() {
      return !this.model.tags.length
    },
    options() {
      var options = {}
      for (var index = 0; index < this.schema.options.length; index++) {
        var element = this.schema.options[index]
        options[element.name] = element.value;
      }
      return options
    }
  },
  mixins: [ window.Storyblok.plugin ],
  methods: {
    initWith: function() {
      return {
        plugin: 'roomle-tags',
        tags: [],
        type: '',
        value: '',
        values: []
      }
    },
    concatUnique: function(array, b) {
      var a = array.concat(b);
      for(var i=0; i<a.length; ++i) {
          for(var j=i+1; j<a.length; ++j) {
              if(a[i] === a[j])
                  a.splice(j--, 1);
          }
      }
      return a;
    }
  },
  events: {
    'plugin:created': function() {

      // Make sure Options are set.
      if (!this.schema.options) {
        console.warn('roomle-tags: We guess you\'re working locally so we will set the options for you.');
        this.schema.options = [
          {
            name:'root_tag',
            value:''
          },
          {
            name:'type',
            value:'single'
          }
        ]
      }
      
      // Check if min 2
      if(this.schema.options.length < 2) {
        console.error('roomle-tags: Define the following options: root_tag -> string and type -> string (single|multi)');
        return false;
      }

      // Set Type
      this.model.type = this.options.type ? this.options.type : 'single'

      // load Data from Roomle
      jQuery.ajax({
          url: 'https://api.roomle.com/v2/tags/' +  this.options.root_tag + '/',
          success: (response) => {
            var responseTags = response.tag.tags
            var currentTags = this.model.tags
            this.model.tags =  this.concatUnique(currentTags, responseTags)
          }
        })
        
    }
  },
  watch: {
    'model': {
      handler: function (value) {
        this.$emit('changed-model', value)
      },
      deep: true
    }
  }
}
</script>

<style>
</style>
