
hljs.initHighlightingOnLoad();

var btn = document.getElementById('validate');

btn.addEventListener('click', function (e) {
	e.preventDefault();
	// var a = validate(input).min(8).max(12).required('required Message').match('emai').contain(['a', 'b']).showErrors().onError();
	var a = validate('#email')
		.min(8)
		.max(120).required()
		.match('email').contain(['a', 'b'])
		.onError()
		.onSuccess();
	// console.log(a.errors, a.isValid());
})
// console.log(btn);
// console.log(a.errors);

// Самый быстрый способ клонировать объект - пропустить его через
// функции JSON.parse() и JSON.stringify() - таким образом будут
// клонированы все свойства объекта на любой глубине вложенности
var clonedObject = (JSON.parse(JSON.stringify(originalObject)));