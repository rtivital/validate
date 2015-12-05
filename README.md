# Input validator
Input validator is a modern lightweight library without dependencies for data validation from single `<input />` tag. 

View demo [here](http://rtivital.github.io/validate/)

## Installation
Install with Bower:
```
bower install input-validator
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
2. Include the stylesheet on your document's `<head>` (optional)
```html
<head>
	<link rel="stylesheet" href="input-validator.min.css">
</head>
```

3. Grab `<input />` tag from the DOM tree and start data validation
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
			// If all specified tests passed do something
		}
});
```

## Documentation
### Grabbing input element from the DOM tree
You can either grab element by yourself and then pass it in `validate()` function
```javascript
var email = document.getElementById('email'),
	emailValidation = validate(email);
```
or simply pass selector in `validate()` function
```javascript
// It is recomended to pass in an id
var emailValidation = validate('#email')
// But you can pass whatever selector you like
// In this case first element that matches provided selector will be grabbed from the DOM
var emailValidation = validate('.email');
```

### Basic validation
Once you grabbed your input element from the DOM you can start validation. Generally you want validation to occur with certain events (e.g. click, keyup, etc.). In this case consider this code:
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
If you want to avoid new `validate` object creation each time event occurs you can create this object once before adding event listener and then refresh value:
```javascript
var btn = document.getElementById('validate-btn'),
		emailValidation = validate('#email');
btn.addEventListener('click', function(e) {
	e.preventDefault();
	// Refresh method will asign new value from input tag to emailValidation object
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
`required(message)` returns if value contains at least 1 charachter except whitespace
```javascript
validate('#email')
	.required('This field is required');
```
#### min
`min(length, message)` returns if value length is greater than provided length
```javascript
validate('#email')
	.min(8, 'This input should contain at least %s characters');
```
#### max
`max(length, message)` returns if value length is less than provided length
```javascript
validate('#email')
	.max(50, 'This input should not contain more than %s characters');
```
#### match
`match(pattern, message)` returns if value matches certain pattern. Available patterns:
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
`contain(substring, message)` returns if value contains each provided character
```javascript
// You can pass in either array
validate('#email')
	.contain(['@', 'gmail', '.com'], 'This field should contain these substrings %s');

// or string
validate('#email')
	.contain('gmail', 'This field should contain this substring %s');
```
### Displaying errors
All errors that will be displayed are appended to the `errorsContainer`. By default you don't need to create it by yourself - library will do this for (it will create and append errors container just before selected input tag).
To show errors you can call `showErrors(index)` method:
```javascript
// This code will show all occured errors
validate('#email')
	.required()
	.match('email')
	.contain('gmail')
	.showErrors();

// If you do not want all errors to display you can pass in index\
// And now it will show only first error
validate('#email')
	.required()
	.match('email')
	.contain('gmail')
	.showErrors(0);
```
Also you can access errors array and do everithing you want
```javascript
var emailValidation = validate('#email')
	.required()
	.match('email')
	.contain('gmail');

emailValidation.errors; // All errors are stored withib this array
```
### Callbacks
#### onError
`onError(fn)` accepts function that will be called when validation failed
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
`onSuccess(fn)` accepts function that will be called when validation passed
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
`isValid()` method returns if all chosen tests passed successfully
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
`error()` and `success()` methods can be used to add class specified in settings to the selected input element
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