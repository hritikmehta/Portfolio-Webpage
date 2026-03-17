/* ============================================
   Page 1 — Links / Bio Page — Script
   Subtle interactivity & polish
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Parallax glow on mouse/touch move ──
    const container = document.querySelector('.container');
    const glowEl = container;

    function updateGlow(x, y) {
        const rect = container.getBoundingClientRect();
        const cx = ((x - rect.left) / rect.width) * 100;
        const cy = ((y - rect.top) / rect.height) * 100;
        glowEl.style.setProperty('--glow-x', `${cx}%`);
        glowEl.style.setProperty('--glow-y', `${cy}%`);
    }

    document.addEventListener('mousemove', (e) => updateGlow(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        updateGlow(t.clientX, t.clientY);
    }, { passive: true });


    // ── Haptic-like press feedback on chips ──
    const chips = document.querySelectorAll('.link-chip');
    chips.forEach(chip => {
        chip.addEventListener('mousedown', () => {
            chip.style.transition = 'transform 0.1s ease';
            chip.style.transform = 'scale(0.97)';
        });
        chip.addEventListener('mouseup', () => {
            chip.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            chip.style.transform = 'scale(1)';
        });
        chip.addEventListener('mouseleave', () => {
            chip.style.transform = '';
            chip.style.transition = '';
        });
    });

});
