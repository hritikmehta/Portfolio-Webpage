/* ============================================
   Page 2 — Recommendations — Script
   Category filtering + micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {

    const filtersContainer = document.getElementById('category-filters');
    const productsContainer = document.getElementById('products-grid');

    try {
        const res = await fetch('/recommendations/data.json');
        const data = await res.json();
        
        let currentCategory = 'all';

        // 1. Render Categories
        renderFilters(data.categories);
        
        // 2. Render Products
        renderProducts(data.products, currentCategory);

        // 3. Attach Events
        attachEvents(data.products);

    } catch(err) {
        console.error('Error loading recommendations:', err);
        productsContainer.innerHTML = '<p style="text-align:center;">Failed to load recommendations.</p>';
    }

    function renderFilters(categories) {
        let html = '';
        categories.forEach((cat, index) => {
            const activeClass = index === 0 ? 'active' : '';
            html += `<button class="filter-pill ${activeClass}" data-category="${cat.id}" id="filter-${cat.id}">${cat.label}</button>`;
        });
        filtersContainer.innerHTML = html;
    }

    function renderProducts(products, filterCat) {
        let html = '';
        
        const filtered = filterCat === 'all' 
            ? products 
            : products.filter(p => p.category === filterCat);

        filtered.forEach((product, i) => {
            let imageHtml = '';
            if (product.image) {
                imageHtml = `<img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">`;
            } else if (product.placeholder) {
                imageHtml = `
                    <div class="product-card__placeholder-img" style="background: linear-gradient(135deg, ${product.placeholder.bg1}, ${product.placeholder.bg2});">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${product.placeholder.stroke}" stroke-width="1.5">
                            ${product.placeholder.svgContent}
                        </svg>
                    </div>`;
            }

            html += `
            <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="product-card" data-category="${product.category}" id="${product.id}" style="animation-delay: ${0.25 + (i * 0.07)}s">
                <div class="product-card__image-wrap">
                    ${imageHtml}
                </div>
                <div class="product-card__body">
                    <span class="product-card__category">${product.categoryLabel}</span>
                    <h2 class="product-card__name">${product.name}</h2>
                    <p class="product-card__desc">${product.description}</p>
                </div>
            </a>
            `;
        });
        productsContainer.innerHTML = html;
    }

    function attachEvents(allProducts) {
        const filterButtons = document.querySelectorAll('.filter-pill');
        const productsGrid = document.getElementById('products-grid');

        // category click
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Re-render instead of hiding/showing purely visually, maintaining animation
                renderProducts(allProducts, category);
                attachHoverEvents();
            });
        });

        attachHoverEvents();
    }

    function attachHoverEvents() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mousedown', () => {
                card.style.transition = 'transform 0.1s ease';
                card.style.transform = 'scale(0.98)';
            });
            card.addEventListener('mouseup', () => {
                card.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.transform = '';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = '';
            });
        });
    }

});
