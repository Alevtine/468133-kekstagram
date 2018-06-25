'use strict';

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];


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
    }
  };

})();
