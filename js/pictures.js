'use strict';

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


var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
var picturesBlock = document.querySelector('.pictures');
var commentsBlock = document.querySelector('.social__comments');
var commentNode = document.querySelector('.social__comment');

var urlNumbersArray = [];
for (var j = URL_LIMITS.min; j <= URL_LIMITS.max; j++) {
  urlNumbersArray.push(j);
}

var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};


var generatePictures = function () {
  var pictures = [];

  for (var i = 0; i < urlNumbersArray.length; i++) {
    var picture = {
      url: 'photos/' + urlNumbersArray[i] + '.jpg',
      likes: getRandomValue(LIKES_LIMITS.min, LIKES_LIMITS.max),
      comments: COMMENTS_LIST,
      commentsCount: getRandomValue(1, COMMENTS_LIST.length),
      description: DESCRIPTIONS_LIST[getRandomValue(0, DESCRIPTIONS_LIST.length - 1)]
    };
    pictures.push(picture);
  }

  return pictures;
};

var pictures = generatePictures();

pictures.forEach(function (item) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = item.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = item.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = item.commentsCount;
  picturesBlock.appendChild(pictureElement);
});


var removeOldComments = function () {
  var commentsLi = commentsBlock.querySelectorAll('li');
  for (var i = 0; i < commentsLi.length; i++) {
    if (commentsLi[i].className !== 'social__comment social__comment--text') {
      commentsLi[i].remove();
    }
  }
};

var addComments = function (picture) {
  for (var i = 0; i < POSTED_COMMENTS_LIMIT; i++) {
    var clonedComment = commentNode.cloneNode(true);
    clonedComment.classList.add('social__comment--text');
    clonedComment.querySelector('img').src = 'img/avatar-' + getRandomValue(1, COMMENTS_LIST.length) + '.svg';
    clonedComment.querySelector('p').textContent = picture.comments[getRandomValue(0, COMMENTS_LIST.length - 1)];
    commentsBlock.appendChild(clonedComment);
  }
};

var generateBigPicture = function (picture) {
  document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  document.querySelector('.likes-count').textContent = picture.likes;
  document.querySelector('.comments-count').textContent = picture.commentsCount;
  document.querySelector('.social__caption').textContent = picture.description;
  addComments(picture);
  removeOldComments();
  document.querySelector('.big-picture').classList.remove('hidden');
  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.social__loadmore').classList.add('visually-hidden');
};


// generateBigPicture(pictures[0]);

var uploadInput = document.querySelector('#upload-file');
var uploadBlock = document.querySelector('.img-upload__overlay');
var closeuploadBlock = document.querySelector('#upload-cancel');
var uploadForm = document.querySelector('#upload-select-image');


var openUploadBlock = function () {
  uploadBlock.classList.remove('hidden');
};

var closeUploadBlock = function () {
  uploadBlock.classList.add('hidden');
  picWithEffect.className = 'img-upload__preview';
  // uploadForm.reset()
  // uploadInput.value = '';
};


uploadInput.addEventListener('change', openUploadBlock);

closeuploadBlock.addEventListener('click', closeUploadBlock);


var picWithEffect = document.querySelector('.img-upload__preview');
var effectsList = document.querySelector('.effects__list');


var onInputEffectChange = function (evt) {
  picWithEffect.className = 'img-upload__preview';
  picWithEffect.classList.toggle('effects__preview--' + evt.target.value);
};

effectsList.addEventListener('change', onInputEffectChange);

var pin = document.querySelector('.scale__pin ');
var scaleInput = document.querySelector('.scale__value'); // (.value)
var uploadWrapper = document.querySelector('.img-upload__wrapper');
var SCALE_LIMITS = {
  min: 0,
  max: 453
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
    x: pinBeginCoords.x - evt.clientX
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

};

var onPinMouseup = function () {
  document.removeEventListener('mousemove', onPinMousemove);
  document.removeEventListener('mouseup', onPinMouseup);
};


pin.addEventListener('mousedown', onPinMousedown);
