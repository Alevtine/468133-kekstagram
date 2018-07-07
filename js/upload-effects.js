'use strict';

(function () {

  var ScaleLimit = {
    MIN: 0,
    MAX: 453
  };

  var EffectRange = {
    MIN: 1,
    MAX: 3
  };

  var SizeRange = {
    MIN: 25,
    MAX: 100
  };

  var RESIZE_STEP = 25;
  var PERCENT_AMOUNT = 100;


  var picPreview = document.querySelector('.img-upload__preview');
  var imgPicPreview = picPreview.querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var pin = document.querySelector('.scale__pin ');

  var scaleLine = document.querySelector('.img-upload__scale');
  var scaleInput = document.querySelector('.scale__value');
  var scaleLevel = document.querySelector('.scale__level');

  var uploadInput = document.querySelector('#upload-file');
  var uploadBlock = document.querySelector('.img-upload__overlay');
  var uploadHashtagsText = uploadBlock.querySelector('.text__hashtags');
  var uploadTextarea = document.querySelector('.text__description');
  var cancelUploadBlock = document.querySelector('#upload-cancel');

  var resizeMinusButton = document.querySelector('.resize__control--minus');
  var resizePlusButton = document.querySelector('.resize__control--plus');
  var resizeInput = document.querySelector('.resize__control--value');
  var resizeValue = SizeRange.MAX;


  var openUploadBlock = function () {
    window.uploadEffects.onOpen();
    document.addEventListener('keydown', onEscCloseUpload);
  };

  window.closeUploadBlock = function () {
    window.uploadEffects.onClose();
    document.removeEventListener('keydown', onEscCloseUpload);
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
    pin.style.left = ScaleLimit.MAX + 'px';
    scaleInput.setAttribute('value', '100');
  };


  var changeSaturation = function (endCoord) {

    if (endCoord < ScaleLimit.MIN) {
      endCoord = ScaleLimit.MIN;
    }
    if (endCoord > ScaleLimit.MAX) {
      endCoord = ScaleLimit.MAX;
    }

    pin.style.left = endCoord + 'px';

    var slipStep = endCoord / ScaleLimit.MAX;
    var saturationLevel = Math.floor(PERCENT_AMOUNT * slipStep);
    var maxSlipValue = EffectRange.MAX * slipStep;

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
          if (maxSlipValue > EffectRange.MIN) {
            picPreview.style.filter = 'brightness' + '(' + maxSlipValue + ')';
          }
          break;
      }
    });

    scaleLevel.style.width = saturationLevel + '%';
    scaleInput.setAttribute('value', saturationLevel);
  };


  var onResize = function (evt) {
    switch (evt.target) {
      case resizeMinusButton:
        if (resizeValue > SizeRange.MIN) {
          resizeValue -= RESIZE_STEP;
        }
        break;
      case resizePlusButton:
        if (resizeValue < SizeRange.MAX) {
          resizeValue += RESIZE_STEP;
        }
        break;
    }
    picPreview.style.transform = 'scale' + '(' + resizeValue / PERCENT_AMOUNT + ')';
    resizeInput.value = resizeValue + '%';
  };


  var onEscCloseUpload = function (evt) {
    if (uploadHashtagsText !== document.activeElement && uploadTextarea !== document.activeElement) {
      window.utils.isEscPress(evt, window.closeUploadBlock);
    }
  };

  window.uploadEffects = {
    onClose: function () {
      uploadBlock.classList.add('hidden');
      imgPicPreview.src = '';
      picPreview.style.filter = '';
      uploadHashtagsText.style.outline = '';
    },

    onOpen: function () {
      uploadBlock.classList.remove('hidden');
      scaleLine.classList.add('hidden');
      scaleInput.setAttribute('value', '');
      picPreview.style.transform = 'scale(1)';
      picPreview.className = 'img-upload__preview';
    }
  };

  window.utils.slider(pin, changeSaturation);

  effectsList.addEventListener('change', onInputEffectChange);
  resizeMinusButton.addEventListener('click', onResize);
  resizePlusButton.addEventListener('click', onResize);
  cancelUploadBlock.addEventListener('click', window.closeUploadBlock);

  uploadInput.addEventListener('change', function () {
    openUploadBlock();
    window.utils.fileChooser(uploadInput.files[0], imgPicPreview);
  });

})();
