'use strict';

(function () {

  var HASHTAG_LENGTH = 20;
  var HASHTAGS_QTTY = 5;
  var ERRBLOCK_DELAY = 5000;

  var hashtagInput = document.querySelector('.text__hashtags');
  var uploadForm = document.querySelector('#upload-select-image');

  var errorBlockTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error');
  var errorBlock = errorBlockTemplate.cloneNode(true);

  var onHashtagInput = function (evt) {

    evt.target.setCustomValidity('');
    evt.preventDefault();
    hashtagInput.value = hashtagInput.value.trim();
    if (!hashtagInput.value) {
      hashtagInput.style.outline = '';
      return;
    }

    var hashtagsArray = evt.target.value.split(' ');

    if (hashtagsArray.length > HASHTAGS_QTTY) {
      evt.target.setCustomValidity('нельзя указать больше пяти хэш-тегов');
    } else if (hashtagsArray.length !== (hashtagInput.value.match(/#/g) || []).length) {
      evt.target.setCustomValidity('хэш-теги пробелами разделяйте');
    } else {

      hashtagsArray.forEach(function (item, i) {

        for (var j = i + 1; j < hashtagsArray.length; j++) {
          var flag;
          if (item.toLowerCase() === hashtagsArray[j].toLowerCase()) {
            flag = true;
            break;
          } else {
            flag = false;
          }
        }

        if (flag) {
          evt.target.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
        } else {
          switch (true) {
            case item[0] !== '#':
              evt.target.setCustomValidity('хеш-тег начинается с символа # (решётка)');
              break;
            case item.length > HASHTAG_LENGTH:
              evt.target.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
              break;
            case item === '#':
              evt.target.setCustomValidity('хеш-тег не может состоять только из одной решётки');
              break;
          }
        }
      });
    }

    if (hashtagInput.validity.valid) {
      hashtagInput.style.outline = '';
    } else {
      hashtagInput.style.outline = '3px dashed red';
    }
  };

  hashtagInput.addEventListener('change', onHashtagInput);

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.postData(
        new FormData(uploadForm),
        function () {
          window.form.onSuccess();
        },
        function (errorMessage) {
          window.form.onError(errorMessage);
        });
  });

  window.form = {
    onSuccess: function () {
      window.uploadEffects.onClose();
      uploadForm.reset();
    },

    onError: function (errorMessage) {
      document.body.appendChild(errorBlock);
      errorBlock.classList.remove('hidden');
      errorBlock.insertAdjacentHTML('beforeend', '<br>' + errorMessage);
      errorBlock.style.zIndex = '10';
      document.body.style.overflow = 'hidden';
      errorBlock.addEventListener('click', function () {
        window.utils.removeErrorBlock(errorBlock);
      });
      setTimeout(function () {
        window.utils.removeErrorBlock(errorBlock);
      },
      ERRBLOCK_DELAY);
    }
  };

})();
