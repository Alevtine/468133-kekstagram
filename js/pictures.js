'use strict';

var URL_LIMITS = {
  min: 1,
  max: 25
};

var LIKES_LIMITS = {
  min: 15,
  max: 200
};

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
commentNode.classList.remove('.social__comment');

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
  var commentsLi = commentsBlock.children;
  for (var i = 0; i < commentsLi.length; i++) {
    if (commentsLi[i].className !== 'social__comment social__comment--text') {
      commentsLi[i].remove();
    }
  }
};

var addComment = function (picture) {
  removeOldComments();
  var clonedComment = commentNode.cloneNode(true);
  clonedComment.classList.add('social__comment--text');
  clonedComment.querySelector('img').src = 'img/avatar-' + getRandomValue(1, COMMENTS_LIST.length) + '.svg';
  clonedComment.querySelector('p').textContent = picture.comments[getRandomValue(0, COMMENTS_LIST.length - 1)];
  commentsBlock.appendChild(clonedComment);
};

var generateBigPicture = function (picture) {
  document.querySelector('.big-picture__img').querySelector('img').src = picture.url;
  document.querySelector('.likes-count').textContent = picture.likes;
  document.querySelector('.comments-count').textContent = picture.commentsCount;
  document.querySelector('.social__caption').textContent = picture.description;
  addComment(picture);
  addComment(picture);
};

document.querySelector('.big-picture').classList.remove('hidden');
document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.social__loadmore').classList.add('visually-hidden');

generateBigPicture(pictures[0]);
