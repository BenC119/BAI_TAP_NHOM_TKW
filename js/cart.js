class CartManager {
    constructor() {
        this.initializeEventListeners();
        this.updateCartDisplay();
    }

    initializeEventListeners() {
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuantityChange(e));
        });

        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRemoveItem(e));
        });

        document.querySelector('.btn-apply-promo')?.addEventListener('click', () => {
            this.applyPromo();
        });

        window.addEventListener('scroll', () => this.updateHeader());

        this.initializeMobileMenu();
        this.initializeUserProfile();
    }

    handleQuantityChange(e) {
        const btn = e.target.closest('.qty-btn');
        if (!btn) return;

        const input = btn.parentElement.querySelector('.qty-input');
        let value = parseInt(input.value) || 1;

        if (btn.classList.contains('qty-minus')) {
            value = Math.max(1, value - 1);
        } else if (btn.classList.contains('qty-plus')) {
            value = value + 1;
        }

        input.value = value;
        this.updateCartDisplay();
    }

    handleRemoveItem(e) {
        const btn = e.target.closest('.btn-remove');
        const item = btn.closest('.cart-item');

        item.style.animation = 'slideOut 0.4s ease-out forwards';
        setTimeout(() => {
            item.remove();
            this.updateCartDisplay();
            this.showToast('Sản phẩm đã được xoá khỏi giỏ hàng');
        }, 400);
    }

    updateCartDisplay() {
        const items = document.querySelectorAll('.cart-item');
        const itemsCount = document.querySelector('.items-count');

        if (itemsCount) {
            itemsCount.textContent = `${items.length} sản phẩm`;
        }

        this.updateTotals();
    }

    updateTotals() {
        let subtotal = 0;

        document.querySelectorAll('.cart-item').forEach(item => {
            const priceText = item.querySelector('.original-price').textContent;
            const price = this.parsePrice(priceText);
            const quantity = parseInt(item.querySelector('.qty-input').value) || 1;
            const itemTotal = price * quantity;

            item.querySelector('.final-price').textContent = this.formatPrice(itemTotal);
            subtotal += itemTotal;
        });

        const shippingFee = 50000000;
        const tax = subtotal * 0.1;
        const total = subtotal + shippingFee + tax;

        const summaryRows = document.querySelectorAll('.summary-row');
        if (summaryRows.length >= 3) {
            summaryRows[0].querySelector('.price').textContent = this.formatPrice(subtotal);
            summaryRows[1].querySelector('.price').textContent = this.formatPrice(shippingFee);
            summaryRows[2].querySelector('.price').textContent = this.formatPrice(tax);
        }

        const totalRow = document.querySelector('.summary-row.total');
        if (totalRow) {
            totalRow.querySelector('.price').textContent = this.formatPrice(total);
        }
    }

    parsePrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(price).replace('₫', 'đ').trim();
    }

    applyPromo() {
        const input = document.querySelector('.promo-input');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            this.showToast('Vui lòng nhập mã khuyến mãi', 'error');
            return;
        }

        const promos = {
            'VANGUARD10': 0.1,
            'LUXURY20': 0.2,
            'VIP30': 0.3,
        };

        if (promos[code]) {
            const discount = promos[code];
            this.showToast(`Mã ${code} đã được áp dụng! Giảm ${discount * 100}%`, 'success');
            input.value = '';
        } else {
            this.showToast('Mã khuyến mãi không hợp lệ', 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} toast-icon"></i>
                <div class="toast-message">
                    <p>${message}</p>
                </div>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    updateHeader() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    initializeMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        }
    }

    initializeUserProfile() {
        if (typeof auth !== 'undefined') {
            auth.updateHeaderDisplay();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CartManager();

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }

        .toast {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: var(--card-bg);
            border-left: 5px solid var(--accent-gold);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            z-index: 9999;
            transform: translateX(120%);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .toast.show {
            transform: translateX(0);
        }

        .toast.error {
            border-left-color: #ff4757;
        }

        .toast-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .toast-icon {
            font-size: 24px;
            color: var(--accent-gold);
        }

        .toast.error .toast-icon {
            color: #ff4757;
        }

        .toast-message {
            color: var(--text-light);
        }

        .toast-message p {
            margin: 0;
        }

        .toast-close {
            background: none;
            border: none;
            color: #888;
            font-size: 18px;
            cursor: pointer;
            margin-left: 15px;
            transition: color 0.3s ease;
        }

        .toast-close:hover {
            color: var(--text-light);
        }

        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
            background-color: var(--accent-gold);
        }

        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
            background-color: var(--accent-gold);
        }
    `;
    document.head.appendChild(style);
});
