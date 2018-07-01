'use strict';

(function () {

  var SHOWED_COMMENTS = 5;

  var AVATARS_QTTY = [1, 6];

  var DESCRIPTIONS_LIST = ['Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'];


  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var errorBlock = document.querySelector('#picture').content.querySelector('.img-upload__message--error').cloneNode(false);
  var picturesBlock = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.img-filters');

  var commentsBlock = document.querySelector('.social__comments');
  var totalCommentsQtty = document.querySelector('.comments-count');
  var commentsCountBlock = document.querySelector('.social__comment-count');
  var currentCommentsQtty = commentsCountBlock.childNodes[0];
  var moreCommentsButton = document.querySelector('.social__loadmore');

  var newButton = document.querySelector('#filter-new');
  var popularButton = document.querySelector('#filter-popular');
  var discussedButton = document.querySelector('#filter-discussed');
  var filters = document.querySelector('.img-filters__form');
  var filterButtons = filters.querySelectorAll('button');

  var bigPictureOverlay = document.querySelector('.big-picture');
  var bigPictureCancel = document.querySelector('#picture-cancel');

  var picturesData = [];

  var onSuccessLoad = function (data) {
    picturesData = data;
    generatePictures(picturesData);
    filtersBlock.classList.remove('img-filters--inactive');
  };

  var onErrorLoad = function (errorMessage) {
    document.body.appendChild(errorBlock);
    errorBlock.classList.remove('hidden');
    errorBlock.insertAdjacentHTML('beforeend', '<br>' + errorMessage);
    errorBlock.style.zIndex = '10';
    document.body.style.overflow = 'hidden';
    errorBlock.addEventListener('click', function () {
      window.utils.removeErrorBlock(errorBlock);
    });
    setTimeout(window.utils.removeErrorBlock, 5000);
  };

  var removeOldComments = function () {
    var commentsLi = commentsBlock.querySelectorAll('li');
    window.utils.removeNodes(commentsLi);
  };

  var insertCommentNode = function (x) {
    commentsBlock.insertAdjacentHTML('afterbegin',
        '<li class="social__comment social__comment--text"><img class="social__picture" src="img/avatar-' +
       window.utils.getRandomValue(AVATARS_QTTY[0], AVATARS_QTTY[1]) +
      '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' +
      x + '</li>');
  };

  var generatePictures = function (anyArray) {

    var addClickListener = function (item, pic) {
      pic.addEventListener('click', function (evt) {
        evt.preventDefault();
        generateBigPicture(item);
        bigPictureOverlay.classList.remove('hidden');
      });
    };

    anyArray.forEach(function (item) {
      var pictureElement = pictureTemplate.cloneNode(true);
      pictureElement.querySelector('img').src = item.url;
      pictureElement.querySelector('.picture__stat--likes').textContent = item.likes;
      pictureElement.querySelector('.picture__stat--comments').textContent = item.comments.length;
      picturesBlock.appendChild(pictureElement);
      addClickListener(item, pictureElement);
    });

    return anyArray;
  };


  var onButtonUpdatePictures = function (evt) {
    var picsInBlock = picturesBlock.querySelectorAll('.picture__link');
    window.utils.removeNodes(picsInBlock);

    if (evt.target.className === 'img-filters__button') {
      evt.target.classList.toggle('img-filters__button--active', true);
      for (var i = 0; i < filterButtons.length; i++) {
        if (evt.target !== filterButtons[i]) {
          filterButtons[i].classList.remove('img-filters__button--active');
        }
      }
    }

    switch (evt.target) {
      case newButton:
        var newPictures = picturesData.slice();
        newPictures = window.utils.shuffle(newPictures).splice(0, 10);
        generatePictures(newPictures);
        break;
      case popularButton:
        generatePictures(picturesData);
        break;
      case discussedButton:
        var discussedPictures = picturesData.slice();
        discussedPictures.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        generatePictures(discussedPictures);
        break;
    }
  };


  var addComments = function (picture) {
    window.commentsData = [];
    picture.comments.forEach(function (item) {
      window.commentsData.push(item);
    });

    if (window.commentsData.length > SHOWED_COMMENTS) {
      var comments = window.commentsData.splice(0, SHOWED_COMMENTS);
      currentCommentsQtty.textContent = SHOWED_COMMENTS + ' из ';
      moreCommentsButton.classList.toggle('visually-hidden', false);
    } else {
      comments = window.commentsData;
      currentCommentsQtty.textContent = picture.comments.length + ' из ';
      moreCommentsButton.classList.toggle('visually-hidden', true);
    }

    return comments;
  };


  var onLoadMoreComments = function (evt) {
    evt.preventDefault();

    if (window.commentsData.length) {
      var commentsPlus = window.commentsData.splice(0, SHOWED_COMMENTS);
      commentsPlus.forEach(function (item) {
        insertCommentNode(item);
      });
    }

    if (window.commentsData.length === 0) {
      moreCommentsButton.classList.add('visually-hidden');
    }

    currentCommentsQtty.textContent = commentsBlock.children.length + ' из ';
    return commentsPlus;
  };


  var generateBigPicture = function (picture) {
    document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    document.querySelector('.likes-count').textContent = picture.likes;
    document.querySelector('.social__caption').textContent = DESCRIPTIONS_LIST[window.utils.getRandomValue(0, DESCRIPTIONS_LIST.length - 1)];
    totalCommentsQtty.textContent = picture.comments.length;

    removeOldComments();
    var comments = addComments(picture);
    comments.forEach(function (it) {
      insertCommentNode(it);
    });

    document.body.classList.add('modal-open');
  };


  var hideBigPicture = function () {
    document.body.classList.remove('modal-open');
    bigPictureOverlay.classList.add('hidden');
    document.removeEventListener('keydown', function (evt) {
      window.utils.isEscPress(evt, hideBigPicture);
    });
  };


  filters.addEventListener('click', window.utils.debounce(onButtonUpdatePictures));
  moreCommentsButton.addEventListener('click', onLoadMoreComments);
  bigPictureCancel.addEventListener('click', hideBigPicture);
  document.addEventListener('keydown', function (evt) {
    window.utils.isEscPress(evt, hideBigPicture);
  });

  window.backend.getData(onSuccessLoad, onErrorLoad);

})();
