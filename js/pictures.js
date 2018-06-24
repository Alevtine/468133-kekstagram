'use strict';

(function () {
  var URL_LIMITS = {
    min: 1,
    max: 25
  };

  var DESCRIPTIONS_LIST = ['Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'];


  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var picturesBlock = document.querySelector('.pictures');
  var commentsBlock = document.querySelector('.social__comments');
  var bigPictureCancel = document.querySelector('#picture-cancel');
  var showMoreComments = document.querySelector('.social__loadmore');


  var urlNumbersArray = [];
  for (var j = URL_LIMITS.min; j <= URL_LIMITS.max; j++) {
    urlNumbersArray.push(j);
  }

  var generatePictures = function () {
    var picturesArr = [];

    window.backend.getData(function (data) {
      data.forEach(function (item) {
        picturesArr.push(item);
      });

      var addClickListener = function (item, pic) {
        pic.addEventListener('click', function (evt) {
          evt.preventDefault();
          generateBigPicture(item);
          document.querySelector('.big-picture').classList.remove('hidden');
        });
      };

      picturesArr.forEach(function (item) {
        var pictureElement = pictureTemplate.cloneNode(true);
        pictureElement.querySelector('img').src = item.url;
        pictureElement.querySelector('.picture__stat--likes').textContent = item.likes;
        pictureElement.querySelector('.picture__stat--comments').textContent = item.comments.length;
        picturesBlock.appendChild(pictureElement);
        addClickListener(item, pictureElement);
      });

    }, function () {});

    return picturesArr;
  };

  var pictures = generatePictures();


  var generateBigPicture = function (picture) {
    document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    document.querySelector('.likes-count').textContent = picture.likes;
    document.querySelector('.comments-count').textContent = picture.comments.length;
    document.querySelector('.social__caption').textContent = DESCRIPTIONS_LIST[window.utils.getRandomValue(0, DESCRIPTIONS_LIST.length - 1)];

    var commentsLi = commentsBlock.querySelectorAll('li');
    for (var i = 0; i < commentsLi.length; i++) {
      commentsLi[i].remove();
    }

    var addComments = function () {
      var array = [];

      for (i = 0; i < picture.comments.length; i++) {
        array.push(picture.comments[i]);
      }

      if (array.length > 5) {
        var arrComments = array.slice(0, 5);
      } else {
        arrComments = array;
      }
      return arrComments;
    };

    var arrComments = addComments();

    arrComments.forEach(function (item) {
      commentsBlock.insertAdjacentHTML('afterbegin',
          '<li class="social__comment social__comment--text"><img class="social__picture" src="img/avatar-' + window.utils.getRandomValue(1, 6) +
          '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' +
          item + '</li>');
    });

    if (commentsBlock.length === picture.comments.length) {
      showMoreComments.classList.add('visually-hidden');
    }
    showMoreComments.classList.remove('visually-hidden');

    document.querySelector('body').classList.add('modal-open');
  };


  var hideBigPicture = function () {
    document.querySelector('body').classList.remove('modal-open');
    document.querySelector('.big-picture').classList.add('hidden');
    document.removeEventListener('keydown', function (evt) {
      window.utils.isEscPress(evt, hideBigPicture);
    });
  };

  bigPictureCancel.addEventListener('click', hideBigPicture);

  document.addEventListener('keydown', function (evt) {
    window.utils.isEscPress(evt, hideBigPicture);
  });
})();
