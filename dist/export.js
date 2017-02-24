(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  computed: {
    loading: function loading() {
      return !this.model.tags.length;
    },
    options: function options() {
      var options = {};
      for (var index = 0; index < this.schema.options.length; index++) {
        var element = this.schema.options[index];
        options[element.name] = element.value;
      }
      return options;
    }
  },
  mixins: [window.Storyblok.plugin],
  methods: {
    initWith: function initWith() {
      return {
        plugin: 'roomle-tags',
        tags: [],
        type: '',
        value: '',
        values: []
      };
    },
    concatUnique: function concatUnique(array, b) {
      var a = array.concat(b);
      for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
          if (a[i] === a[j]) a.splice(j--, 1);
        }
      }
      return a;
    }
  },
  events: {
    'plugin:created': function pluginCreated() {
      var _this = this;

      // Make sure Options are set.
      if (!this.schema.options) {
        console.warn('roomle-tags: We guess you\'re working locally so we will set the options for you.');
        this.schema.options = [{
          name: "root_tag",
          value: ""
        }, {
          name: "type",
          value: "single"
        }];
      }

      // Check if min 2
      if (this.schema.options.length < 2) {
        console.error('roomle-tags: Define the following options: root_tag -> string and type -> string (single|multi)');
        return false;
      }

      // Set Type
      this.model.type = this.options.type ? this.options.type : 'single';

      // load Data from Roomle
      jQuery.ajax({
        url: 'https://api.roomle.com/v2/tags/' + this.options.root_tag + '/',
        success: function success(response) {
          var responseTags = response.tag.tags;
          var currentTags = _this.model.tags;
          _this.model.tags = _this.concatUnique(currentTags, responseTags);
        }
      });
    }
  },
  watch: {
    'model': {
      handler: function handler(value) {
        this.$emit('changed-model', value);
      },
      deep: true
    }
  }
};
if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<div><div v-if=loading>Loading...</div><div class=uk-form-row v-if=\"model.type == 'single'\"><select class=uk-width-1-1 v-model=model.value><option><option v-for=\"tag in model.tags\" v-bind:value=tag>{{ tag }}</select></div><div class=uk-form-row v-else=\"\"><label class=\"uk-margin-right uk-margin-bottom uk-display-block\" v-for=\"tag in model.tags\"><input v-model=model.values type=checkbox class=uk-margin-small-right value=\"{{ tag }}\"> {{ tag }}</label></div></div>"

},{}],2:[function(require,module,exports){
'use strict';

var _Plugin = require('../Plugin.vue');

var _Plugin2 = _interopRequireDefault(_Plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = _Plugin2.default.methods.initWith();

window.storyblok.field_types[init.plugin] = _Plugin2.default;

},{"../Plugin.vue":1}]},{},[2]);
