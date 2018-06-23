'use strict';

(function () {

  var hashtagInput = document.querySelector('.text__hashtags');
  var uploadForm = document.querySelector('#upload-select-image');
  var errorMessage = document.querySelector('.img-upload__message--error');


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
        evt.target.setCustomValidity('хеш-тег начинается с символа # (решётка)');
      } else if (hashtagsArray[i].length > 20) {
        evt.target.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
      } else if (hashtagsArray[i] === '#' || hashtagsArray[0] === '#') {
        evt.target.setCustomValidity('хеш-тег не может состоять только из одной решётки');
      } else if (hashtagsArray.length > 5) {
        evt.target.setCustomValidity('нельзя указать больше пяти хэш-тегов');
      } else if (hashtagInput.value.match(/#/g).length > 1 && hashtagsArray.length !== hashtagInput.value.match(/#/g).length) {
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

  window.onSuccess = function () {
    window.uploadEffects.onClose();
    uploadForm.reset();
  };

  window.onError = function () {
    errorMessage.classList.remove('hidden');
    document.querySelector('body').appendChild(errorMessage);
  };


  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.postData(
        new FormData(uploadForm),
        function () {
          window.onSuccess();
        },
        function () {
          window.onError();
        });
  });

})();
