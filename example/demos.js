(function() {
	'use strict';
	var ids = {
		required: {
			input: 'required',
			btn: 'btn-required'
		},
		min: {
			input: 'min',
			btn: 'btn-min'
		},
		max: {
			input: 'max',
			btn: 'btn-max'
		},
		contain: {
			input: 'contain',
			btn: 'btn-contain'
		},
		match: {
			input: 'match',
			btn: 'btn-match'
		},
		allTogether: {
			input: 'allTogether',
			btn: 'btn-allTogether'
		}
	};

	var _get = function(obj) {
		return {
			input: document.getElementById(obj.input),
			btn: document.getElementById(obj.btn)
		};
	};

	// Required Input validation
	var required = _get(ids.required);
	required.btn.addEventListener('click', function() {
		validate(required.input)
			.required('Try to type something in here')
			.onSuccess(function() {
				this.success();
			}).onError(function() {
				this.showErrors();
				this.error();
			});
	});

	// Min Input validation
	var min = _get(ids.min);
	min.btn.addEventListener('click', function() {
		validate(min.input)
			.min(8, '%s characters required. Try typing "JavaScript"')
			.onSuccess(function() {
				this.success();
			}).onError(function() {
				this.showErrors();
				this.error();
			});
	});

	// Max Input validation
	var max = _get(ids.max);
	max.btn.addEventListener('click', function() {
		validate(max.input)
			.max(8, 'You should not type more than %s characters. Try typing "banana"')
			.onSuccess(function() {
				this.success();
			}).onError(function() {
				this.showErrors();
				this.error();
			});
	});

	// Contain Input validation
	var contain = _get(ids.contain);
	contain.btn.addEventListener('click', function() {
		validate(contain.input)
			.contain('.js', 'This input should contain %s substring. Try "ember.js"')
			.onSuccess(function() {
				this.success();
			}).onError(function() {
				this.showErrors();
				this.error();
			});
	});

	// Match Input validation
	var match = _get(ids.match);
	match.btn.addEventListener('click', function() {
		validate(match.input)
			.match('email', 'This input should contain %s. Try email@example.com')
			.onSuccess(function() {
				this.success();
			}).onError(function() {
				this.showErrors();
				this.error();
			});
	});

	// Match Input validation
	var allTogether = _get(ids.allTogether);
	allTogether.btn.addEventListener('click', function() {
		validate(allTogether.input)
			.min(8)
			.max(50)
			.match('email')
			.contain('gmail')
			.onSuccess(function() {
				this.success();
			}).onError(function() {
				this.showErrors();
				this.error();
			});
	});
})();