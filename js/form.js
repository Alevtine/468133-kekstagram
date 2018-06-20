'use strict';

(function () {

  var hashtagInput = document.querySelector('.text__hashtags'); // uploadForm.elements.hashtags

  var onHashtagInput = function (evt) {
    evt.preventDefault();
    var hashtagsArray = evt.target.value.split(' ');

    for (var i = 0; i < hashtagsArray.length; i++) {

      for (var j = i + 1; j < hashtagsArray.length; j++) {
        var flag;
        if (hashtagsArray[i].toLowerCase() === hashtagsArray[j].toLowerCase()) {
          flag = true;
        } else {
          flag = false;
        }
      }

      if (flag) {
        evt.target.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
      } else if (hashtagsArray[i][0] !== '#') {
        evt.target.setCustomValidity('хэш-тег начинается с символа # (решётка)');
      } else if (hashtagsArray[i].length > 20) {
        evt.target.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
      } else if (hashtagsArray[i] === '#') {
        evt.target.setCustomValidity('хеш-тег не может состоять только из одной решётки');
      } else if (hashtagsArray.length > 5) {
        evt.target.setCustomValidity('нельзя указать больше пяти хэш-тегов');
      } else if (hashtagInput.value.match(/#/g).length > 1 && hashtagInput.value.split(' ').length - 1 !== hashtagInput.value.match(/#/g).length - 1) {
        evt.target.setCustomValidity('хэш-теги пробелами разделяйте');
      } else {
        evt.target.setCustomValidity('');
      }
    }

    if (!hashtagInput.validity.valid) {
      hashtagInput.style.outline = '3px dashed red';
    } else {
      hashtagInput.style.outline = '';
    }
  };


  hashtagInput.addEventListener('change', onHashtagInput);

})();
