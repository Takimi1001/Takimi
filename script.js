const products = [
    {
        id: 1,
        name: 'Детская площадка у озера',
        description: 'Безопасная зона для детей, столики и место для пикника.',
        meta: 'Семейное, 0+',
        image: 'images/lake.svg',
        price: 2500
    },
    {
        id: 2,
        name: 'Коворкинг в центре',
        description: 'Удобные рабочие места, быстрый Wi‑Fi и кофе.',
        meta: 'Взрослым, 12+',
        image: 'images/coworking.svg',
        price: 12000
    },
    {
        id: 3,
        name: 'Тихая зона у реки',
        description: 'Идеально для отдыха и прогулок на природе.',
        meta: 'Семейное, 6+',
        image: 'images/riverside.svg',
        price: 6000
    },
    {
        id: 4,
        name: 'Мини-парк с фонтаном',
        description: 'Короткие прогулки, детские лавочки, спокойная атмосфера.',
        meta: 'Семейное, 3+',
        image: 'images/lake.svg',
        price: 4000
    },
    {
        id: 5,
        name: 'Просторная веранда',
        description: 'Идеально для больших компаний и пикников.',
        meta: 'Взрослым, 10+',
        image: 'images/riverside.svg',
        price: 15000
    },
    {
        id: 6,
        name: 'Уютный уголок',
        description: 'Небольшое место для отдыха и чтения.',
        meta: '0+',
        image: 'images/coworking.svg',
        price: 1800
    }
];

let selectedProductId = null;

function formatPrice(value) {
    return `${value.toLocaleString('ru-RU')} ₸`;
}

function createCard(product) {
    const li = document.createElement('li');
    li.className = 'card fade-in';

    const imgSrc = product.image && (product.image.startsWith('./') || product.image.startsWith('/')) ? product.image : `./${product.image}`;

    li.innerHTML = `
        <div class="card__media">
            <img src="${imgSrc}" alt="${product.name}" class="card__image" onerror="this.onerror=null;this.src='images/logo.svg'">
        </div>
        <div class="card__content">
            <div class="card__title">${product.name}</div>
            <div class="card__description">${product.description}</div>
            <div class="card__meta">
                <span class="muted">${product.meta}</span>
                <div style="display:flex;align-items:center;gap:10px;">
                    <div class="card__price">${formatPrice(product.price)} / час</div>
                    <button class="button button--primary" data-id="${product.id}" aria-label="Забронировать ${product.name}">Забронировать</button>
                </div>
            </div>
        </div>
    `;

    return li;
}

function renderCatalog(items) {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    grid.innerHTML = '';
    items.forEach((item) => grid.appendChild(createCard(item)));
}

function updateBookingSummary() {
    const selectedPlace = document.getElementById('selectedPlace');
    const totalPrice = document.getElementById('totalPrice');
    const pricePerHourEl = document.getElementById('pricePerHour');
    const confirmButton = document.getElementById('confirmBooking');
    const hoursSelect = document.getElementById('hoursSelect');
    const selectedProduct = products.find((product) => String(product.id) === String(selectedProductId));
    const hours = Number(hoursSelect?.value || 1);

    if (!selectedProduct) {
        selectedPlace.textContent = 'Выберите место в каталоге';
        pricePerHourEl.textContent = '—';
        totalPrice.textContent = '0 ₸';
        confirmButton.disabled = true;
        return;
    }

    const total = hours * selectedProduct.price;
    selectedPlace.textContent = selectedProduct.name;
    pricePerHourEl.textContent = formatPrice(selectedProduct.price);
    totalPrice.textContent = formatPrice(total);
    confirmButton.disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
    renderCatalog(products);

    const searchButton = document.getElementById('searchBtn');
    const ageInput = document.getElementById('age');
    const hoursSelect = document.getElementById('hoursSelect');
    const catalogGrid = document.getElementById('catalogGrid');
    const confirmButton = document.getElementById('confirmBooking');
    const themeToggle = document.getElementById('themeToggle');
    const typeFilter = document.getElementById('typeFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    function getFilteredProducts() {
        const ageVal = Number(ageInput?.value || 0);
        const typeVal = typeFilter?.value || 'all';
        const min = Number(minPrice?.value || 0);
        const max = Number(maxPrice?.value || 0) || Infinity;

        return products.filter((product) => {
            // age filter
            if (ageVal > 0) {
                const match = product.meta.match(/\d+/);
                if (match && ageVal < Number(match[0])) return false;
            }

            // type filter
            if (typeVal && typeVal !== 'all') {
                if (typeVal === 'family' && !/семей/i.test(product.meta)) return false;
                if (typeVal === 'adult' && !/взросл/i.test(product.meta)) return false;
            }

            // price filter
            const price = Number(product.price || 0);
            if (price < min) return false;
            if (max !== Infinity && price > max) return false;

            return true;
        });
    }

    searchButton?.addEventListener('click', () => {
        renderCatalog(getFilteredProducts());
    });

    applyFiltersBtn?.addEventListener('click', () => {
        renderCatalog(getFilteredProducts());
    });

    clearFiltersBtn?.addEventListener('click', () => {
        if (typeFilter) typeFilter.value = 'all';
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        if (ageInput) ageInput.value = '';
        renderCatalog(products);
    });

    hoursSelect?.addEventListener('change', updateBookingSummary);

    catalogGrid?.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-id]');
        if (!button) return;

        selectedProductId = button.getAttribute('data-id');
        updateBookingSummary();
        document.querySelector('.booking__card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Theme toggle
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle?.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            themeToggle?.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        }
    }

    themeToggle?.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setTheme('dark');

    confirmButton?.addEventListener('click', () => {
        const selectedProduct = products.find((product) => String(product.id) === String(selectedProductId));
        const hours = Number(hoursSelect?.value || 1);
        const total = hours * (selectedProduct?.price || 0);

        if (!selectedProduct) return;

        alert(`Бронирование подтверждено!\nМесто: ${selectedProduct.name}\nЧасы: ${hours}\nИтого: ${formatPrice(total)}`);
    });

    const contactForm = document.getElementById('contact-form-element');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = contactForm.querySelector('#contactName').value.trim();
            const phone = contactForm.querySelector('#contactPhone').value.trim();
            const message = contactForm.querySelector('#contactMessage').value.trim();

            const namePattern = /^[A-Za-zА-Яа-яЁё\s]+$/;
            const phonePattern = /^\+?\d{10,15}$/;

            if (!namePattern.test(name)) {
                formStatus.textContent = 'Пожалуйста, введите корректное имя.';
                return;
            }

            if (!phonePattern.test(phone)) {
                formStatus.textContent = 'Пожалуйста, введите корректный номер телефона.';
                return;
            }

            if (message.length < 5) {
                formStatus.textContent = 'Пожалуйста, введите сообщение.';
                return;
            }

            formStatus.textContent = 'Спасибо! Ваше сообщение отправлено.';
            contactForm.reset();
        });
    }

    updateBookingSummary();
});