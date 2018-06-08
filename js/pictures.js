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

var getRandomValue = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var getRandomFromRange = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var urlNumbersArray = [];
	for (var i = URL_LIMITS.min; i <= URL_LIMITS.max; i++) {
    urlNumbersArray.push(i);
  }

var pictureTemplate = document.querySelector('#picture')
.content
.querySelector('.picture__link');

var picturesBlock = document.querySelector('.pictures');

var pictures = [];

for (var i = 0; i < PICTURES_QUANTIY; i++) {
  pictures[i] = {
    url: 'photos/' + urlNumbersArray[i] + '.jpg',
    likes: getRandomFromRange(LIKES_LIMITS.min, LIKES_LIMITS.max),
    comments: getRandomValue(COMMENTS_LIST),
    description: getRandomValue(DESCRIPTIONS_LIST)
  }
}

pictures.forEach(function(item) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('img').src = item.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = item.likes;
//  pictureElement.querySelector('.picture__stat--comments').textContent = getRandomFromRange(LIKES_LIMITS.min, LIKES_LIMITS.max);
  picturesBlock.appendChild(pictureElement);
})

// var bigPicture = document.querySelector('.big-picture');
// bigPicture.classList.remove('hidden');

// document.querySelector('.big-picture__img').querySelector('img').src = pictures[0].url;
// document.querySelector('.likes-count').textContent = pictures[0].likes;
// document.querySelector('.comments-count').textContent =
