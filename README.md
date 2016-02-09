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


Include library before closing `<body>` tag

```html
<body>
	...
	<script src="input-validator.min.js"></script>
</body>
```

Grab the `<input />` tag from the DOM tree and start the data validation
```javascript
var emailInput = new Validator.init(document.getElementById('email'), {
  rules: {
    min: 5,
    max: 20,
    match: 'email'
  },
  onError: function() {
    var parentNode = this.element.parentNode;
    parentNode.classList.add('has-error');
    parentNode.classList.remove('has-success');
    parentNode.querySelector('.help-block').textContent = 'Error: ' + this.message;
  },
  onSuccess: function() {
    var parentNode = this.element.parentNode;
    parentNode.classList.add('has-success');
    parentNode.classList.remove('has-error');
    parentNode.querySelector('.help-block').textContent = 'Everything is valid!';
  }
});
```

## Documentation
### Configuration object
`Validator.init` function accepts consfiguration object like this one: 
```javascript
{
  rules: {
    min: 5,
    max: 20,
    match: 'email'
  },
  onError: function() {
    console.log('Error' + this.message);
  },
  onSuccess: function() {
    console.log('Everything is valid!');
  }
}
```
These are minimum set of values. Additionally you can pass in `messages` and `regExps` objects to replace predefined settings or add your own testing rules:
```javascript
// Defaults:
{
  regExps: {
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    url: /^((https?):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
    numbers: /^\d+(\.\d{1,2})?$/,
    digit: /[0-9]*$/,
    letters: /[a-z][A-Z]*$/
  },
  messages = {
    required: 'This field is required',
    min: 'This field should contain at least %rule% characters',
    max: 'This field should not contain more than %rule% characters',
    match: 'This field shold countain a valid %rule%'
  }
}
```

### Basic validation
Generally, you want the validation to occur with certain events (e.g. click, keyup, etc.). In this case consider this code:
```javascript
var onError = function() {
  var parentNode = this.element.parentNode;
  parentNode.classList.add('has-error');
  parentNode.classList.remove('has-success');
  parentNode.querySelector('.help-block').textContent = 'Ошибка: ' + this.message;
};

var onSuccess = function() {
  var parentNode = this.element.parentNode;
  parentNode.classList.add('has-success');
  parentNode.classList.remove('has-error');
  parentNode.querySelector('.help-block').textContent = 'Ура! Всё прошло хорошо, ваши данные полность валидные.';
};

var emailInput = new Validator.init(document.getElementById('email'), {
  rules: {
    min: 5,
    max: 20,
    match: 'email'
  }
  onError: onError,
  onSuccess: onSuccess
});

document.getElementById('validate-btn').addEventListener('click', function(e) {
  e.preventDefault();
  emailInput.validate();
});
```

### Validation methods
#### required
`Validator.fn.required` returns if the value contains at least one symbol, except for whitespace
```javascript
validate(document.getElementById('email'), {
  rules: {
    required: true
  }
});
```
#### min
`Validator.fn.min` returns if the value length is more than provided length
```javascript
validate(document.getElementById('email'), {
  rules: {
    min: 8
  }
});
```
#### max
`Validator.fn.max` returns if the value length is less than provided length
```javascript
validate(document.getElementById('email'), {
  rules: {
    max: 20
  }
});
```
#### match
`Validator.fn.match` returns if the value matches certain pattern. Available patterns:

* email
* url
* numbers
* digits
* letters 

```javascript
validate(document.getElementById('email'), {
  rules: {
    match: 'email'
  }
});
```

You can also define tou regular expression in config object and then use it:
```javascript
validate(document.getElementById('email'), {
  regExps: {
    base64: /[^a-zA-Z0-9\/\+=]/i
  },
  rules: {
    match: 'base64'
  }
});
```
### Callbacks
#### onError
`onError` callback, which you define in config object, will be called every time `Validator.fn.validate` method fails: 
```javascript
validate(document.getElementById('email'), {
  rules: {
    min: 8,
    max: 50,
    match: 'email'
  },
  onError: function() {
    console.log('Error: ' + this.message);
  }
});
```
#### onSuccess
`onSuccess` callback, which you define in config object, will be called every time `Validator.fn.validate` method passed: 
```javascript
validate(document.getElementById('email'), {
  rules: {
    min: 8,
    max: 50,
    match: 'email'
  },
  onSuccess: function() {
    console.log('Everything is valid');
  }
});
```

#### Creating messages
You can create your own messages with simple template variables `%rule%` and `%data%`:
```javascript
validate(document.getElementById('email'), {
  rules: {
    min: 8,
    max: 50,
    match: 'email'
  },
  messages: {
    min: 'The value of this field shold be at least %rule% characters long. Value %data% does\'t fit well!',
    max: 'The value of this field shold not be longer than %rule% characters. Value %data% does\'t fit well!',
    match: '%data% is not a valid %rule% address'
  }
});
```

`%data%` refers to the current value from input field. `%rule%` refers to current param (e.g. 8 at `min`, 50 at `max` and `email` at `match`).


## Browser support
Input validator uses `Object.keys()` [ES5](http://caniuse.com/#feat=es5) feature. 

Browser Support:
* IE 9+
* Chrome 23+
* Firefox 21+
* Opera 15+
* Safari 6+