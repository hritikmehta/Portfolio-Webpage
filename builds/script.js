document.addEventListener('DOMContentLoaded', async () => {

    const filtersContainer = document.getElementById('category-filters');
    const productsContainer = document.getElementById('products-grid');

    try {
        const res = await fetch('/builds/data.json');
        if (!res.ok) throw new Error('Failed to fetch builds data');
        const data = await res.json();

        let currentCategory = 'all';

        renderFilters(data.categories);
        renderBuilds(data.builds, currentCategory);
        attachEvents(data.builds);

    } catch (err) {
        console.error('Error loading builds:', err);
        productsContainer.innerHTML = '<p style="text-align:center;color:#888;">Failed to load builds.</p>';
    }

    function renderFilters(categories) {
        const present = new Set();
        filtersContainer.innerHTML = '';
        categories.forEach((cat, i) => {
            const btn = document.createElement('button');
            btn.className = 'filter-pill' + (i === 0 ? ' active' : '');
            btn.dataset.category = cat.id;
            btn.textContent = cat.label;
            filtersContainer.appendChild(btn);
        });
    }

    function renderBuilds(builds, filterCat) {
        const filtered = filterCat === 'all' ? builds : builds.filter(b => b.category === filterCat);

        productsContainer.innerHTML = filtered.map((build, i) => `
            <a href="${build.link}" target="_blank" rel="noopener noreferrer"
               class="product-card" data-category="${build.category}" id="${build.id}"
               style="animation-delay:${0.25 + i * 0.07}s">
                <div class="product-card__image-wrap">
                    <img src="${build.image}" alt="${build.name}" style="width:100%;height:100%;object-fit:cover;">
                </div>
                <div class="product-card__body">
                    <span class="product-card__category">${build.categoryLabel}</span>
                    <h2 class="product-card__name">${build.name}</h2>
                    <p class="product-card__desc">${build.description}</p>
                </div>
            </a>
        `).join('');

        attachHoverEvents();
    }

    function attachEvents(allBuilds) {
        filtersContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-pill');
            if (!btn) return;
            document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBuilds(allBuilds, btn.dataset.category);
        });
    }

    function attachHoverEvents() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mousedown', () => {
                card.style.transition = 'transform 0.1s ease';
                card.style.transform = 'scale(0.98)';
            });
            card.addEventListener('mouseup', () => {
                card.style.transition = 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)';
                card.style.transform = '';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = '';
            });
        });
    }

});
