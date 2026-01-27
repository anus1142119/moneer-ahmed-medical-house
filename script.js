/* ============================================================================
   THE HOUSE OF NOORA - GOVERNANCE ENGINE
   Meticulously crafted JavaScript for theme, navigation, and filtering
   Zero dependencies, maximum performance, complete browser compatibility
   ============================================================================ */

(function() {
  'use strict';

  // ============================================================================
  // INITIALIZATION - Runs when DOM is ready
  // ============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Navigation.init();
    MobileMenu.init();
    
    // Initialize journal filters only if filter bar exists
    if (document.querySelector('.filter-bar')) {
      JournalFilters.init();
    }
  });

  // ============================================================================
  // THEME MANAGER - Persistent dark/light mode with localStorage
  // ============================================================================
  const ThemeManager = {
    STORAGE_KEY: 'house_theme',

    init() {
      // Theme already applied by inline script in <head>
      // Just need to update icons based on current state
      this.updateAllIcons();
      
      // Listen for system theme changes
      this.watchSystemTheme();
    },

    toggle() {
      // Toggle on html element (matching inline script)
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      
      // Persist theme choice to localStorage
      localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
      
      // Update all theme toggle icons
      this.updateAllIcons();
    },

    watchSystemTheme() {
      // Watch for OS-level theme changes (if user hasn't set preference)
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          if (e.matches) {
            document.documentElement.classList.add('dark-mode');
          } else {
            document.documentElement.classList.remove('dark-mode');
          }
          this.updateAllIcons();
        }
      });
    },

    updateAllIcons() {
      const isDark = document.documentElement.classList.contains('dark-mode');
      const iconHTML = isDark ? this.getSunIcon() : this.getMoonIcon();
      const ariaLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      
      // Update ALL theme buttons (desktop + mobile)
      document.querySelectorAll('.theme-btn-icon').forEach(btn => {
        btn.innerHTML = iconHTML;
        btn.setAttribute('aria-label', ariaLabel);
      });
    },

    getMoonIcon() {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    },

    getSunIcon() {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  };

  // ============================================================================
  // NAVIGATION - Active page highlighting
  // ============================================================================
  const Navigation = {
    init() {
      const currentPage = this.getCurrentPage();
      const links = document.querySelectorAll('.desktop-nav a, .mobile-nav-overlay a');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active-page');
        
        if (href === currentPage) {
          link.classList.add('active-page');
          link.setAttribute('aria-current', 'page');
        }
      });
    },

    getCurrentPage() {
      const path = window.location.pathname;
      let page = path.split('/').pop();
      return page === '' ? 'index.html' : page;
    }
  };

  // ============================================================================
  // MOBILE MENU - Overlay navigation for mobile devices
  // ============================================================================
  const MobileMenu = {
    overlay: null,
    menuBtn: null,
    isOpen: false,

    init() {
      this.overlay = document.getElementById('mobileMenu');
      this.menuBtn = document.querySelector('.mobile-menu-btn');
      
      if (!this.overlay) return;
      
      // Set initial ARIA state
      if (this.menuBtn) {
        this.menuBtn.setAttribute('aria-expanded', 'false');
      }

      // Close menu when clicking navigation links
      const links = this.overlay.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => this.close());
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Prevent body scroll when menu is open (iOS fix)
      this.preventBackgroundScroll();
    },

    toggle() {
      if (!this.overlay) return;
      this.isOpen ? this.close() : this.open();
    },

    open() {
      this.isOpen = true;
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Update ARIA state
      if (this.menuBtn) {
        this.menuBtn.setAttribute('aria-expanded', 'true');
      }

      // Focus trap - focus first link
      const firstLink = this.overlay.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    },

    close() {
      this.isOpen = false;
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Update ARIA state
      if (this.menuBtn) {
        this.menuBtn.setAttribute('aria-expanded', 'false');
      }

      // Return focus to menu button
      if (this.menuBtn) {
        this.menuBtn.focus();
      }
    },

    preventBackgroundScroll() {
      // Prevent iOS Safari from scrolling background when menu is open
      if (this.overlay) {
        this.overlay.addEventListener('touchmove', (e) => {
          if (this.isOpen && e.target === this.overlay) {
            e.preventDefault();
          }
        }, { passive: false });
      }
    }
  };

  // ============================================================================
  // JOURNAL FILTERS - Category-based article filtering
  // ============================================================================
  const JournalFilters = {
    currentFilter: 'all',

    init() {
      // Show all items by default
      this.filterSelection('all');
    },

    filterSelection(category) {
      this.currentFilter = category;
      const items = document.querySelectorAll('.filterDiv');
      
      // Show/hide items based on category
      items.forEach(item => {
        // Use display property for instant visibility toggle
        if (category === 'all' || item.classList.contains(category)) {
          item.style.display = 'block';
          item.classList.add('show');
        } else {
          item.style.display = 'none';
          item.classList.remove('show');
        }
      });

      // Update active button state
      this.updateActiveButton(category);
      
      // Announce filter change to screen readers
      this.announceFilterChange(category);
    },

    updateActiveButton(category) {
      const buttons = document.querySelectorAll('.filter-btn');
      
      buttons.forEach(btn => {
        btn.classList.remove('active');
        const onclick = btn.getAttribute('onclick');
        
        if (onclick && onclick.includes(`'${category}'`)) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.setAttribute('aria-pressed', 'false');
        }
      });
    },

    announceFilterChange(category) {
      // Create live region for screen reader announcement
      let announcer = document.getElementById('filter-announcer');
      
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'filter-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
      }

      const visibleCount = document.querySelectorAll('.filterDiv.show').length;
      const message = category === 'all' 
        ? `Showing all ${visibleCount} manuscripts`
        : `Showing ${visibleCount} ${category} manuscripts`;
      
      announcer.textContent = message;
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  // Debounce function for performance optimization
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================================================
  // GLOBAL FUNCTIONS - Exposed for inline onclick handlers
  // ============================================================================
  window.toggleTheme = () => ThemeManager.toggle();
  window.toggleMobileMenu = () => MobileMenu.toggle();
  window.filterSelection = (category) => JournalFilters.filterSelection(category);

  // ============================================================================
  // PERFORMANCE MONITORING (Optional - for development)
  // ============================================================================
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Log performance metrics in development
    window.addEventListener('load', () => {
      if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        
        console.log('🏆 Performance Metrics:');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Server Response: ${connectTime}ms`);
        console.log(`DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
      }
    });
  }

})();
