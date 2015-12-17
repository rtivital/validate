(function () {
	'use strict';

	var geId = function(el) {
		return  document.getElementById(el);
	};

	var query = function(el, selector) {
		var container = el || document;
		return container.querySelector(selector);
	};

	var createElement = function(tag) {
		return document.createElement(tag);
	};

	var _select = function(el) {
		if (typeof el === 'string') {
			var isId = el.charAt(0) === '#'
			var selector = el.slice(1);
			var result = isId ? geId(selector) : query(el);
		}
		return result || el;
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
		return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
	};

	var _isArray = function(arr) {
		return Array.isArray(arr);
	};

	var _isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	var _isRegExp = function(regexp) {
		return regexp instanceof RegExp;
	};

	var _extend = function() {
		var args = arguments;
		var i = args.length;
		var result = arguments[0];

		while ( i-- ) {
			if (i === 0) break;
			var obj = args[i];
			if (_isObject(obj)) {
				for (var key in obj) {
					if (result.hasOwnProperty(key) && _isObject(obj[key])) {
						_extend(result[key], obj[key]);
					} else {
						result[key] = obj[key];
					}
				}
			}
		}
		return result;
	};

	var _createMessage = function(str, substr) {
		if (_isNumber(substr)) { substr = substr.toString(); }
		return !(_isString(str) && _isString(substr))
			? str.replace('%s', substr) 
			: str;
	};

	var _wrapMessage = function(tag, classes, text) {
		var el = createElement(tag);
		el.className = classes;
		el.textContent = text;
		return el;
	};

	var _replaceClass = function(el, oldClass, newClass) {
		var classes = el.classList;
		classes.remove(oldClass);
		classes.add(newClass);
		return el;
	};

	var _contain = function(item) {
		return this.value.indexOf(item) > -1;
	};

	var messages, settings, classes, regexps, errorsContainer, errors;

	var Validate = function(input, user_settings) {
		settings = {
			messages: {
				min: 'This field should contain at least %s charachters',
				max: 'This field should not contain more than %s charachters',
				required: 'This field is required',
				match: 'This field should match this pattern "%s"',
				contain: 'This field sholud contain these charachters %s'
			},
			regexps: {
				ip: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
				url: /^((https?):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
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

		_extend(settings, user_settings);

		messages = settings.messages;
		classes = settings.classes;
		regexps = settings.regexps;

		var input = this.input = _select(input);
		var parentNode = input.parentNode;
		var classErrorsContainer = classes.errorsContainer
		var domErrorsContainer = query(parentNode, '.' + classErrorsContainer);

		this.value = input.value;
		errors = [];

		if (!domErrorsContainer) {
			errorsContainer = createElement('div');
			errorsContainer.classList.add(classErrorsContainer);
			parentNode.insertBefore(errorsContainer, input);
		} else {
			errorsContainer = domErrorsContainer;
			errorsContainer.innerHTML = '';
		}
	};

	Validate.prototype.test = function(fn, message) {
		if (!fn.call(this)) {
			errors.push(message);
		}
		return this;
	};

	Validate.prototype.required = function(message) {
		message = message || messages['required'];
		return this.test(function() {
			return this.value.toString().trim().length > 0;
		}, message);
	};

	Validate.prototype.min = function(length, message) {
		message = message || messages['min'];
		return this.test(function() {
			return this.value.length >= length;
		}, _createMessage(message, length));
	};

	Validate.prototype.max = function(length, message) {
		message = message || messages['max'];
		return this.test(function() {
			return this.value.length <= length;
		}, _createMessage(message, length));
	};

	Validate.prototype.match = function(pattern, message) {
		message = message || messages['match'];

		// Figure out if passed pattern is regexp
		// in that case use provided regexp
		// Otherwize try to grab regexp from settings
		var regexp;
		if (_isRegExp(pattern)) {
			regexp = pattern;
		} else if (regexps[pattern]) {
			regexp = regexps[pattern];
		} else {
			console.warn('Match method works only with regular expression or one of these presets: ' + Object.keys(regexps).join(', '));
			return this;
		}
		return this.test(function() {
			return regexps[pattern].test(this.value);
		}, _createMessage(message, pattern))
	};

	Validate.prototype.contain = function(chars, message) {
		message = message || messages['contain'];

		// If array was passed to function cycle through all given charachters
		// and figure out if all of them are contained in this.value
		// Otherwize check if given string is contained in this.value
		return this.test(function() {
			return _isArray(chars) ? chars.every(_contain, this) : _contain.call(this, chars);
		}, _createMessage(message, _isArray(chars) ? chars.join(', ') : chars));
	};

	Validate.prototype.showErrors = function(index) {
		// Make sure that all previous messages were deleted
		errorsContainer.innerHTML = '';

		// If number was passed to function show only one error
		// Otherwize show all existing errors
		_isNumber(index) 
			? errorsContainer.appendChild(_wrapMessage('p', classes.message, errors[index]))
			: errors.forEach(function(error) {
				errorsContainer.appendChild(_wrapMessage('p', classes.message, error));
			}, this);
		return this;
	};

	// Return if all tests were passed
	Validate.prototype.isValid = function() {
		return errors.length === 0;
	};

	// Remove all previous messages from errors array
	Validate.prototype.clear = function() {
		errors = [];
		return this;
	};

	Validate.prototype.error = function() {
		_replaceClass(this.input, classes.inputSuccess, classes.inputError);
		return this;
	};

	Validate.prototype.success = function() {
		_replaceClass(this.input, classes.inputError, classes.inputSuccess);
		return this;
	};

	Validate.prototype.onError = function(fn) {
		if (typeof fn === 'function' && !this.isValid()) {
			fn.call(this);
		}
		return this;
	};

	Validate.prototype.onSuccess = function(fn) {
		if (typeof fn === 'function' && this.isValid()) {
			fn.call(this);
		}
		return this;
	};

	var validate = function(input) {
		return new Validate(input);
	};

	window.validate = validate;
})();