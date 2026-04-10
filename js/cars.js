document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch products
    const products = await db.getProducts();

    const grid = document.getElementById('cars-grid');
    const filters = document.querySelectorAll('#cars-filters .filter-btn');

    // Render initially
    renderCars(products);

    // 2. Setup filter buttons
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            // Get filter term
            const filterTerm = btn.getAttribute('data-filter');

            // Render filtered
            if (filterTerm === 'all') {
                renderCars(products);
            } else {
                const filtered = products.filter(p => p.category === filterTerm);
                renderCars(filtered);
            }
        });
    });

    /**
     * Render the cars grid
     * @param {Array} carsList 
     */
    function renderCars(carsList) {
        if (!grid) return;
        
        grid.innerHTML = ''; // clear current
        
        if (!carsList || carsList.length === 0) {
            grid.innerHTML = '<p class="no-results" style="color:#aaa; text-align:center; width:100%; grid-column:1/-1;">Không tìm thấy mẫu xe phù hợp.</p>';
            return;
        }

        carsList.forEach(car => {
            // format price
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
            }).format(car.price);

            const stockBadge = !car.inStock
                ? `<span class="car-stock-badge out-of-stock">HẾT HÀNG</span>`
                : '';

            const card = document.createElement('div');
            card.className = 'car-card fade-in';
            card.innerHTML = `
                <div class="car-img-wrapper">
                    <img src="${car.image}" alt="${car.name}" onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop'">
                    <span class="car-category-badge">${car.category}</span>
                    ${stockBadge}
                </div>
                <div class="car-content">
                    <div class="car-brand">${car.brand}</div>
                    <h3 class="car-name">${car.name}</h3>
                    <div class="car-specs">
                        <div class="spec-item">
                            <i class="fas fa-tachometer-alt"></i> ${car.specifications.topSpeed} km/h
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-horse-head"></i> ${car.specifications.horsepower} HP
                        </div>
                    </div>
                    <div class="car-specs">
                        <div class="spec-item">
                            <i class="fas fa-stopwatch"></i> ${car.specifications.acceleration}
                        </div>
                        <div class="spec-item">
                            <i class="fas fa-cogs"></i> ${car.specifications.engine}
                        </div>
                    </div>
                    <div class="car-price">${formattedPrice}</div>
                    <div class="car-actions">
                        <button class="btn-primary view-details-btn" onclick="viewDetails(${car.id})" style="padding: 10px 15px; font-size: 0.85rem;">CHI TIẾT</button>
                        <button class="btn-icon add-cart-btn" onclick="addToCart(${car.id})" ${!car.inStock ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
});

// Add a dynamic toast container if it doesn't exist so helper can use it
window.ensureToastExists = function() {
    if (!document.getElementById('toast-notification')) {
        const toastHTML = `
            <div id="toast-notification" class="toast hidden">
                <div class="toast-content">
                    <i class="fas fa-check-circle toast-icon"></i>
                    <div class="toast-message">
                        <h4>Thông báo</h4>
                        <p id="toast-text"></p>
                    </div>
                </div>
                <button class="toast-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toastHTML);
    }
}

function viewDetails(id) {
    // In a real app this redirects to product detail.
    window.ensureToastExists();
    showToast('Đang tải thông tin chi tiết xe...', 'success');
}

function addToCart(id) {
    window.ensureToastExists();
    if (!auth.isLoggedIn()) {
        showToast('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }
    showToast('Đã thêm sản phẩm vào giỏ hàng!', 'success');
}
