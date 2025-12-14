function getAllURLParams() {
    const search = window.location.search || window.location.hash.split('?')[1] || '';
    return Object.fromEntries(new URLSearchParams(search));
}

function saveGETToLocalStorage(getParams) {
    const existing = getStoredGET(); // Получаем уже сохранённые GET
    const updated = { ...existing, ...getParams }; // Добавляем/перезаписываем новые
    localStorage.setItem('save_get', JSON.stringify(updated));
}

function getStoredGET() {
    const saved = localStorage.getItem('save_get');
    return saved ? JSON.parse(saved) : {};
}


document.addEventListener('DOMContentLoaded', function () {


    // Получаем и сохраняем GET-параметры
    const allGETParams = getAllURLParams();
    saveGETToLocalStorage(allGETParams);


    const forms = document.querySelectorAll('form, .form');

    forms.forEach((form, index) => {
        let submitBtn = form.querySelector('[type="submit"]');

        // Удаляем старые сообщения при загрузке
        const existingMessages = form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        submitBtn.addEventListener('click', function (event) {
            event.preventDefault();

            // Очистка предыдущих ошибок
            const existingMessages = form.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());

            // Очистка полей
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const existingError = input.closest('.form-group')?.querySelector('.input-error-message');
                if (existingError) existingError.remove();
                input.classList.remove('invalid');
            });

            let isValid = true;

            // Проверяем поля
            inputs.forEach(input => {
                const isInvalid = !input.checkValidity();
                if (isInvalid) {
                    input.classList.add('invalid');
                    isValid = false;

                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'input-error-message';
                    errorMessage.textContent = 'Пожалуйста, заполните это поле';

                    const parent = input.closest('.form-group');
                    if (parent) {
                        parent.appendChild(errorMessage);
                    }
                }
            });

            if (!isValid) return;

            // Собираем данные
            let data = Object.fromEntries([...inputs].map(input => {
                if (input.type === 'checkbox') return [input.name, input.checked ? 'Да' : 'Нет'];
                const value = input.value?.trim();
                return [input.name, value || ''];
            }));

            data["get"] = getStoredGET();

            // Предположим, что submitBtn — это ваш элемент кнопки
            submitBtn.disabled = true;      // Отключаем кнопку
            submitBtn.style.opacity = 0.5;  // Делаем прозрачной (например, на 50%)

            // Восстанавливаем кнопку через 1 секунду
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = 1;  // Возвращаем полную непрозрачность
            }, 5000);

            // === Отправка ===
            fetch('php/send-email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        // Обработка HTTP-ошибок (404, 500 и т.д.)
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Преобразование в JSON
                })
                .then(result => {
                    // Показываем успех
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-message form-message--success';
                    successMessage.innerHTML = `
                    <div class="form-message__icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13L9 17L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="form-message__text">Спасибо! Данные успешно отправлены.</div>
                    <button type="button" class="form-message__close">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                `;
                    submitBtn.parentNode.insertBefore(successMessage, submitBtn);

                    // Ручное закрытие
                    successMessage.querySelector('.form-message__close')?.addEventListener('click', () => {
                        successMessage.remove();
                    });

                    // Очистка формы
                    inputs.forEach(input => {
                        if (input.type === 'checkbox' || input.type === 'radio') {
                            input.checked = false;
                        } else if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                            input.value = "";
                        }
                    });

                })
                .catch(error => {

                    let errorMessageText = "";
                    // Если ошибка содержит message и он не пустой
                    if (error && typeof error === 'object' && 'message' in error) {
                        errorMessageText = error.message || errorMessageText;
                    }

                    // Создаём плашку ошибки
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'form-message form-message--error';
                    errorMessage.innerHTML = `
                        <div class="form-message__icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </div>
                        <div class="form-message__text">${errorMessageText}</div>
                        <button type="button" class="form-message__close">×</button>
                    `;
                    submitBtn.parentNode.insertBefore(errorMessage, submitBtn);

                    // Ручное закрытие
                    errorMessage.querySelector('.form-message__close')?.addEventListener('click', () => {
                        errorMessage.style.opacity = '0';
                        setTimeout(() => errorMessage.remove(), 300);
                    });
                });
        });
    });

    // Маска для телефонов
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        const maskOptions = {
            mask: '+{7} (000) 000-00-00'
        };
        new IMask(input, maskOptions);
    });

    // Вспомогательные функции
    function getURLParams() {
        const search = window.location.search || window.location.hash.split('?')[1] || '';
        return Object.fromEntries(new URLSearchParams(search));
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