document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('form');

  forms.forEach((form, index) => {
      form.addEventListener('submit', function (event) {
          event.preventDefault();

          // Собираем данные формы
          const formData = new FormData(form);
          const data = {};

          formData.forEach((value, key) => {
              data[key] = value;
          });

          // Получаем UTM-метки из URL или localStorage
          const utmParams = getURLParams();
          const utmData = {
              utm_source: utmParams['utm_source'] || '',
              utm_medium: utmParams['utm_medium'] || '',
              utm_campaign: utmParams['utm_campaign'] || '',
              utm_term: utmParams['utm_term'] || '',
              utm_content: utmParams['utm_content'] || ''
          };

          // Сохраняем UTM в localStorage, если пришли новые
          saveUTMToLocalStorage(utmData);

          // Берём из localStorage, если UTM нет в текущей форме
          const finalUTM = getStoredUTM();

          // Добавляем UTM к данным
          Object.assign(data, finalUTM);

          // Отправляем на сервер
          fetch('/send.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(result => {
              console.log(`Форма №${index + 1} успешно обработана`, result);
              alert('Спасибо! Данные успешно отправлены.');
          })
          .catch(error => {
              console.error('Ошибка:', error);
              alert('Произошла ошибка при отправке формы.');
          });
      });
  });

  function getURLParams() {
      const search = window.location.search || window.location.hash.split('?')[1] || '';
      return new URLSearchParams(search).Object.fromEntries();
  }

  function saveUTMToLocalStorage(utmData) {
      for (let key in utmData) {
          if (utmData[key]) localStorage.setItem(key, utmData[key]);
      }
  }

  function getStoredUTM() {
      return {
          utm_source: localStorage.getItem('utm_source') || '',
          utm_medium: localStorage.getItem('utm_medium') || '',
          utm_campaign: localStorage.getItem('utm_campaign') || '',
          utm_term: localStorage.getItem('utm_term') || '',
          utm_content: localStorage.getItem('utm_content') || ''
      };
  }
});