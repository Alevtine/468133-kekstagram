'use strict';

(function () {

  var SHOWED_COMMENTS = 5;

  var DESCRIPTIONS_LIST = ['Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'];


  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var picturesBlock = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.img-filters');
  var commentsBlock = document.querySelector('.social__comments');
  var moreCommentsButton = document.querySelector('.social__loadmore');
  var bigPictureCancel = document.querySelector('#picture-cancel');

  var removeOldComments = function () {
    var commentsLi = commentsBlock.querySelectorAll('li');
    for (var i = 0; i < commentsLi.length; i++) {
      commentsLi[i].remove();
    }
  };

  var insertCommentNode = function (x) {
    commentsBlock.insertAdjacentHTML('afterbegin',
        '<li class="social__comment social__comment--text"><img class="social__picture" src="img/avatar-' +
       window.utils.getRandomValue(1, 6) +
      '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' +
      x + '</li>');
  };

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

    filtersBlock.classList.remove('img-filters--inactive');
    return picturesArr;
  };

  var generateBigPicture = function (picture) {
    document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    document.querySelector('.likes-count').textContent = picture.likes;
    document.querySelector('.comments-count').textContent = picture.comments.length;
    document.querySelector('.social__caption').textContent = DESCRIPTIONS_LIST[window.utils.getRandomValue(0, DESCRIPTIONS_LIST.length - 1)];
    removeOldComments();

    var addComments = function () {
      var array = [];

      for (var i = 0; i < picture.comments.length; i++) {
        array.push(picture.comments[i]);
      }

      if (array.length > SHOWED_COMMENTS) {
        moreCommentsButton.classList.remove('visually-hidden');
        var arrComments = array.splice(0, SHOWED_COMMENTS);
      } else {
        arrComments = array;
        moreCommentsButton.classList.add('visually-hidden');
      }

      moreCommentsButton.addEventListener('click', function () {
        if (array.length) {
          var arrCommentsPlus = array.splice(0, SHOWED_COMMENTS);
          arrCommentsPlus.forEach(function (item) {
            insertCommentNode(item);
          });
          if (commentsBlock.children.length === picture.comments.length) {
            moreCommentsButton.classList.add('visually-hidden');
          }
        }
      });

      return arrComments;
    };

    var arrComments = addComments();

    arrComments.forEach(function (item) {
      insertCommentNode(item);
    });

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

  generatePictures();

})();
