/**
 * Mobile menu toggle functionality
 * Handles the fullscreen mobile menu opening and closing
 */
(function () {
    const toggleButton = document.querySelector('.header-mobile-toggle');
    const toggleIcon = toggleButton ? toggleButton.querySelector('img') : null;
    const fullscreenMenu = document.querySelector('.header-fullscreen-menu');
    const body = document.body;

    if (!toggleButton || !fullscreenMenu || !toggleIcon) {
        return;
    }

    /**
     * Toggles the mobile menu open/closed state
     */
    function toggleMenu() {
        const isOpen = fullscreenMenu.classList.contains('is-open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Opens the mobile menu
     */
    function openMenu() {
        fullscreenMenu.classList.add('is-open');
        fullscreenMenu.setAttribute('aria-hidden', 'false');
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleButton.setAttribute('aria-label', 'メニューを閉じる');
        toggleIcon.src = toggleIcon.src.replace('menu.svg', 'close.svg');
        body.style.overflow = 'hidden';
    }

    /**
     * Closes the mobile menu
     */
    function closeMenu() {
        fullscreenMenu.classList.remove('is-open');
        fullscreenMenu.setAttribute('aria-hidden', 'true');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-label', 'メニューを開く');
        toggleIcon.src = toggleIcon.src.replace('close.svg', 'menu.svg');
        body.style.overflow = '';
    }

    // Event listeners
    toggleButton.addEventListener('click', toggleMenu);
})();
