'use strict';

(function () {

  var SCALE_LIMITS = {
    min: 0,
    max: 453
  };

  var EFFECTS_RANGE = {
    min: 1,
    max: 3
  };

  var PERCENT_AMOUNT = 100;

  var picPreview = document.querySelector('.img-upload__preview');
  var effectsList = document.querySelector('.effects__list');
  var pin = document.querySelector('.scale__pin ');

  var scaleLine = document.querySelector('.img-upload__scale');
  var scaleInput = document.querySelector('.scale__value');
  var scaleLevel = document.querySelector('.scale__level');

  var uploadWrapper = document.querySelector('.img-upload__wrapper');
  var uploadInput = document.querySelector('#upload-file');
  var uploadBlock = document.querySelector('.img-upload__overlay');
  var cancelUploadBlock = document.querySelector('#upload-cancel');

  var openUploadBlock = function () {
    uploadBlock.classList.remove('hidden');
    scaleLine.classList.add('hidden');
    scaleInput.setAttribute('value', '');
    uploadWrapper.setAttribute('onselectstart', 'return false');
  };

  var closeUploadBlock = function () {
    uploadBlock.classList.add('hidden');
    picPreview.style.filter = '';
    picPreview.className = 'img-upload__preview';
  // uploadForm.reset()
  // uploadInput.value = '';
  };

  var onInputEffectChange = function (evt) {
    picPreview.className = 'img-upload__preview';
    if (evt.target.value === 'none') {
      scaleLine.classList.add('hidden');
    } else {
      picPreview.classList.toggle('effects__preview--' + evt.target.value);
      scaleLine.classList.remove('hidden');
    }
    picPreview.style.filter = '';
    scaleLevel.style.width = PERCENT_AMOUNT + '%';
    pin.style.left = SCALE_LIMITS.max + 'px';
    scaleInput.setAttribute('value', '100');
  };


  var onPinMousedown = function (evt) {

    window.pinBeginCoords = {
      x: evt.clientX
    };

    document.addEventListener('mousemove', onPinMousemove);
    document.addEventListener('mouseup', onPinMouseup);
  };

  var onPinMousemove = function (evt) {

    var shift = {
      x: window.pinBeginCoords.x - evt.clientX
    };

    window.pinBeginCoords = {
      x: evt.clientX
    };

    var pinEndCoord = {
      x: pin.offsetLeft - shift.x
    };

    if (pinEndCoord.x < SCALE_LIMITS.min) {
      pinEndCoord.x = SCALE_LIMITS.min;
    }

    if (pinEndCoord.x > SCALE_LIMITS.max) {
      pinEndCoord.x = SCALE_LIMITS.max;
    }

    pin.style.left = pinEndCoord.x + 'px';

    var slipStep = pinEndCoord.x / SCALE_LIMITS.max;
    var saturationLevel = Math.floor(PERCENT_AMOUNT * slipStep);
    var maxSlipValue = EFFECTS_RANGE.max * slipStep;

    picPreview.classList.forEach(function (item) {
      switch (item) {
        case 'effects__preview--chrome':
          picPreview.style.filter = 'grayscale' + '(' + slipStep + ')';
          break;
        case 'effects__preview--sepia':
          picPreview.style.filter = 'sepia' + '(' + slipStep + ')';
          break;
        case 'effects__preview--marvin':
          picPreview.style.filter = 'invert' + '(' + saturationLevel + '%' + ')';
          break;
        case 'effects__preview--phobos':
          picPreview.style.filter = 'blur' + '(' + maxSlipValue + 'px' + ')';
          break;
        case 'effects__preview--heat':
          if (maxSlipValue > EFFECTS_RANGE.min) {
            picPreview.style.filter = 'brightness' + '(' + maxSlipValue + ')';
          }
          break;
      }
    });

    scaleLevel.style.width = saturationLevel + '%';
    scaleInput.setAttribute('value', saturationLevel);
  };

  var onPinMouseup = function () {
    document.removeEventListener('mousemove', onPinMousemove);
    document.removeEventListener('mouseup', onPinMouseup);
  };

  pin.addEventListener('mousedown', onPinMousedown);

  effectsList.addEventListener('change', onInputEffectChange);

  uploadInput.addEventListener('change', function () {
    openUploadBlock();
    window.utils.fileChooser(uploadInput.files[0], picPreview.querySelector('img'));
  });

  cancelUploadBlock.addEventListener('click', closeUploadBlock);

  document.addEventListener('keydown', function (evt) {
    if (document.querySelector('.text__hashtags') !== document.activeElement && document.querySelector('.text__description') !== document.activeElement) {
      window.utils.isEscPress(evt, closeUploadBlock);
    }
  });

})();
