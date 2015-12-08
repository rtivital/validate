# Input Validator
Input Validator is a modern lightweight library without dependencies for the data validation from single `<input />` tag. 

View demo [here](http://rtivital.github.io/validate/)

## Installation
Install with Bower:
```
bower install input-validator.js
```
Or clone from Github:
```
git clone https://github.com/rtivital/validate.git
```

## Usage 
1. Include library before closing `<body>` tag
```html
<body>
	...
	<script src="input-validator.min.js"></script>
</body>
```
2. Include the stylesheet in your document `<head>` (optional)
```html
<head>
	<link rel="stylesheet" href="input-validator.min.css">
</head>
```

3. Grab `<input />` tag from the DOM tree and start the data validation
```javascript
var btn = document.getElementById('validate-btn');
btn.addEventListener('click', function(e) {
	e.preventDefault();
	var emailValidation = validate('#email')
		.min(8)
		.max(50)
		.match('email')
		.contain('gmail')
		.onError(function() {
			this.showErrors();
			this.error();
		})
		.onSuccess(function() {
			this.success();
		});

		if (emailValidation.isValid()) {
			// If all specified tests have been passed, do something
		}
});
```

## Documentation
### Grabbing input element from the DOM tree
You can either grab element yourself and then pass it in `validate()` function
```javascript
var email = document.getElementById('email'),
	emailValidation = validate(email);
```
or just pass selector in `validate()` function
```javascript
// It is recomended to pass in an id
var emailValidation = validate('#email')
// But you can pass whatever selector you like
// In this case first element that matches provided selector will be grabbed from the DOM
var emailValidation = validate('.email');
```

### Basic validation
After you have grabbed your input element from the DOM you can start validation. Generally, the validation should occur with certain events (e.g. click, keyup, etc.). In this case you should consider this code:
```javascript
var btn = document.getElementById('validate-btn');
btn.addEventListener('click', function(e) {
	e.preventDefault();
	// With every event new validate object will be created
	var emailValidation = validate('#email')
		.min(8)
		.max(50)
		.match('email')
		.contain('gmail')
		.onError(function() {
			this.showErrors();
			this.error();
		})
		.onSuccess(function() {
			this.success();
		});
});
```
If you want to avoid a creation of new `validate` object every time, when the event occurs, you may create this object once before adding event listener and then refresh value:
```javascript
var btn = document.getElementById('validate-btn'),
		emailValidation = validate('#email');
btn.addEventListener('click', function(e) {
	e.preventDefault();
	// Refresh method will assign a new value from the input tag to emailValidation object
	emailValidation
		.refresh()
		.clear()
		.min(8)
		.max(50)
		.match('email')
		.contain('gmail')
		.onError(function() {
			this.showErrors();
			this.error();
		})
		.onSuccess(function() {
			this.success();
		});
});
```

### Validation methods
#### required
`required(message)` returns if the value contains at least one symbol, except for whitespace
```javascript
validate('#email')
	.required('This field is required');
```
#### min
`min(length, message)` returns if the value length is more than provided length
```javascript
validate('#email')
	.min(8, 'This input should contain at least %s characters');
```
#### max
`max(length, message)` returns if the value length is less than provided length
```javascript
validate('#email')
	.max(50, 'This input should not contain more than %s characters');
```
#### match
`match(pattern, message)` returns if the value matches certain pattern. Available patterns:
* email
* ip
* date
* base64 
* url
```javascript
validate('#email')
	.match('email', 'This field should contain a valid email address');
```
You can also pass regular expression 
```javascript
validate('#email')
	.match(/^\-?[0-9]*\.?[0-9]+$/, 'This field should contain decimal');
```
#### contain
`contain(substring, message)` returns if the value contains each provided character
```javascript
// You can pass in either array
validate('#email')
	.contain(['@', 'gmail', '.com'], 'This field should contain these substrings %s');

// or string
validate('#email')
	.contain('gmail', 'This field should contain this substring %s');
```
### Displaying errors
All errors that will be displayed are appended to the `errorsContainer`. By default you don't need to create it yourself - the library will do this for you (it will create and append `errorsContainer` just before selected input tag).
To show errors you can call `showErrors(index)` method:
```javascript
// This code will show all errors
validate('#email')
	.required()
	.match('email')
	.contain('gmail')
	.showErrors();

// If you do not want all errors to display you can pass in index\
// And now it will show only the first error
validate('#email')
	.required()
	.match('email')
	.contain('gmail')
	.showErrors(0);
```
Also you can access errors array and do everything you like with it:
```javascript
var emailValidation = validate('#email')
	.required()
	.match('email')
	.contain('gmail');

emailValidation.errors; // All errors are stored withib this array
```
### Callbacks
#### onError
`onError(fn)` method accepts function, which will be called when validation fails
```javascript
validate('#email')
	.match('email')
	.onError(function() {
		// this keyword refers to the created object
		this.showErrors(0);
		this.input.classList.add('error');
		// Do something else ...
	});
```
#### onSuccess
`onSuccess(fn)` method accepts function, which will be called when validation passes
```javascript
validate('#email')
	.match('email')
	.onSuccess(function() {
		// this keyword refers to the created object
		this.input.classList.remove('error');
		this.input.classList.add('success');
		// Do something else ...
	});
```

### Helpers
#### isValid
`isValid()` method returns if all chosen tests have been passed successfully
```javascript
var emailValidation = validate('#email')
	.min(8)
	.max(50)
	.match('email');

if (emailValidation.isValid()) {
	// Do something here
}
```
#### clear
`clear()` method initializes new errors array 
```javascript
validate('#email')
	.min(8)
	.max(50)
	.match('email')
	.clear()
	.showErrors(); // Nothig will be shown
```

#### error and success
`error()` and `success()` methods can be used to add class which is specified in settings to the selected input element
```javascript
validate('#email')
	.match('email')
	.onError(function() {
		this.error();
	})
	.onSuccess(function() {
		this.success();
	});
```

### Settings
You can provide settings object to `validate` function
```javascript
// These are default settings
var emailValidation = validate('#email' {
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
		errorsContainer: 'iv-errors',
		inputSuccess: 'iv-success',
		inputError: 'iv-error'
	}
});
```

## Browser support
Input validator uses these [ES5](http://caniuse.com/#feat=es5) features: 
* `Array.isArray()`	
* `Array.some()`
* `Array.every()`
* `Array.forEach()` 
* `Object.keys()`

Browser Support
* IE 9+
* Chrome 23+
* Firefox 21+
* Opera 15+
* Safari 6+