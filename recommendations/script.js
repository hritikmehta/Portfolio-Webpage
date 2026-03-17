/* ============================================
   Page 2 — Recommendations — Script
   Category filtering + micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {

    const filtersContainer = document.getElementById('category-filters');
    const productsContainer = document.getElementById('products-grid');

    // ✏️ EDIT HERE: PASTE YOUR WEBSCRIPT URL FROM SHEETS_SETUP.md HERE 
    const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwz7cD2YP8sos66NVwCZxWImb8pNqZWmzbdL5R6Aq9j55Wb0SUpSeGuykFh-4TTtAK-/exec'; // Replace with "https://script.google.com/macros/..."

    try {
        // Show Skeleton loaders initially
        renderSkeletons(6);

        // Fetch data
        const res = await fetch(SHEETS_URL);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        let currentCategory = 'all';

        // 1. Render Categories
        renderFilters(data.categories);

        // 2. Render Products
        renderProducts(data.products, currentCategory);

        // 3. Attach Events
        attachEvents(data.products);

    } catch (err) {
        console.error('Error loading recommendations:', err);
        productsContainer.innerHTML = '<p style="text-align:center;">Failed to load recommendations.</p>';
    }

    function renderSkeletons(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
            <div class="product-card skeleton-card">
                <div class="product-card__image-wrap">
                    <div class="skeleton-img"></div>
                </div>
                <div class="product-card__body">
                    <div class="skeleton skeleton-text short"></div>
                    <div class="skeleton skeleton-text title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                </div>
            </div>`;
        }
        productsContainer.innerHTML = html;
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
            
            // Auto-convert standard Google Drive URLs to direct image links
            let imageUrl = product.image;
            if (imageUrl) {
                // Handle both "file/d/ID/view" and "uc?export=view&id=ID" link formats
                let fileId = null;
                if (imageUrl.includes('drive.google.com/file/d/')) {
                    const match = imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) fileId = match[1];
                } else if (imageUrl.includes('drive.google.com/uc')) {
                    const match = imageUrl.match(/id=([a-zA-Z0-9_-]+)/);
                    if (match && match[1]) fileId = match[1];
                }

                if (fileId) {
                    // This is Google's unblocked global CDN endpoint for Drive images
                    imageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                }
            }

            if (imageUrl) {
                imageHtml = `<img src="${imageUrl}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">`;
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
