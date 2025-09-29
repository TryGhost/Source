/**
 * Header Functionality
 * Handles header animations and behavior for desktop only
 */

/* global window, document */

(function () {
    'use strict';

    // Check if mobile (768px or less)
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Header slide animation
    function initHeaderAnimation() {
        // Only run on desktop
        if (isMobile()) {
            return;
        }

        const header = document.querySelector('.header');
        if (!header) {
            return;
        }

        // Trigger animation after a short delay
        setTimeout(function () {
            header.classList.add('header-loaded');
        }, 300);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderAnimation);
    } else {
        initHeaderAnimation();
    }

    // Re-check on resize
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            const header = document.querySelector('.header');
            if (header && !isMobile()) {
                // Ensure header is visible on desktop after resize
                header.classList.add('header-loaded');
            }
        }, 250);
    });
})();