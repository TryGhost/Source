/**
 * Magazine Dropdown Widget
 * Handles category navigation and post count calculation for magazine dropdown
 */
(function() {
    'use strict';

    function initMagazineDropdown(dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            return;
        }

        // Calculate and display total post counts for parent categories
        const parentCategories = {};
        const options = dropdown.options;
        let currentParent = null;

        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const text = option.text;

            // Skip the first option (placeholder)
            if (i === 0) {
                continue;
            }

            // Check if this is a parent category (not indented)
            if (text && !text.startsWith('\u00A0')) {
                currentParent = option;
                parentCategories[i] = { element: option, total: 0, originalText: text };
            }
            // Check if this is a child category (indented with &nbsp;)
            else if (text && text.startsWith('\u00A0') && currentParent) {
                // Extract post count from text like "  雑誌名 (123)"
                const match = text.match(/\((\d+)\)/);
                if (match) {
                    const count = parseInt(match[1], 10);
                    // Find the parent in parentCategories
                    for (const parentIndex in parentCategories) {
                        if (parentCategories[parentIndex].element === currentParent) {
                            parentCategories[parentIndex].total += count;
                            break;
                        }
                    }
                }
            }
        }

        // Update parent category text with total counts
        for (const index in parentCategories) {
            const parent = parentCategories[index];
            parent.element.text = parent.originalText + ' (' + parent.total + ')';
        }

        // Handle dropdown change
        dropdown.onchange = function() {
            const selectedUrl = this.options[this.selectedIndex].value;
            if (selectedUrl) {
                window.location.href = selectedUrl;
            }
        };
    }

    // Initialize all magazine dropdowns on page load
    function init() {
        // Find all magazine dropdown widgets
        const dropdowns = document.querySelectorAll('.widget-categories select.postform');
        dropdowns.forEach(function(dropdown) {
            if (dropdown.id) {
                initMagazineDropdown(dropdown.id);
            }
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
