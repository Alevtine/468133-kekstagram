'use strict';

(function () {

  var hashtagInput = document.querySelector('.text__hashtags');
  var uploadForm = document.querySelector('#upload-select-image');

  var errorMessageTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error');
  var errorMessage = errorMessageTemplate.cloneNode(true);
  document.body.appendChild(errorMessage);

  var onHashtagInput = function (evt) {
    evt.target.setCustomValidity('');
    evt.preventDefault();
    if (!hashtagInput.value) {
      hashtagInput.style.outline = '';
      return;
    }
    var hashtagsArray = evt.target.value.split(' ');

    if (hashtagsArray.length > 5) {
      evt.target.setCustomValidity('нельзя указать больше пяти хэш-тегов');
    } else if (hashtagsArray.length !== (hashtagInput.value.match(/#/g) || []).length) {
      evt.target.setCustomValidity('хэш-теги пробелами разделяйте');
    } else {
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
        } else {
          switch (true) {
            case hashtagsArray[i][0] !== '#':
              evt.target.setCustomValidity('хеш-тег начинается с символа # (решётка)');
              break;
            case hashtagsArray[i].length > 20:
              evt.target.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
              break;
            case hashtagsArray[i] === '#':
              evt.target.setCustomValidity('хеш-тег не может состоять только из одной решётки');
              break;
          }
        }
      }
    }


    if (hashtagInput.validity.valid) {
      hashtagInput.style.outline = '';
    } else {
      hashtagInput.style.outline = '3px dashed red';
    }
  };

  hashtagInput.addEventListener('change', onHashtagInput);

  window.onSuccess = function () {
    window.uploadEffects.onClose();
    uploadForm.reset();
  };

  window.onError = function () {
    errorMessage.classList.remove('hidden');
    errorMessage.style.display = 'block';
    errorMessage.style.zIndex = '10';
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
