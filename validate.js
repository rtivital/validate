var Validator = (function() {
  'use strict';

  // Creates messages by replacement %var% templates
  var _createMessage = function(message, settings) {
    for (var key in settings) {
      message = message.replace('%' + key + '%', settings[key]);
    }
    return message;
  };

  // Returns is provided param is actually an input element
  var _isInput = function(element) {
    if (!element || !element.tagName) {
      return false;
    }
    var tagName = element.tagName.toLowerCase()
    return tagName === 'input' || tagName === 'textarea';
  };

  // Extends one object from others
  // http://youmightnotneedjquery.com/#deep_extend
  var _extend = function(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];

      if (!obj)
        continue;

      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object')
            out[key] = _extend(out[key], obj[key]);
          else
            out[key] = obj[key];
        }
      }
    }

    return out;
  };

  // Basic regular expressions
  var regExps = {
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    url: /^((https?):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    numbers: /^\d+(\.\d{1,2})?$/,
    digit: /[0-9]*$/,
    letters: /[a-z][A-Z]*$/
  };

  // Default messages: All object created with Validate function will share link to this object
  var messages = {
    required: 'This field is required',
    min: 'This field should contain at least %rule% characters',
    max: 'This field should not contain more than %rule% characters',
    match: 'This field shold countain a valid %rule%'
  };

  var Validate = function(element, options) {
    if (!_isInput(element)) {
      throw new Error('Only value from <input> and <textarea> can be validated');
    }

    if (!options.rules || Object.keys(options.rules).length === 0) {
      throw new Error('No rules for validation were passed to Validator function');
    }

    var defaults = {
      regExps: regExps,
      messages: messages
    };
    // Set basic options to get access from onSuccess and onError functions
    this.options = _extend({}, defaults, options);
    this.element = element;

    // Set regExps from outer scope
    this.regExps = regExps;
  };

  var fn = Validate.prototype;

  fn.validate = function() {
    var isValid = true;

    this.value = this.element.value;
    for (var rule in this.options.rules) {
      // Set testing function
      var test = this[rule];

      if (!test || typeof test !== 'function') {
        throw new Error('Rule ' + rule + ' can\'t be evaluated. It is not predefined. You can create it yourself with Validator.fn');
      }

      // Grab param from options object
      var param = this.options.rules[rule];

      if (!this[rule](param)) {
        isValid = false;
        this.message = _createMessage(this.options.messages[rule], {rule: param, data: this.value});
        this.options.onError.call(this);
        break;
      }
    }

    if (isValid) {
      this.options.onSuccess.call(this);
    }
  };

  fn.required = function() {
    return this.value.trim().length > 0;
  };

  fn.min = function(param) {
    return this.value.length >= param;
  };

  fn.max = function(param) {
    return this.value.length <= param;
  };

  fn.match = function(param) {
    var re = this.regExps[param];
    if (!re) {
      console.warn('There are no such predefined regexp: '
        + param + '. All predefined regExps are: '
        + Object.keys(this.options.regExps).join(', ') +'. Data is assumed to be valid.');
      return true;
    }
    return this.regExps[param].test(this.value);
  };

  return {
    init: Validate,
    fn: fn
  };
})();
