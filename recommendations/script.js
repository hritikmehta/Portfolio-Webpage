/* ============================================
   Page 2 — Recommendations — Script
   Category filtering + micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    const filterButtons = document.querySelectorAll('.filter-pill');
    const productCards = document.querySelectorAll('.product-card');

    // ── Category Filter ──
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Update active pill
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards with animation
            productCards.forEach((card, i) => {
                const cardCat = card.dataset.category;
                const match = category === 'all' || cardCat === category;

                if (match) {
                    card.classList.remove('hidden');
                    // Re-trigger entrance animation
                    card.style.animation = 'none';
                    card.offsetHeight; // Force reflow
                    card.style.animation = `card-in 0.4s ease ${i * 0.06}s forwards`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ── Subtle card press feedback ──
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

});
