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


  // // // ф
  var newButton = document.querySelector('#filter-new');
  var popularButton = document.querySelector('#filter-popular');


  var picturesArrFromBack = [];

  var generatePictures = function (anyArray) {

    var addClickListener = function (item, pic) {
      pic.addEventListener('click', function (evt) {
        evt.preventDefault();
        generateBigPicture(item);
        window.utils.switchClass(bigPictureOverlay, 'remove', 'hidden');
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
  };

  var updatePictures = function (evt) {
    var picsInBlock = picturesBlock.querySelectorAll('.picture__link');
    window.utils.removeNodes(picsInBlock);

    switch (evt.target) {
      case newButton:
        var picturesArrNew = picturesArrFromBack.slice();
        picturesArrNew = window.utils.shuffle(picturesArrNew).splice(0, 10);
        generatePictures(picturesArrNew);
        break;
      case popularButton:
        generatePictures(picturesArrFromBack);
        break;
    }
  };


  newButton.addEventListener('click', updatePictures);
  popularButton.addEventListener('click', updatePictures);


  // // // поч

  var addComments = function (picture) {
    window.array = [];
    for (var i = 0; i < picture.comments.length; i++) {
      window.array.push(picture.comments[i]);
    }

    if (window.array.length > SHOWED_COMMENTS) {
      var arrComments = window.array.splice(0, SHOWED_COMMENTS);
      currentCommentsQtty.textContent = SHOWED_COMMENTS + ' из ';
      window.utils.switchClass(moreCommentsButton, 'remove', 'visually-hidden');
    } else {
      arrComments = window.array;
      currentCommentsQtty.textContent = picture.comments.length + ' из ';
      window.utils.switchClass(moreCommentsButton, 'add', 'visually-hidden');
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
      window.utils.switchClass(moreCommentsButton, 'add', 'visually-hidden');
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

    window.utils.switchClass(document.body, 'add', 'modal-open');
  };


  var hideBigPicture = function () {
    window.utils.switchClass(document.body, 'remove', 'modal-open');
    window.utils.switchClass(bigPictureOverlay, 'add', 'hidden');
    document.removeEventListener('keydown', function (evt) {
      window.utils.isEscPress(evt, hideBigPicture);
    });
  };


  moreCommentsButton.addEventListener('click', onClickShowMoreComments);
  bigPictureCancel.addEventListener('click', hideBigPicture);
  document.addEventListener('keydown', function (evt) {
    window.utils.isEscPress(evt, hideBigPicture);
  });

  window.utils.switchClass(filtersBlock, 'remove', 'img-filters--inactive');
  window.backend.getData(onSuccessLoad, function () {});

})();
