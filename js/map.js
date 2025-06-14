
// Яндекс Карты для магазинов
ymaps.ready(initStoresMap);

function initStoresMap() {
    // Создаем карту
    const storesMap = new ymaps.Map('stores-map', {
        center: [45.2, 38.95], // Примерный центр между всеми магазинами
        zoom: 10,
        controls: ['zoomControl', 'geolocationControl']
    });

    // Данные о магазинах
    const stores = [
        // Фирменные магазины
        {
            id: 'store1',
            name: 'Новотитаровская - Центр',
            address: 'ст. Новотитаровская, ул. Ленина, д.226 (центр)',
            coordinates: [45.260865, 38.979930],
            type: 'branded',
            location: 'novotitarovskaya'
        },
        {
            id: 'store2',
            name: 'Новотитаровская - Балочка',
            address: 'ст. Новотитаровская, ул. Ленина, д.114/1 (балочка)',
            coordinates: [45.259954, 38.965703],
            type: 'branded',
            location: 'novotitarovskaya'
        },
        {
            id: 'store3',
            name: 'Новотитаровская - Школа №35',
            address: 'ст. Новотитаровская, ул. Широкая, д.89 (напротив МОУ СОШ №35)',
            coordinates: [45.254869, 38.972440],
            type: 'branded',
            location: 'novotitarovskaya'
        },
        {
            id: 'store4',
            name: 'Новотитаровская - Магнит',
            address: 'ст. Новотитаровская, ул. Широкая, д.58 (напротив магазина "Магнит")',
            coordinates: [45.253458, 38.973084],
            type: 'branded',
            location: 'novotitarovskaya'
        },
        {
            id: 'store5',
            name: 'Новотитаровская - Тельмана',
            address: 'ст. Новотитаровская, ул. Тельмана (пересечение с ул. Сельская)',
            coordinates: [45.257365, 38.977129],
            type: 'branded',
            location: 'novotitarovskaya'
        },
        {
            id: 'store6',
            name: 'Динская - Поликлиника',
            address: 'ст. Динская, ул. Кирпичная, д.73/1 (поликлиника)',
            coordinates: [45.217373, 39.223033],
            type: 'branded',
            location: 'dinskaya'
        },
        {
            id: 'store7',
            name: 'Нововеличковская',
            address: 'ст. Нововеличковская, ул. Луначарского, 15',
            coordinates: [45.122910, 38.829510],
            type: 'branded',
            location: 'novovelichkovskaya'
        },

        // Партнерские магазины
        {
            id: 'store8',
            name: 'Статус - Красная',
            address: 'ст. Динская, ул. Красная 94',
            coordinates: [45.211672, 39.236210],
            type: 'partner',
            location: 'dinskaya'
        },
        {
            id: 'store9',
            name: 'Статус - Пролетарская',
            address: 'ст. Динская, ул. Пролетарская 40',
            coordinates: [45.214632, 39.231310],
            type: 'partner',
            location: 'dinskaya'
        },
        {
            id: 'store10',
            name: 'Минимаркет "Вкусноежка"',
            address: 'п. Северный, ул. Пригородная, д.105',
            coordinates: [45.276090, 39.016810],
            type: 'partner',
            location: 'other'
        },
        {
            id: 'store11',
            name: 'Молоко',
            address: 'п. Прогресс, ул. Мечникова, д.3 (503)',
            coordinates: [45.285780, 38.965750],
            type: 'partner',
            location: 'other'
        },
        {
            id: 'store12',
            name: 'Лавка Петровича - Южный',
            address: 'п. Южный, ул. Смоленская, д.51',
            coordinates: [45.084380, 38.972190],
            type: 'partner',
            location: 'other'
        },
        {
            id: 'store13',
            name: 'Ботаника - Клары Лучко',
            address: 'г. Краснодар, ул. Клары Лучко, д.10',
            coordinates: [45.058690, 38.950210],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store14',
            name: 'Ботаника - Яна Полуяна',
            address: 'г. Краснодар, ул. Яна Полуяна, д.47/2',
            coordinates: [45.062430, 38.953360],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store15',
            name: 'Ботаника - ТЦ Красная площадь',
            address: 'г. Краснодар, ТЦ Красная площадь 1 этаж',
            coordinates: [45.088410, 38.979080],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store16',
            name: 'Ботаника - Монтажников',
            address: 'г. Краснодар, ул. Монтажников, д.3Б',
            coordinates: [45.044860, 39.010050],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store17',
            name: 'Фермерский дворик (Агромаг)',
            address: 'г. Краснодар, ул. Красная, д.176/5 Корпус№9 (ТЦ "Центр города" вход с ул. Коммунарова)',
            coordinates: [45.036600, 38.974830],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store18',
            name: 'Продукты - Кореновская',
            address: 'г. Краснодар, ул. Кореновская, д.65',
            coordinates: [45.058050, 39.005350],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store19',
            name: 'Фермерские продукты - Думенко',
            address: 'г. Краснодар, ул. Думенко, д.13 место 23',
            coordinates: [45.032980, 38.945680],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store20',
            name: 'Деревенские продукты',
            address: 'г. Краснодар, ул. Кореновская, д.1',
            coordinates: [45.067260, 39.005970],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store21',
            name: 'Фермерские продукты - Березовый',
            address: 'г. Краснодар, п. Березовый, 1/5',
            coordinates: [45.156010, 38.926990],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store22',
            name: 'Катран',
            address: 'г. Краснодар, ул. Пригородная, 29',
            coordinates: [45.042810, 38.915440],
            type: 'partner',
            location: 'krasnodar'
        },
        {
            id: 'store23',
            name: 'Лавка Петровича - Покрышкина',
            address: 'г. Краснодар, ул. Покрышкина, 4/10',
            coordinates: [45.052320, 38.937420],
            type: 'partner',
            location: 'krasnodar'
        }
    ];

    // Создаем кластеризатор
    const clusterer = new ymaps.Clusterer({
        preset: 'islands#greenClusterIcons',
        clusterDisableClickZoom: false,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 300,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonPagerSize: 5
    });

    // Создаем массив для хранения меток
    const placemarks = {};

    // Функция для создания метки магазина
    function createPlacemark(store) {
        const iconColor = store.type === 'branded' ? '#7FB77E' : '#A4907C';
        const iconContent = store.type === 'branded' ? 'Ф' : 'П';

        const placemark = new ymaps.Placemark(
            store.coordinates,
            {
                hintContent: store.name,
                balloonContentHeader: store.name,
                balloonContentBody: `
                    <div class="map-balloon">
                        <p>${store.address}</p>
                        <p><strong>Тип:</strong> ${store.type === 'branded' ? 'Фирменный' : 'Партнерский'}</p>
                    </div>
                `,
                storeId: store.id
            },
            {
                preset: 'islands#circleIcon',
                iconColor: iconColor,
                iconContent: iconContent
            }
        );

        // Обработчик клика для отображения деталей на мобильном
        placemark.events.add('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                showStoreDetails(store);
                return false;
            }
        });

        return placemark;
    }

    // Создаем метки для всех магазинов и добавляем их в кластеризатор
    stores.forEach(store => {
        const placemark = createPlacemark(store);
        placemarks[store.id] = placemark;

        // Обработчик клика по метке
        placemark.events.add('click', function() {
            activateStoreItem(store.id);
        });
    });

    // Добавляем все метки в кластеризатор
    clusterer.add(Object.values(placemarks));

    // Добавляем кластеризатор на карту
    storesMap.geoObjects.add(clusterer);

    // Настраиваем зум карты так, чтобы были видны все метки
    storesMap.setBounds(clusterer.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 30
    });

    // Получаем все элементы списка магазинов
    const storeItems = document.querySelectorAll('.store-item');

    // Функция для активации элемента магазина
    function activateStoreItem(storeId) {
        // Снимаем активное состояние со всех элементов
        storeItems.forEach(item => {
            item.classList.remove('active');
        });

        // Находим нужный элемент и активируем его
        const activeItem = document.querySelector(`.store-item[data-id="${storeId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Получаем координаты магазина
            const store = stores.find(s => s.id === storeId);
            if (store) {
                // Центрируем карту на магазине
                storesMap.setCenter(store.coordinates, 16, {
                    duration: 300
                });
            }
        }
    }

    // Добавляем обработчики клика по элементам списка
    storeItems.forEach(item => {
        item.addEventListener('click', function() {
            const storeId = this.dataset.id;
            activateStoreItem(storeId);

            // На мобильных показываем детали магазина
            if (window.innerWidth <= 768) {
                const store = stores.find(s => s.id === storeId);
                if (store) {
                    showStoreDetails(store);
                }
            }
        });
    });

    // Фильтрация магазинов
    const typeCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="type-"]');
    const locationCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="location-"]');

    function filterStores() {
        // Получаем выбранные типы магазинов и локации
        const selectedTypes = Array.from(typeCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const selectedLocations = Array.from(locationCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Фильтруем элементы списка
        storeItems.forEach(item => {
            const itemType = item.dataset.type;
            const itemLocation = item.dataset.location;

            // Проверяем, соответствует ли элемент выбранным фильтрам
            const matchesType = selectedTypes.includes(itemType);
            const matchesLocation = selectedLocations.includes(itemLocation);

            // Отображаем элемент, если он соответствует обоим фильтрам
            if (matchesType && matchesLocation) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Фильтруем метки на карте
        for (const store of stores) {
            const placemark = placemarks[store.id];

            if (selectedTypes.includes(store.type) && selectedLocations.includes(store.location)) {
                placemark.options.set('visible', true);
            } else {
                placemark.options.set('visible', false);
            }
        }

        // Обновляем видимые объекты кластеризатора
        clusterer.removeAll();
        const visiblePlacemarks = Object.values(placemarks).filter(p => p.options.get('visible') !== false);
        clusterer.add(visiblePlacemarks);

        // Если есть видимые метки, центрируем карту
        if (visiblePlacemarks.length > 0) {
            storesMap.setBounds(clusterer.getBounds(), {
                checkZoomRange: true,
                zoomMargin: 30
            });
        }
    }

    // Добавляем обработчики изменения фильтров
    typeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterStores);
    });

    locationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterStores);
    });

    // Мобильное отображение фильтров и списка
    const mobileStoresToggle = document.querySelector('.mobile-stores-toggle');
    const storesSidebar = document.querySelector('.stores-sidebar');

    if (mobileStoresToggle && storesSidebar) {
        mobileStoresToggle.addEventListener('click', () => {
            storesSidebar.classList.toggle('active');
            if (storesSidebar.classList.contains('active')) {
                mobileStoresToggle.querySelector('.toggle-text').textContent = 'Скрыть список магазинов';
                mobileStoresToggle.querySelector('.toggle-icon').textContent = '✕';
            } else {
                mobileStoresToggle.querySelector('.toggle-text').textContent = 'Показать список магазинов';
                mobileStoresToggle.querySelector('.toggle-icon').textContent = '📋';
            }
        });
    }

    // Быстрые фильтры для мобильных
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');

    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Сбрасываем активное состояние всех кнопок
            quickFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Применяем фильтр
            if (filter === 'all') {
                // Активируем все чекбоксы
                typeCheckboxes.forEach(cb => { cb.checked = true; });
                locationCheckboxes.forEach(cb => { cb.checked = true; });
            } else if (filter === 'branded' || filter === 'partner') {
                // Активируем только выбранный тип
                typeCheckboxes.forEach(cb => {
                    cb.checked = (cb.value === filter);
                });
                // Активируем все локации
                locationCheckboxes.forEach(cb => { cb.checked = true; });
            } else {
                // Активируем все типы
                typeCheckboxes.forEach(cb => { cb.checked = true; });
                // Активируем только выбранную локацию
                locationCheckboxes.forEach(cb => {
                    cb.checked = (cb.value === filter);
                });
            }

            // Применяем фильтры
            filterStores();
        });
    });

    // Полноэкранный режим карты
    const mapContainer = document.querySelector('.map-container');
    const mapFullscreenToggle = document.getElementById('map-fullscreen');
    const mapCloseFullscreen = document.getElementById('map-close-fullscreen');

    if (mapFullscreenToggle && mapCloseFullscreen) {
        mapFullscreenToggle.addEventListener('click', () => {
            mapContainer.classList.add('fullscreen');
            mapCloseFullscreen.style.display = 'flex';
            mapFullscreenToggle.style.display = 'none';

            // Обновляем размер карты
            storesMap.container.fitToViewport();
        });

        mapCloseFullscreen.addEventListener('click', () => {
            mapContainer.classList.remove('fullscreen');
            mapCloseFullscreen.style.display = 'none';
            mapFullscreenToggle.style.display = 'flex';

            // Обновляем размер карты
            storesMap.container.fitToViewport();
        });
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        storesMap.container.fitToViewport();
    });

    // Кнопки управления масштабом
    const zoomInBtn = document.getElementById('map-zoom-in');
    const zoomOutBtn = document.getElementById('map-zoom-out');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            storesMap.setZoom(storesMap.getZoom() + 1, { duration: 300 });
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            storesMap.setZoom(storesMap.getZoom() - 1, { duration: 300 });
        });
    }

    // Кнопка определения местоположения
    const locationBtn = document.getElementById('map-location');
    if (locationBtn) {
        locationBtn.addEventListener('click', () => {
            ymaps.geolocation.get({
                mapStateAutoApply: true
            }).then(function (result) {
                storesMap.geoObjects.add(result.geoObjects);

                // Найти ближайший магазин
                const userLocation = result.geoObjects.position;
                let closestStore = null;
                let minDistance = Infinity;

                stores.forEach(store => {
                    const distance = getDistance(
                        userLocation[0], userLocation[1],
                        store.coordinates[0], store.coordinates[1]
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestStore = store;
                    }
                });

                if (closestStore) {
                    // Показать пользователю информацию о ближайшем магазине
                    showNearestStoreMessage(closestStore, Math.round(minDistance));
                }
            });
        });
    }

    // Функция для расчета расстояния между двумя точками (в км)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Радиус Земли в километрах
        const dLat = deg2rad(lat2-lat1);
        const dLon = deg2rad(lon2-lon1);
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; // Расстояние в км
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    function showNearestStoreMessage(store, distance) {
        const content = `
            <div style="padding: 15px;">
                <p>Ближайший магазин:</p>
                <h3 style="margin: 5px 0;">${store.name}</h3>
                <p>${store.address}</p>
                <p>Расстояние: примерно ${distance} км</p>
            </div>
        `;

        // Показываем балун с информацией
        if (window.innerWidth <= 768) {
            // На мобильном показываем всплывающее окно
            showStoreDetails(store, distance);
        } else {
            // На десктопе показываем балун на карте
            placemarks[store.id].balloon.open();
        }
    }

    // Функция для отображения деталей магазина на мобильном
    function showStoreDetails(store, distance) {
        const detailsSheet = document.getElementById('store-details');
        const detailsName = document.getElementById('details-name');
        const detailsAddress = document.getElementById('details-address');
        const detailsTags = document.getElementById('details-tags');
        const getDirectionsBtn = document.getElementById('get-directions');

        if (!detailsSheet) return;

        // Заполняем данные
        if (detailsName) detailsName.textContent = store.name;
        if (detailsAddress) {
            detailsAddress.textContent = store.address;
            if (distance) {
                detailsAddress.textContent += ` (${distance} км от вас)`;
            }
        }

        // Очищаем и добавляем теги
        if (detailsTags) {
            detailsTags.innerHTML = '';
            let storeType = store.type === 'branded' ? 'Фирменный' : 'Партнерский';
            detailsTags.innerHTML += `<span class="store-tag">${storeType}</span>`;
        }

        // Обновляем кнопку маршрута
        if (getDirectionsBtn) {
            getDirectionsBtn.onclick = function() {
                const url = `https://yandex.ru/maps/?rtext=~${store.coordinates[0]},${store.coordinates[1]}`;
                window.open(url, '_blank');
            };
        }

        // Показываем панель
        detailsSheet.classList.add('active');

        // Закрытие при клике вне панели
        function closeOnOutsideClick(e) {
            if (!detailsSheet.contains(e.target) &&
                !e.target.closest('.store-item') &&
                !e.target.closest('[class^="ymaps"]')) {
                detailsSheet.classList.remove('active');
                document.removeEventListener('click', closeOnOutsideClick);
            }
        }

        // Добавляем обработчик с задержкой, чтобы избежать срабатывания при открытии
        setTimeout(() => {
            document.addEventListener('click', closeOnOutsideClick);
        }, 10);
    }

    // Обработчик для закрытия деталей магазина по свайпу
    const storeDetails = document.getElementById('store-details');
    if (storeDetails) {
        let touchStartY = 0;
        let touchEndY = 0;

        storeDetails.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});

        storeDetails.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            if (touchEndY - touchStartY > 50) { // свайп вниз
                storeDetails.classList.remove('active');
            }
        }, {passive: true});
    }
}
