/**
 * cars.js — Bộ sưu tập xe
 * Layout: Left sidebar (Brand → Model) + Right hero panel
 * Tính năng: Filter theo hãng, fade transition, modal chi tiết,
 *             scroll wheel / keyboard navigation
 */

document.addEventListener('DOMContentLoaded', async () => {

    // ── 1. FETCH DATA ──────────────────────────────────────────
    const products   = await db.getProducts();
    const sidebar    = document.getElementById('collectionSidebar');
    const mainArea   = document.getElementById('collectionMain');
    const modal      = document.getElementById('carDetailModal');
    const modalBody  = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const backdrop   = document.getElementById('modalBackdrop');

    if (!products || !products.length) {
        mainArea.innerHTML = `
            <div class="collection-empty">
                <i class="fas fa-car-crash"></i>
                <p>Không có xe nào trong bộ sưu tập.</p>
            </div>`;
        return;
    }

    // ── 2. ICON MAP ────────────────────────────────────────────
    const brandIcons = {
        'Ferrari':     'fas fa-horse',
        'Lamborghini': 'fas fa-bolt',
        'McLaren':     'fas fa-fighter-jet',
        'Porsche':     'fas fa-shield-alt',
        'Bugatti':     'fas fa-crown',
    };

    // ── 3. BUILD SIDEBAR ───────────────────────────────────────
    // Group: brand → [cars]  (bỏ phân loại category)
    const byBrand = {};
    products.forEach(car => {
        if (!byBrand[car.brand]) byBrand[car.brand] = [];
        byBrand[car.brand].push(car);
    });

    let firstCarId = null;

    Object.entries(byBrand).forEach(([brand, cars]) => {
        const brandEl = document.createElement('div');
        brandEl.className = 'sb-brand';
        brandEl.innerHTML = `<div class="sb-brand-label">${brand}</div>`;
        sidebar.appendChild(brandEl);

        cars.forEach(car => {
            if (firstCarId === null) firstCarId = car.id;

            const modelEl = document.createElement('div');
            modelEl.className = 'sb-model-item';
            modelEl.setAttribute('data-car-id', car.id);
            modelEl.setAttribute('data-brand', car.brand);
            modelEl.innerHTML = `<span>${car.name}</span><span class="sb-dot"></span>`;
            modelEl.title = car.name;

            modelEl.addEventListener('mouseenter', () => activatePanel(car.id));
            modelEl.addEventListener('click', () => activatePanel(car.id));

            brandEl.appendChild(modelEl);
        });
    });


    // ── 4. BUILD RIGHT PANELS ──────────────────────────────────
    // Counter + Dots
    const counterTop = document.createElement('div');
    counterTop.className = 'car-panel-counter-top';
    counterTop.innerHTML = `<span class="cnt-cur">1</span> <span style="opacity:.4;">/</span> ${products.length}`;
    mainArea.appendChild(counterTop);

    const dotsCont = document.createElement('div');
    dotsCont.className = 'car-scroll-dots';
    mainArea.appendChild(dotsCont);

    products.forEach((car, idx) => {
        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', minimumFractionDigits: 0
        }).format(car.price);

        const priceRaw = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(car.price);

        // Split name for accent
        const parts = car.name.split(' ');
        const accent = parts[0];
        const rest   = parts.slice(1).join(' ');
        const displayName = `<span class="name-accent">${accent}</span> ${rest}`;



        const panel = document.createElement('div');
        panel.className = 'car-panel';
        panel.id = `panel-${car.id}`;
        panel.dataset.brand = car.brand;
        panel.dataset.idx = idx;

        panel.innerHTML = `
            <div class="car-panel-bg"></div>
            <div class="car-panel-accent-line"></div>

            <div class="car-panel-image-wrap">
                <img src="${car.image}" alt="${car.name}"
                     onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop'">
            </div>

            <div class="car-panel-overlay"></div>
            <div class="car-panel-overlay-bottom"></div>

            <div class="car-panel-text">
                <div class="car-panel-watermark">${car.brand} &middot; ${car.year}</div>
                <div class="car-panel-cat-badge">
                    ${car.category}
                </div>
                <h2 class="car-panel-name">${displayName}</h2>
                <div class="car-panel-engine">${car.year} &middot; ${car.specifications.engine}</div>
                <div class="car-panel-sep"></div>

                <div class="car-panel-specs">
                    <div class="spec-item">
                        <div class="spec-value">${car.specifications.horsepower}</div>
                        <div class="spec-label">Mã lực</div>
                    </div>
                    <div class="spec-div"></div>
                    <div class="spec-item">
                        <div class="spec-value">${car.specifications.topSpeed}</div>
                        <div class="spec-label">km/h max</div>
                    </div>
                    <div class="spec-div"></div>
                    <div class="spec-item">
                        <div class="spec-value">${car.specifications.acceleration.split(' ')[0]}</div>
                        <div class="spec-label">0-100 km/h</div>
                    </div>
                </div>

                <div class="car-panel-cta">
                    <button class="btn-chi-tiet" onclick="openCarModal(${car.id})">
                        Chi tiết <i class="fas fa-arrow-right"></i>
                    </button>
                    <div class="car-panel-sec-links">
                        <button class="car-panel-sec-link" onclick="openCarModal(${car.id})">Cấu hình</button>
                    </div>
                </div>
            </div>

            <div class="car-panel-price-tag">
                <div class="car-panel-price-lbl">Giá tham khảo</div>
                <div class="car-panel-price-val">${formattedPrice}</div>
            </div>
        `;

        mainArea.insertBefore(panel, counterTop);

        // Dot
        const dot = document.createElement('div');
        dot.className = 'scroll-dot';
        dot.setAttribute('data-car-id', car.id);
        dot.addEventListener('click', () => activatePanel(car.id));
        dotsCont.appendChild(dot);
    });

    // ── 5. ACTIVATE PANEL ─────────────────────────────────────
    let currentCarId = firstCarId;

    function activatePanel(carId) {
        document.querySelectorAll('.car-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.sb-model-item').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.scroll-dot').forEach(d => d.classList.remove('active'));

        const panel = document.getElementById(`panel-${carId}`);
        if (panel) {
            panel.classList.add('active');
            const idx = parseInt(panel.dataset.idx);
            counterTop.innerHTML = `<span class="cnt-cur">${idx + 1}</span> <span style="opacity:.4;">/</span> ${products.length}`;
        }

        const modelEl = sidebar.querySelector(`[data-car-id="${carId}"]`);
        if (modelEl) {
            modelEl.classList.add('active');
            modelEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        const dot = dotsCont.querySelector(`[data-car-id="${carId}"]`);
        if (dot) dot.classList.add('active');

        currentCarId = carId;
    }

    if (firstCarId !== null) activatePanel(firstCarId);

    // ── 6. FILTER BAR ─────────────────────────────────────────
    document.querySelectorAll('.cars-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const brand = btn.dataset.brand;

            // Update active state
            document.querySelectorAll('.cars-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide sidebar model items & brand groups
            document.querySelectorAll('.sb-brand').forEach(bgEl => {
                const items = bgEl.querySelectorAll('.sb-model-item');
                const brandName = items[0]?.dataset.brand;
                const show = (brand === 'all' || brandName === brand);
                bgEl.style.display = show ? '' : 'none';
            });

            document.querySelectorAll('.sb-category').forEach(catEl => {
                const visibleBrands = [...catEl.querySelectorAll('.sb-brand')].filter(b => b.style.display !== 'none');
                catEl.style.display = visibleBrands.length ? '' : 'none';
            });

            // Switch to first visible car
            const visibleItems = [...document.querySelectorAll('.sb-model-item')].filter(el => {
                return el.closest('.sb-brand')?.style.display !== 'none';
            });
            if (visibleItems.length) {
                const id = parseInt(visibleItems[0].dataset.carId);
                activatePanel(id);
            }
        });
    });

    // ── 7. NAVIGATE ───────────────────────────────────────────
    function getVisibleProductIds() {
        return [...document.querySelectorAll('.sb-model-item')]
            .filter(el => el.closest('.sb-brand')?.style.display !== 'none')
            .map(el => parseInt(el.dataset.carId));
    }

    function navigateNext() {
        const ids = getVisibleProductIds();
        const cur = ids.indexOf(currentCarId);
        if (ids.length) activatePanel(ids[(cur + 1) % ids.length]);
    }

    function navigatePrev() {
        const ids = getVisibleProductIds();
        const cur = ids.indexOf(currentCarId);
        if (ids.length) activatePanel(ids[(cur - 1 + ids.length) % ids.length]);
    }

    // Keyboard
    document.addEventListener('keydown', e => {
        if (['ArrowDown', 'ArrowRight'].includes(e.key)) navigateNext();
        else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) navigatePrev();
        else if (e.key === 'Escape') closeCarModal();
    });

    // Mouse wheel on right panel
    let wheelCooldown = false;
    mainArea.addEventListener('wheel', e => {
        e.preventDefault();
        if (wheelCooldown) return;
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 650);
        if (e.deltaY > 0) navigateNext(); else navigatePrev();
    }, { passive: false });

    // Touch swipe
    let touchStartY = 0;
    mainArea.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
    mainArea.addEventListener('touchend', e => {
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(delta) > 40) { if (delta > 0) navigateNext(); else navigatePrev(); }
    }, { passive: true });

    // ── 8. MODAL ──────────────────────────────────────────────
    window.openCarModal = function(carId) {
        const car = products.find(p => p.id === carId);
        if (!car) return;

        const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD', minimumFractionDigits: 0
        }).format(car.price);

        modalBody.innerHTML = `
            <img class="modal-hero-img"
                 src="${car.image}" alt="${car.name}"
                 onerror="this.src='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop'">
            <div style="padding:36px 40px 40px;">
                <div class="modal-brand">${car.brand} &middot; ${car.year}</div>
                <h2 class="modal-name">${car.name}</h2>
                <div class="modal-badges">
                    <span class="modal-badge modal-badge-cat">${car.category}</span>
                </div>
                <p class="modal-desc">${car.description}</p>
                <div class="modal-specs-grid">
                    <div class="modal-spec-card">
                        <div class="modal-spec-icon"><i class="fas fa-tachometer-alt"></i></div>
                        <div>
                            <div class="modal-spec-label">Tốc độ tối đa</div>
                            <div class="modal-spec-value">${car.specifications.topSpeed} km/h</div>
                        </div>
                    </div>
                    <div class="modal-spec-card">
                        <div class="modal-spec-icon"><i class="fas fa-horse-head"></i></div>
                        <div>
                            <div class="modal-spec-label">Công suất</div>
                            <div class="modal-spec-value">${car.specifications.horsepower} HP</div>
                        </div>
                    </div>
                    <div class="modal-spec-card">
                        <div class="modal-spec-icon"><i class="fas fa-stopwatch"></i></div>
                        <div>
                            <div class="modal-spec-label">Tăng tốc 0–100</div>
                            <div class="modal-spec-value">${car.specifications.acceleration}</div>
                        </div>
                    </div>
                    <div class="modal-spec-card">
                        <div class="modal-spec-icon"><i class="fas fa-cogs"></i></div>
                        <div>
                            <div class="modal-spec-label">Động cơ</div>
                            <div class="modal-spec-value">${car.specifications.engine}</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div>
                        <div class="modal-price-label">Giá bán lẻ đề xuất</div>
                        <div class="modal-price">${formattedPrice}</div>
                    </div>
                </div>
            </div>`;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    window.closeCarModal = function() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeCarModal);
    if (backdrop)   backdrop.addEventListener('click', closeCarModal);

});
