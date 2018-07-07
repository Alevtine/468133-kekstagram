'use strict';

(function () {

  var SHOWED_COMMENTS = 5;
  var AVATARS_QTTY = [1, 6];
  var NEW_PICS_QTTY = 10;
  var ERRORBLOCK_DELAY = 5000;

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
    errorBlock.insertAdjacentHTML('beforeend', '<div class="errorMessage">' + '<br>' + errorMessage + '</div>');
    errorBlock.style.zIndex = '10';
    document.body.style.overflow = 'hidden';
    errorBlock.addEventListener('click', function () {
      window.utils.removeErrorBlock(errorBlock);
    });
    setTimeout(function () {
      window.utils.removeErrorBlock(errorBlock);
    },
    ERRORBLOCK_DELAY);
  };

  var removeOldComments = function () {
    var commentsLi = commentsBlock.querySelectorAll('li');
    window.utils.removeNodes(commentsLi);
  };

  var insertCommentNode = function (commentsArray) {
    var commentFragment = document.createDocumentFragment();

    commentsArray.reverse();

    commentsArray.forEach(function (it) {
      var commentElement = document.createElement('li');
      commentElement.classList.add('social__comment', 'social__comment--text');
      commentElement.insertAdjacentHTML('afterbegin', '<img class="social__picture" src="img/avatar-' +
     window.utils.getRandomValue(AVATARS_QTTY[0], AVATARS_QTTY[1]) +
    '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' +
    it);
      commentFragment.appendChild(commentElement);
    });

    commentsBlock.insertBefore(commentFragment, commentsBlock.firstChild);
  };

  var generatePictures = function (anyArray) {
    var pictureFragment = document.createDocumentFragment();

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
      addClickListener(item, pictureElement);
      pictureFragment.appendChild(pictureElement);
    });

    picturesBlock.appendChild(pictureFragment);

    return anyArray;
  };


  var onButtonUpdatePictures = function (evt) {
    var picsInBlock = picturesBlock.querySelectorAll('.picture__link');
    window.utils.removeNodes(picsInBlock);

    if (evt.target.className === 'img-filters__button') {
      evt.target.classList.toggle('img-filters__button--active', true);
      filterButtons.forEach(function (item) {
        if (evt.target !== item) {
          item.classList.remove('img-filters__button--active');
        }
      });
    }

    switch (evt.target) {
      case newButton:
        var newPictures = picturesData.slice();
        newPictures = window.utils.shuffle(newPictures).splice(0, NEW_PICS_QTTY);
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
      insertCommentNode(commentsPlus);
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
    insertCommentNode(comments);

    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onEscHideBigPicture);
  };

  var hideBigPicture = function () {
    document.body.classList.remove('modal-open');
    bigPictureOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscHideBigPicture);
  };

  var onEscHideBigPicture = function (evt) {
    window.utils.isEscPress(evt, hideBigPicture);
  };


  filters.addEventListener('click', window.utils.debounce(onButtonUpdatePictures));
  moreCommentsButton.addEventListener('click', onLoadMoreComments);
  bigPictureCancel.addEventListener('click', hideBigPicture);

  window.backend.getData(onSuccessLoad, onErrorLoad);

})();
