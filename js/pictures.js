'use strict';

var URL_LIMITS = {
  min: 1,
  max: 25
};

var LIKES_LIMITS = {
  min: 15,
  max: 200
};

var PICTURES_QUANTIY = 25;

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

var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var urlNumbersArray = [];
for (var j = URL_LIMITS.min; j <= URL_LIMITS.max; j++) {
  urlNumbersArray.push(j);
}

var pictureTemplate = document.querySelector('#picture')
.content
.querySelector('.picture__link');

var picturesBlock = document.querySelector('.pictures');

var generatePictures = function () {
  var pictures = [];

  for (var i = 0; i < PICTURES_QUANTIY; i++) {
    var picture = {
      url: 'photos/' + urlNumbersArray[i] + '.jpg',
      likes: getRandomValue(LIKES_LIMITS.min, LIKES_LIMITS.max),
      comments: COMMENTS_LIST[getRandomValue(0, COMMENTS_LIST.length - 1)],
      commentsQtty: getRandomValue(1, COMMENTS_LIST.length),
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
  pictureElement.querySelector('.picture__stat--comments').textContent = item.commentsQtty;
  picturesBlock.appendChild(pictureElement);
});


var generateBigPicture = function (picture) {
  document.querySelector('.big-picture').classList.remove('hidden');
  document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  document.querySelector('.likes-count').textContent = picture.likes;
  document.querySelector('.comments-count').textContent = picture.commentsQtty;

  var commentNode = document.querySelector('.social__comment').cloneNode(true);

  while (document.querySelector('.social__comments').firstChild) {
    document.querySelector('.social__comments').removeChild(document.querySelector('.social__comments').firstChild);
  }

  var commentsBlock = document.querySelector('.social__comments');
  commentNode.classList.add('social__comment--text');
  commentNode.src = 'img/avatar- ' + picture.commentsQtty + '.svg';
  commentNode.querySelector('p').textContent = picture.comments;
  commentsBlock.appendChild(commentNode);

  document.querySelector('.social__caption').textContent = picture.description;
};

generateBigPicture(pictures[0]);

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__loadmore').classList.add('visually-hidden');
