var onError = function() {
  var parentNode = this.element.parentNode;
  parentNode.classList.add('has-error');
  parentNode.classList.remove('has-success');
  parentNode.querySelector('.help-block').textContent = 'Error: ' + this.message;
};

var onSuccess = function() {
  var parentNode = this.element.parentNode;
  parentNode.classList.add('has-success');
  parentNode.classList.remove('has-error');
  parentNode.querySelector('.help-block').textContent = 'Your data is valid';
};

var emailInput = new Validator.init(document.getElementById('email'), {
  rules: {
    min: 5,
    max: 20,
    match: 'email'
  },
  onError: onError,
  onSuccess: onSuccess
});

Validator.fn.password = function() {
  return /^(?=.*\d)(?=.*[a-zA-Z]).*$/.test(this.value); 
};

var passwordInput = new Validator.init(document.getElementById('password'), {
  rules: {
    required: true,
    password: true,
    min: 8
  },
  messages: {
    password: 'Password should contain letters and numbers. %data% is invalid password'
  },
  onError: onError,
  onSuccess: onSuccess
});



var validateEmailBtn = document.getElementById('validate-email');
validateEmailBtn.addEventListener('click', function(e) {
  emailInput.validate();
}, false);

var validatePasswordBtn = document.getElementById('validate-password');
validatePasswordBtn.addEventListener('click', function(e) {
  passwordInput.validate();
}, false);
