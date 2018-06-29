'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEBOUNCE_INTERVAL = 5000;
  var lastTimeout;

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
      for (var i = 0; i < array.length; i++) {
        var swapIdx = Math.floor(Math.random() * array.length);
        var tmp = array[swapIdx];
        array[swapIdx] = array[i];
        array[i] = tmp;
      }
      return array;
    },

    fileChooser: function (file, upload) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (item) {
        return fileName.endsWith(item);
      });
      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          upload.src = reader.result;
        });
        reader.readAsDataURL(file);
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

    removeNodes: function (elem) {
      for (var i = 0; i < elem.length; i++) {
        elem[i].remove();
      }
    },

    debounce: function (action) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(action, DEBOUNCE_INTERVAL);
    }
  };

})();
