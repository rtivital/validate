(function () {
	'use strict';

	var _select = function(el) {
		return typeof el === 'string' 
			? (el.charAt(0) === '#' 
				? document.getElementById(el.slice(1))
				: document.querySelector(el))
			: el; 
	};

	var _isInput = function(el) {
		return ['input', 'textarea', 'select'].some(function(tagName) {
			return el.tagName.toLowerCase() === tagName;
		});
	};

	var _isString = function(str) {
		return typeof str === 'string' ? str.trim().length > 0 : false;
	};

	var _isNumber = function(num) {
		return typeof num === 'number' && !isNaN(num);
	};

	var _isArray = function(arr) {
		return Array.isArray(arr);
	};

	var _isRegExp = function(regexp) {
    return regexp instanceof RegExp;
  };

  var _extend = function(out) {
    var length = arguments.length;

    for (var i = 1; i < length; i = i + 1) {
      var obj = arguments[i];
      if (!obj || !_isObject(obj)) { continue; }

      for (var key in obj) {
        (out.hasOwnProperty(key) && _isObject(obj[key])) 
          ? _extend(out[key], obj[key])
          : out[key] = obj[key];
      } 
    }

    return out;
  };

	var _createMessage = function(str, substr) {
		if (_isNumber(substr)) { substr = substr.toString(); }
		return (_isString(str) && _isString(substr))
			? str.replace('%s', substr) 
			: str;
	};

	var _wrapMessage = function(tag, classes, text) {
		var element = document.createElement(tag);
		element.className = classes;
		element.textContent = text;

		return element;
	};

	var _replaceClass = function(el, oldClass, newClass) {
		el.classList.remove(oldClass);
		el.classList.add(newClass);
		return el;
	};

	var _contain = function(item) {
		return this.value.indexOf(item) > -1;
	};

	var Validate = function(input, settings) {
		this.settings = {
			messages: {
				min: 'This field should contain at least %s charachters',
				max: 'This field should not contain more than %s charachters',
				required: 'This field is required',
				match: 'This field should match this pattern "%s"',
				contain: 'This field sholud contain these charachters %s'
			},
			regexps: {
				ip: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        url: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        date: /\d{1,2}-|.\d{1,2}-|.\d{4}/,
        base64: /[^a-zA-Z0-9\/\+=]/i,
        email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
			},
			classes: {
				message: 'iv-message',
				errorsContainer: 'iv-errors-container',
				inputSuccess: 'iv-success',
				inputError: 'iv-error'
			}
		};

		_extend(this.settings, settings);

		this.input = _select(input);
		this.value = this.input.value;
		this.errors = [];
		
		if (!this.input.parentNode.querySelector('.' + this.settings.classes.errorsContainer)) {
			this.errorsContainer = document.createElement('div');
			this.errorsContainer.classList.add(this.settings.classes.errorsContainer);
			this.input.parentNode.insertBefore(this.errorsContainer, this.input);
		} else {
			this.errorsContainer = this.input.parentNode.querySelector('.' + this.settings.classes.errorsContainer);
			this.errorsContainer.innerHTML = '';
		}
	};

	Validate.prototype.test = function(fn, message) {
		if (!fn.call(this)) {
			this.errors.push(message);
		}
		return this;
	};

	Validate.prototype.required = function(message) {
		message = message || this.settings.messages['required'];
		return this.test(function() {
			return this.value.toString().trim().length > 0;
		}, message);
	};

	Validate.prototype.min = function(length, message) {
		message = message || this.settings.messages['min'];
		return this.test(function() {
			return this.value.length >= length;
		}, _createMessage(message, length));
	};

	Validate.prototype.max = function(length, message) {
		message = message || this.settings.messages['max'];
		return this.test(function() {
			return this.value.length <= length;
		}, _createMessage(message, length));
	};

	Validate.prototype.match = function(pattern, message) {
		message = message || this.settings.messages['match'];

		// Figure out if passed pattern is regexp
		// in that case use provided regexp
		// Otherwize try to grab regexp from settings
		var regexp;
		if (_isRegExp(pattern)) {
			regexp = pattern;
		} else if (this.settings.regexps[pattern]) {
			regexp = this.settings.regexps[pattern];
		} else {
			console.warn('Match method works only with regular expression or one of these presets: ' + Object.keys(this.settings.regexps).join(', '));
			return this;
		}
		return this.test(function() {
			return this.settings.regexps[pattern].test(this.value);
		}, _createMessage(message, pattern))
	};

	Validate.prototype.contain = function(chars, message) {
		message = message || this.settings.messages['contain'];

		// If array was passed to function cycle through all given charachters
		// and figure out if all of them are contained in this.value
		// Otherwize check if given string is contained in this.value
		return this.test(function() {
			return _isArray(chars) ? chars.every(_contain, this) : _contain.call(this, chars);
		}, _createMessage(message, _isArray(chars) ? chars.join(', ') : chars));
	};

	Validate.prototype.showErrors = function(index) {
		// Make sure that all previous messages were deleted
		this.errorsContainer.innerHTML = '';

		// If number was passed to function show only one error
		// Otherwize show all existing errors
		_isNumber(index) 
			? this.errorsContainer.appendChild(_wrapMessage('p', this.settings.classes.message, this.errors[index]))
			: this.errors.forEach(function(error) {
				this.errorsContainer.appendChild(_wrapMessage('p', this.settings.classes.message, error));
			}, this);
		return this;
	};

	// Return if all tests were passed
	Validate.prototype.isValid = function() {
		return this.errors.length === 0;
	};

	// Remove all previous messages from errors array
	Validate.prototype.clear = function() {
		this.errors = [];
		return this;
	};

	Validate.prototype.error = function() {
		_replaceClass(this.input, this.settings.classes.inputSuccess, this.settings.classes.inputError);
		return this;
	};

	Validate.prototype.success = function() {
		_replaceClass(this.input, this.settings.classes.inputError, this.settings.classes.inputSuccess);
		return this;
	};

	Validate.prototype.onError = function(fn) {
		fn = fn || function() {};
		if (!this.isValid()) { fn.call(this); }
		return this;
	};

	Validate.prototype.onSuccess = function(fn) {
		fn = fn || function() {};
		if (this.isValid()) { fn.call(this); }
		return this;
	};

	var validate = function(input) {
		return new Validate(input);
	};

	window.validate = validate;
})();