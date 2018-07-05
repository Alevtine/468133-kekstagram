'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEBOUNCE_INTERVAL = 500;


  window.utils = {

    isEscPress: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    isEnterPress: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },

    getRandomValue: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    shuffle: function (array) {
      array.sort(function () {
        return Math.floor(Math.random() - 0.5);
      });
      return array;
    },

    fileChooser: function (file, upload) {
      try {
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (item) {
          return fileName.endsWith(item);
        });
      } catch (err) {
        window.form.onError('Что-нибудь, а лучше изображение загрузить надо');
      }
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          upload.src = reader.result;
        });
        reader.readAsDataURL(file);
      } else {
        window.form.onError('Изображения загружайте');
        window.closeUploadBlock();
      }
    },

    slider: function (elem, tune) {
      var onMouseDown = function (evt) {
        var beginCoords = evt.clientX;

        var onMouseMove = function (evtMmove) {

          var shift = beginCoords - evtMmove.clientX;
          beginCoords = evtMmove.clientX;
          var endCoord = elem.offsetLeft - shift;

          tune(endCoord);
          evtMmove.preventDefault();
        };

        var onMouseUp = function () {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      };
      elem.addEventListener('mousedown', onMouseDown);
    },

    debounce: function (fun) {
      var lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    },

    removeNodes: function (elem) {
      elem.forEach(function (item) {
        item.remove();
      });
    },

    removeErrorBlock: function (elem) {
      if (document.contains(elem)) {
        elem.parentNode.removeChild(elem);
        document.body.style.overflow = '';
      }
      if (elem.lastChild) {
        elem.lastChild.remove();
      }
    }
  };

})();
