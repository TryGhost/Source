/**
 * Search Form Handler
 * Handles URL query parameters and sets search form initial values
 */
(function() {
    'use strict';

    /**
     * Get URL query parameter value
     * @param {string} name - Parameter name
     * @returns {string|null} Parameter value or null if not found
     */
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * Get all URL query parameter values for a given name
     * @param {string} name - Parameter name
     * @returns {string[]} Array of parameter values
    */
    function getQueryParams(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.getAll(name);
    }

    /**
     * Set search form value from URL query parameter
     */
    function setSearchFormValue() {
        const searchQuery = getQueryParam('q');
        const searchInput = document.querySelector('#search-form-input');
        const hiddenInput = document.querySelector('#hidden-q');

        if (searchQuery) {
            const decodedQuery = decodeURIComponent(searchQuery);

            // Set header search form value
            if (searchInput) {
                searchInput.value = decodedQuery;
            }

            // Set hidden input value for search results form
            if (hiddenInput) {
                hiddenInput.value = decodedQuery;
            }
        }
    }

    /**
     * Set author checkboxes based on URL query parameters
     */
    function setAuthorCheckboxes() {
        const authorParams = getQueryParams('authors');

        if (authorParams.length > 0) {
            // Get all author checkboxes
            const checkboxes = document.querySelectorAll('input[name="authors"]');

            checkboxes.forEach(checkbox => {
                // Check if this checkbox's value is in the URL parameters
                if (authorParams.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    }

    /**
     * Initialize search form functionality
     */
    function init() {
        // Set initial value from URL query parameter
        setSearchFormValue();

        // Set author checkboxes from URL query parameters
        setAuthorCheckboxes();

        // Scroll behavior for the sticky button
        const stickyBtn = document.querySelector('.search_results__sticky_btn');
        const navbar = document.querySelector('.search_results__page');
        if (stickyBtn && navbar) {
            stickyBtn.addEventListener('click', function() {
                navbar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
