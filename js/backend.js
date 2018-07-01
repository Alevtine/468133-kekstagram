'use strict';

(function () {

  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';
  var TIMEOUT = 5000;
  var Code = {
    SUCCESS: 200,
    BAD_REQUEST: 400
  };

  var request = function (onSuccess, onError, method, url, data) {

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.SUCCESS:
          onSuccess(xhr.response);
          break;
        case Code.BAD_REQUEST:
          onError('Получен ответ: ' + xhr.status + '. ' + xhr.response[0].errorMessage);
          break;
        default:
          onError('Получен ответ: ' + xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения: ' + xhr.status);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не выполнился за ' + xhr.timeout + ' мс');
    });

    xhr.open(method, url);
    xhr.send(data);

  };

  window.backend = {
    getData: function (onSuccess, onError) {
      request(onSuccess, onError, 'GET', URL_GET);
    },

    postData: function (data, onSuccess, onError) {
      request(onSuccess, onError, 'POST', URL_POST, data);
    }
  };

})();
