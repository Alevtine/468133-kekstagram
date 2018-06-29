'use strict';

(function () {

  var SHOWED_COMMENTS = 5;

  var AVATARS_QTTY = 6;

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
  var currentCommentsQtty = document.querySelector('.comments-count').firstChild;
  var totalCommentsQtty = document.querySelector('.comments-count');
  var commentsCountBlock = document.querySelector('.social__comment-count');
  commentsCountBlock.insertBefore(currentCommentsQtty, totalCommentsQtty);
  var moreCommentsButton = document.querySelector('.social__loadmore');

  var newButton = document.querySelector('#filter-new');
  var popularButton = document.querySelector('#filter-popular');
  var discussedButton = document.querySelector('#filter-discussed');
  var filters = document.querySelector('.img-filters__form');
  var filterButtons = filters.querySelectorAll('button');

  var bigPictureOverlay = document.querySelector('.big-picture');
  var bigPictureCancel = document.querySelector('#picture-cancel');


  var removeOldComments = function () {
    var commentsLi = commentsBlock.querySelectorAll('li');
    window.utils.removeNodes(commentsLi);
  };

  var insertCommentNode = function (x) {
    commentsBlock.insertAdjacentHTML('afterbegin',
        '<li class="social__comment social__comment--text"><img class="social__picture" src="img/avatar-' +
       window.utils.getRandomValue(1, AVATARS_QTTY) +
      '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' +
      x + '</li>');
  };

  var clearOldCounts = function () {
    var nodes = commentsCountBlock.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = '';
    }
  };

  var picturesArrFromBack = [];

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


  var onSuccessLoad = function (data) {
    picturesArrFromBack = data;
    generatePictures(picturesArrFromBack);
    filtersBlock.classList.remove('img-filters--inactive');
  };

  var updatePictures = function (evt) {
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
        var picturesArrNew = picturesArrFromBack.slice();
        picturesArrNew = window.utils.shuffle(picturesArrNew).splice(0, 10);
        generatePictures(picturesArrNew);
        break;
      case popularButton:
        generatePictures(picturesArrFromBack);
        break;
      case discussedButton:
        var picturesArrDiscussed = picturesArrFromBack.slice();
        picturesArrDiscussed.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        generatePictures(picturesArrDiscussed);
        break;
    }
  };

  var addComments = function (picture) {
    window.array = [];
    picture.comments.forEach(function (item) {
      window.array.push(item);
    });

    if (window.array.length > SHOWED_COMMENTS) {
      var arrComments = window.array.splice(0, SHOWED_COMMENTS);
      currentCommentsQtty.textContent = SHOWED_COMMENTS + ' из ';
      moreCommentsButton.classList.toggle('visually-hidden', false);
    } else {
      arrComments = window.array;
      currentCommentsQtty.textContent = picture.comments.length + ' из ';
      moreCommentsButton.classList.toggle('visually-hidden', true);
    }

    return arrComments;
  };

  var onClickShowMoreComments = function (evt) {
    evt.preventDefault();

    if (window.array.length) {
      var arrCommentsPlus = window.array.splice(0, SHOWED_COMMENTS);
      arrCommentsPlus.forEach(function (item) {
        insertCommentNode(item);
      });
    }

    if (window.array.length === 0) {
      moreCommentsButton.classList.add('visually-hidden');
    }

    currentCommentsQtty.textContent = commentsBlock.children.length + ' из ';
    return arrCommentsPlus;
  };


  var generateBigPicture = function (picture) {
    clearOldCounts();

    document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    document.querySelector('.likes-count').textContent = picture.likes;
    document.querySelector('.social__caption').textContent = DESCRIPTIONS_LIST[window.utils.getRandomValue(0, DESCRIPTIONS_LIST.length - 1)];
    totalCommentsQtty.textContent = picture.comments.length + ' комментариев';

    removeOldComments();

    var arrComments = addComments(picture);

    arrComments.forEach(function (it) {
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


  filters.addEventListener('click', updatePictures);
  moreCommentsButton.addEventListener('click', onClickShowMoreComments);
  bigPictureCancel.addEventListener('click', hideBigPicture);
  document.addEventListener('keydown', function (evt) {
    window.utils.isEscPress(evt, hideBigPicture);
  });


  window.backend.getData(onSuccessLoad, function () {});

})();
