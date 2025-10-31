// Яндекс Карты для магазинов
ymaps.ready(initStoresMap);

let stores = []; // Глобальная переменная для хранения данных магазинов

// Загружаем данные магазинов из JSON файла
async function loadStoresData() {
    try {
        const response = await fetch('data/stores.json');
        const data = await response.json();
        return data.stores;
    } catch (error) {
        console.error('Ошибка загрузки данных магазинов:', error);
        return [];
    }
}

// Функции для управления скелетонами
function showSkeletons() {
    const storesContainer = document.querySelector('.stores-container');
    if (storesContainer) {
        storesContainer.classList.add('skeleton-container');
        storesContainer.classList.remove('stores-loaded');
    }
}

function hideSkeletons() {
    const storesContainer = document.querySelector('.stores-container');
    if (storesContainer) {
        storesContainer.classList.remove('skeleton-container');
        storesContainer.classList.add('stores-loaded');
    }
}

async function initStoresMap() {
    // Показываем скелетоны
    showSkeletons();

    // Загружаем данные магазинов
    stores = await loadStoresData();

    if (stores.length === 0) {
        console.error('Не удалось загрузить данные магазинов');
        hideSkeletons();
        return;
    }

    // Создаем карту
    const storesMap = new ymaps.Map('stores-map', {
        center: [45.2, 38.95], // Примерный центр между всеми магазинами
        zoom: 10,
        controls: ['zoomControl', 'geolocationControl']
    });

    // Данные о магазинах теперь загружаются из JSON файла

    // Создаем кластеризатор
    const clusterer = new ymaps.Clusterer({
        preset: 'islands#redClusterIcons',
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
        const iconColor = store.type === 'branded' ? '#E90101' : '#FF3333';
        const iconContent = store.type === 'branded' ? 'Ф' : 'П';

        // Создаем содержимое балуна с изображением
        let balloonContent = `
            <div class="map-balloon">
                <div class="balloon-content">
                    <h3 class="balloon-title">${store.name}</h3>
        `;

        // Добавляем изображение с типом поверх него, если оно есть
        if (store.image) {
            balloonContent += `
                    <div class="balloon-image" data-store-id="${store.id}">
                        <img src="${store.image}" alt="${store.name}" data-store-id="${store.id}">
                        <div class="balloon-type-overlay">${store.type === 'branded' ? 'Фирменный' : 'Партнерский'}</div>
                    </div>
            `;
        }

        balloonContent += `
                    <p class="balloon-address">${store.address}</p>
                </div>
            </div>
        `;

        const placemark = new ymaps.Placemark(
            store.coordinates,
            {
                hintContent: store.name,
                balloonContentBody: balloonContent,
                storeId: store.id
            },
            {
                preset: 'islands#circleIcon',
                iconColor: iconColor,
                iconContent: iconContent,
                draggable: false,
            }
        );

        // Обработчик перемещения маркера
        placemark.events.add('dragend', function() {
            const coords = placemark.geometry.getCoordinates();
            console.log(`Новые координаты для "${store.name}" (ID: ${store.id}):`);
            console.log(`Координаты: [${coords[0]}, ${coords[1]}]`);
            console.log(`JSON формат: "coordinates": [${coords[0]}, ${coords[1]}]`);
            console.log('---');
        });

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

    // Функция для генерации списка магазинов
    function generateStoresList() {
        const storesListContainer = document.getElementById('stores-list');
        if (!storesListContainer) return;

        // Группируем магазины по типу
        const brandedStores = stores.filter(store => store.type === 'branded');
        const partnerStores = stores.filter(store => store.type === 'partner');

        let html = '';

        // Генерируем фирменные магазины
        if (brandedStores.length > 0) {
            html += `
                <div class="store-category" id="branded-stores">
                    <h3 class="store-category-title">Фирменные магазины</h3>
            `;

            brandedStores.forEach(store => {
                html += `
                    <div class="store-item" data-id="${store.id}" data-type="${store.type}" data-location="${store.location}">
                        <div class="store-name">${store.name}</div>
                        <div class="store-address">${store.address}</div>
                        <div class="store-tags">
                            <span class="store-tag">Фирменный</span>
                            <span class="store-tag">${store.locationName || ''}</span>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        }

        // Генерируем партнерские магазины
        if (partnerStores.length > 0) {
            html += `
                <div class="store-category" id="partner-stores">
                    <h3 class="store-category-title">Партнерские магазины</h3>
            `;

            partnerStores.forEach(store => {
                html += `
                    <div class="store-item" data-id="${store.id}" data-type="${store.type}" data-location="${store.location}">
                        <div class="store-name">${store.name}</div>
                        <div class="store-address">${store.address}</div>
                        <div class="store-tags">
                            <span class="store-tag">Партнерский</span>
                            <span class="store-tag">${store.locationName || ''}</span>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
        }

        storesListContainer.innerHTML = html;
    }

    // Функция для генерации фильтров по локациям
    function generateLocationFilters() {
        const locationFiltersContainer = document.getElementById('location-filters');
        if (!locationFiltersContainer) return;

        // Получаем уникальные локации из данных магазинов
        const locationMap = new Map();

        stores.forEach(store => {
            if (!locationMap.has(store.location)) {
                locationMap.set(store.location, {
                    key: store.location,
                    name: store.locationName || store.location
                });
            }
        });

        const uniqueLocations = Array.from(locationMap.values());

        let html = '';

        uniqueLocations.forEach(location => {
            const locationId = `location-${location.key}`;
            html += `
                <div class="filter-option">
                    <input type="checkbox" id="${locationId}" value="${location.key}" checked>
                    <label for="${locationId}">${location.name}</label>
                </div>
            `;
        });

        locationFiltersContainer.innerHTML = html;
    }

    // Генерируем список магазинов в HTML
    generateStoresList();

    // Генерируем фильтры по локациям
    generateLocationFilters();

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

    // Функция для активации элемента магазина
    function activateStoreItem(storeId) {
        // Снимаем активное состояние со всех элементов
        const storeItems = document.querySelectorAll('.store-item');
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

    // Функция для добавления обработчиков событий к элементам списка
    function addStoreItemEventListeners() {
        const storeItems = document.querySelectorAll('.store-item');

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
    }

    // Добавляем обработчики после генерации списка
    addStoreItemEventListeners();

    // Фильтрация магазинов
    function filterStores() {
        // Получаем элементы фильтров динамически
        const typeCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="type-"]');
        const locationCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="location-"]');

        // Получаем выбранные типы магазинов и локации
        const selectedTypes = Array.from(typeCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const selectedLocations = Array.from(locationCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        // Получаем все элементы списка магазинов (динамически)
        const storeItems = document.querySelectorAll('.store-item');

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

    // Функция для добавления обработчиков событий к фильтрам
    function addFilterEventListeners() {
        const typeCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="type-"]');
        const locationCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="location-"]');

        // Добавляем обработчики изменения фильтров
        typeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterStores);
        });

        locationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filterStores);
        });
    }

    // Добавляем обработчики после генерации фильтров
    addFilterEventListeners();

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
    function addQuickFilterEventListeners() {
        const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');

        quickFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Сбрасываем активное состояние всех кнопок
                quickFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Получаем элементы фильтров динамически
                const typeCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="type-"]');
                const locationCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"][id^="location-"]');

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
    }

    // Добавляем обработчики быстрых фильтров
    addQuickFilterEventListeners();

    // Скрываем скелетоны после полной загрузки
    hideSkeletons();

    // Инициализируем попап для изображений
    initImagePopup();

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

// Функции для работы с попапом изображений
function initImagePopup() {
    const popup = document.getElementById('image-popup');
    const closeBtn = document.querySelector('.image-popup-close');
    const overlay = document.querySelector('.image-popup-overlay');

    // Обработчик клика по изображению в балуне
    document.addEventListener('click', function(e) {
        if (e.target.matches('.balloon-image img') || e.target.matches('.balloon-image')) {
            e.preventDefault();
            const storeId = e.target.getAttribute('data-store-id');
            if (storeId) {
                openImagePopup(storeId);
            }
        }
    });

    // Закрытие попапа
    function closePopup() {
        popup.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('show')) {
            closePopup();
        }
    });
}

function openImagePopup(storeId) {
    const store = stores.find(s => s.id === storeId);
    if (!store || !store.image) return;

    const popup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');
    const popupTitle = document.getElementById('popup-title');
    const popupAddress = document.getElementById('popup-address');

    // Заполняем данные
    popupImage.src = store.image;
    popupImage.alt = store.name;
    popupTitle.textContent = store.name;
    popupAddress.textContent = store.address;

    // Показываем попап
    popup.classList.add('show');
    document.body.style.overflow = 'hidden';
}
