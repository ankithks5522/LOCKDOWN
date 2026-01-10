// Dark Mode Toggle Functionality
(function() {
    'use strict';
    
    // Check for saved theme preference or default to light mode
    const getTheme = () => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
            return savedTheme === 'true';
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    };
    
    // Apply theme
    const applyTheme = (isDark) => {
        const body = document.body;
        const toggle = document.getElementById('darkModeToggle');
        const toggleIcon = toggle ? toggle.querySelector('.toggle-icon') : null;
        
        if (isDark) {
            body.classList.add('dark-mode');
            if (toggleIcon) {
                toggleIcon.textContent = '☀️';
                toggleIcon.setAttribute('aria-label', 'Switch to light mode');
            }
            if (toggle) {
                toggle.setAttribute('aria-label', 'Switch to light mode');
            }
        } else {
            body.classList.remove('dark-mode');
            if (toggleIcon) {
                toggleIcon.textContent = '🌙';
                toggleIcon.setAttribute('aria-label', 'Switch to dark mode');
            }
            if (toggle) {
                toggle.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
        
        // Save preference
        localStorage.setItem('darkMode', isDark.toString());
    };
    
    // Initialize theme on page load
    const initTheme = () => {
        const isDark = getTheme();
        applyTheme(isDark);
    };
    
    // Toggle theme
    const toggleTheme = () => {
        const body = document.body;
        const isDark = body.classList.contains('dark-mode');
        applyTheme(!isDark);
        
        // Add animation effect
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.style.transform = 'scale(0.9) rotate(180deg)';
            setTimeout(() => {
                toggle.style.transform = '';
            }, 300);
        }
    };
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
    
    // Set up toggle button event listener
    document.addEventListener('DOMContentLoaded', function() {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
            
            // Add keyboard support
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
        }
    });
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            // Only apply system preference if user hasn't manually set a preference
            if (localStorage.getItem('darkMode') === null) {
                applyTheme(e.matches);
            }
        });
    }
    
    // Export for use in other scripts if needed
    window.darkMode = {
        toggle: toggleTheme,
        isDark: () => document.body.classList.contains('dark-mode'),
        setTheme: applyTheme
    };
})();
