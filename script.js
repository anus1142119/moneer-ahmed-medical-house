/* ============================================================================
   THE HOUSE OF NOORA - GOVERNANCE ENGINE
   Meticulously crafted JavaScript for theme, navigation, and filtering
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
      // Check localStorage first, then system preference
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      this.updateAllIcons();
    },

    toggle() {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      
      // Persist theme choice to localStorage
      localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
      
      this.updateAllIcons();
    },

    updateAllIcons() {
      const isDark = document.body.classList.contains('dark-mode');
      const iconHTML = isDark ? this.getSunIcon() : this.getMoonIcon();
      
      // Update ALL theme buttons (desktop + mobile)
      document.querySelectorAll('.theme-btn-icon').forEach(btn => {
        btn.innerHTML = iconHTML;
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
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

    init() {
      this.overlay = document.getElementById('mobileMenu');
      this.menuBtn = document.querySelector('.mobile-menu-btn');
      
      if (this.menuBtn) {
        this.menuBtn.setAttribute('aria-expanded', 'false');
      }

      // Close menu when clicking navigation links
      if (this.overlay) {
        const links = this.overlay.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('click', () => this.close());
        });
      }
    },

    toggle() {
      if (!this.overlay) return;
      
      const isActive = this.overlay.classList.contains('active');
      isActive ? this.close() : this.open();
    },

    open() {
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      if (this.menuBtn) {
        this.menuBtn.setAttribute('aria-expanded', 'true');
      }
    },

    close() {
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
      
      if (this.menuBtn) {
        this.menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  };

  // ============================================================================
  // JOURNAL FILTERS - Category-based article filtering
  // ============================================================================
  const JournalFilters = {
    init() {
      // Show all items by default
      this.filterSelection('all');
    },

    filterSelection(category) {
      const items = document.querySelectorAll('.filterDiv');
      const searchClass = category === 'all' ? '' : category;
      
      // Show/hide items based on category
      items.forEach(item => {
        this.removeClass(item, 'show');
        
        if (searchClass === '' || item.className.indexOf(searchClass) > -1) {
          this.addClass(item, 'show');
        }
      });

      // Update active button state
      this.updateActiveButton(category);
    },

    updateActiveButton(category) {
      const btnContainer = document.querySelector('.filter-bar');
      if (!btnContainer) return;

      const buttons = btnContainer.querySelectorAll('.filter-btn');
      buttons.forEach(btn => {
        btn.classList.remove('active');
        
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes(`'${category}'`)) {
          btn.classList.add('active');
        }
      });
    },

    addClass(element, className) {
      const classes = element.className.split(' ');
      const newClasses = className.split(' ');
      
      newClasses.forEach(cls => {
        if (classes.indexOf(cls) === -1) {
          classes.push(cls);
        }
      });
      
      element.className = classes.join(' ');
    },

    removeClass(element, className) {
      const classes = element.className.split(' ');
      const removeClasses = className.split(' ');
      
      removeClasses.forEach(cls => {
        const index = classes.indexOf(cls);
        if (index > -1) {
          classes.splice(index, 1);
        }
      });
      
      element.className = classes.join(' ');
    }
  };

  // ============================================================================
  // GLOBAL FUNCTIONS - Exposed for inline onclick handlers
  // ============================================================================
  window.toggleTheme = () => ThemeManager.toggle();
  window.toggleMobileMenu = () => MobileMenu.toggle();
  window.filterSelection = (category) => JournalFilters.filterSelection(category);

})();
