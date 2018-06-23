'use strict';

(function () {
  var URL_LIMITS = {
    min: 1,
    max: 25
  };

  var LIKES_LIMITS = {
    min: 15,
    max: 200
  };

  var POSTED_COMMENTS_LIMIT = 2;

  var COMMENTS_LIST = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  var DESCRIPTIONS_LIST = ['Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'];


  var pictureTemplate = document.querySelector('#picture').content;
  var picturesBlock = document.querySelector('.pictures');
  var commentsBlock = document.querySelector('.social__comments');
  var bigPictureCancel = document.querySelector('#picture-cancel');

  var urlNumbersArray = [];
  for (var j = URL_LIMITS.min; j <= URL_LIMITS.max; j++) {
    urlNumbersArray.push(j);
  }

  var getRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var getComments = function () {
    var arr = [];
    for (var i = 0; i < getRandomValue(1, POSTED_COMMENTS_LIMIT); i++) {
      arr[i] = COMMENTS_LIST[getRandomValue(0, COMMENTS_LIST.length - 1)];
    }
    return arr;
  };

  var generatePictures = function () {
    var pictures = [];

    urlNumbersArray.forEach(function (item) {
      var picture = {
        url: 'photos/' + item + '.jpg',
        likes: getRandomValue(LIKES_LIMITS.min, LIKES_LIMITS.max),
        comments: getComments(),
        description: DESCRIPTIONS_LIST[getRandomValue(0, DESCRIPTIONS_LIST.length - 1)]
      };
      pictures.push(picture);
    });

    return pictures;
  };

  var pictures = generatePictures();


  var addAllPictures = function (info) {
    var fragment = document.createDocumentFragment();

    var addClickListener = function (data, pictureElement) {
      pictureElement.querySelector('a').addEventListener('click', function (evt) {
        evt.preventDefault();
        generateBigPicture(data);
        document.querySelector('.big-picture').classList.remove('hidden');
      });
    };

    pictures.forEach(function (item, i) {
      var data = info[i];
      var pictureElement = pictureTemplate.cloneNode(true);
      pictureElement.querySelector('img').src = item.url;
      pictureElement.querySelector('.picture__stat--likes').textContent = item.likes;
      pictureElement.querySelector('.picture__stat--comments').textContent = item.comments.length;

      addClickListener(data, pictureElement);
      fragment.appendChild(pictureElement);
    });

    return fragment;
  };

  picturesBlock.appendChild(addAllPictures(pictures));


  var generateBigPicture = function (picture) {
    document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
    document.querySelector('.likes-count').textContent = picture.likes;
    document.querySelector('.comments-count').textContent = picture.comments.length;
    document.querySelector('.social__caption').textContent = picture.description;
    var commentsLi = commentsBlock.querySelectorAll('li');

    for (var i = 0; i < commentsLi.length; i++) {
      commentsLi[i].remove();
    }
    for (i = 0; i < picture.comments.length; i++) {
      commentsBlock.insertAdjacentHTML('afterbegin', '<li class="social__comment social__comment--text"><img class="social__picture" src="img/avatar-' + getRandomValue(1, COMMENTS_LIST.length) + '.svg" alt="Аватар комментатора фотографии" width="35" height="35">' + picture.comments[i] + '</li>');
    }
    document.querySelector('.social__comment-count').classList.add('visually-hidden');
    document.querySelector('.social__loadmore').classList.add('visually-hidden');
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
