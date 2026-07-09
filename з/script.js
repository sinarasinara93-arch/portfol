document.addEventListener('DOMContentLoaded', () => {
    // Элементы фильтрации и каталога
    const navLinks = document.querySelectorAll('.nav-link');
    const productCards = document.querySelectorAll('.product-card');
    
    // Элементы корзины
    const buyButtons = document.querySelectorAll('.buy-btn');
    const cartCountEl = document.getElementById('cart-count');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');

    // Твой правильный номер телефона для заказов
    const MY_PHONE_NUMBER = '996500у996412'; 

    // Массив для хранения выбранных товаров
    let cart = [];

    // --- 1. ФИЛЬТРАЦИЯ ТОВАРОВ ПО КАТЕГОРИЯМ ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            const filterValue = link.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // --- 2. ДОБАВЛЕНИЕ ТОВАРОВ В КОРЗИНУ ---
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'));

            // Добавляем товар в массив
            cart.push({ name, price });

            // Обновляем счетчик в шапке сайта
            cartCountEl.textContent = cart.length;

            // Визуальный эффект на кнопке
            button.textContent = 'Добавлено! ✓';
            button.style.backgroundColor = '#d4af37';
            button.style.color = '#000';
            
            setTimeout(() => {
                button.textContent = 'В корзину';
                button.style.backgroundColor = 'transparent';
                button.style.color = '#d4af37';
            }, 800);
        });
    });

    // --- 3. ОТКРЫТИЕ И ЗАКРЫТИЕ ОКНА КОРЗИНЫ ---
    openCartBtn.addEventListener('click', () => {
        renderCart(); // Перерисовываем корзину перед показом
        cartModal.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Закрытие при клике на темный фон вокруг окна
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // --- 4. ОТОБРАЖЕНИЕ ТОВАРОВ В КОРЗИНЕ ---
    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Очищаем старый список
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-text">Корзина пока пуста...</p>';
            totalPriceEl.textContent = '0';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            total += item.price;
            
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-price">${item.price.toLocaleString()} сом</span>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        // Выводим общую сумму
        totalPriceEl.textContent = total.toLocaleString();
    }

    // --- 5. ОТПРАВКА ЗАКАЗА В WHATSAPP (Переделано на стандартные кавычки) ---
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Чтобы страница не перезагружалась

        if (cart.length === 0) {
            alert('Добавьте хотя бы один товар в корзину!');
            return;
        }

        const clientName = document.getElementById('client-name').value;
        const clientPhone = document.getElementById('client-phone').value;

        // Собираем текст сообщения через обычные плюсы и кавычки — так надежнее
        let message = 'Здравствуйте! Новый заказ с сайта CHNASS GOLD:\n\n' +
                      '👤 Клиент: ' + clientName + '\n' +
                      '📞 Телефон: ' + clientPhone + '\n\n' +
                      '📦 Список товаров:\n';
        
        cart.forEach((item, index) => {
            message += (index + 1) + '. ' + item.name + ' — ' + item.price.toLocaleString() + ' сом\n';
        });
        
        message += '\n💵 Итоговая сумма: ' + totalPriceEl.textContent + ' сом';

        // Кодируем текст для безопасной передачи в ссылку
        const encodedMessage = encodeURIComponent(message);

        // Собираем ссылку на Ватсап
        const whatsappUrl = 'https://wa.me/' + MY_PHONE_NUMBER + '?text=' + encodedMessage;

        // Открываем чат
        window.open(whatsappUrl, '_blank');

        // Очищаем корзину после отправки
        cart = [];
        cartCountEl.textContent = '0';
        checkoutForm.reset();
        cartModal.classList.remove('active');
    });
});