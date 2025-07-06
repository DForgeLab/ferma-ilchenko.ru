/**
 * Modern Dairy Farm Website - Interactive Components
 * Advanced JavaScript with ES6+ features and performance optimization
 * Version 2.0
 */

// ==============================================
// UTILITY FUNCTIONS & HELPERS
// ==============================================

const Utils = {
  // Debounce function for performance optimization
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.top >= -rect.height * threshold &&
      rect.left >= -rect.width * threshold &&
      rect.bottom <= windowHeight + rect.height * threshold &&
      rect.right <= windowWidth + rect.width * threshold
    );
  },

  // Get CSS custom property value
  getCSSProperty(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  },

  // Set CSS custom property
  setCSSProperty(property, value) {
    document.documentElement.style.setProperty(property, value);
  },

  // Smooth scroll to element
  smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

// ==============================================
// HEADER COMPONENT
// ==============================================

class Header {
  constructor() {
    this.header = document.querySelector('.header');
    this.mobileToggle = document.querySelector('.header__mobile-toggle');
    this.nav = document.querySelector('.header__nav');
    this.cartCount = document.querySelector('.cart__count');
    this.phoneButton = document.querySelector('.header__phone');

    this.isScrolled = false;
    this.scrollThreshold = 100;

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCartCount();
    this.handleInitialScroll();
  }

  bindEvents() {
    // Scroll event with throttling for performance
    window.addEventListener('scroll', Utils.throttle(() => {
      this.handleScroll();
    }, 16)); // ~60fps

    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    }

    // Phone button interaction
    if (this.phoneButton) {
      this.phoneButton.addEventListener('click', () => {
        this.handlePhoneClick();
      });
    }

    // Cart interaction
    const cartButton = document.querySelector('.header__cart');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        this.handleCartClick();
      });
    }

    // Navigation links smooth scroll
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e);
      });
    });

    // Resize handler
    window.addEventListener('resize', Utils.debounce(() => {
      this.handleResize();
    }, 250));
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollTop > this.scrollThreshold;

    if (shouldBeScrolled !== this.isScrolled) {
      this.isScrolled = shouldBeScrolled;
      this.updateHeaderState();
    }
  }

  updateHeaderState() {
    if (this.isScrolled) {
      this.header.style.background = 'rgba(254, 255, 254, 0.98)';
      this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      this.header.style.borderBottomColor = 'rgba(46, 125, 46, 0.1)';
    } else {
      this.header.style.background = 'rgba(254, 255, 254, 0.95)';
      this.header.style.boxShadow = 'none';
      this.header.style.borderBottomColor = Utils.getCSSProperty('--color-neutral-200');
    }
  }

  handleInitialScroll() {
    this.handleScroll();
  }

  toggleMobileMenu() {
    const isOpen = this.nav.classList.contains('nav--open');

    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.nav.classList.add('nav--open');
    this.mobileToggle.classList.add('mobile-toggle--open');
    document.body.style.overflow = 'hidden';

    // Animate menu items
    const navItems = this.nav.querySelectorAll('.nav__item');
    navItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add('nav__item--animate');
    });
  }

  closeMobileMenu() {
    this.nav.classList.remove('nav--open');
    this.mobileToggle.classList.remove('mobile-toggle--open');
    document.body.style.overflow = '';

    const navItems = this.nav.querySelectorAll('.nav__item');
    navItems.forEach(item => {
      item.classList.remove('nav__item--animate');
      item.style.animationDelay = '';
    });
  }

  handlePhoneClick() {
    const phoneNumber = '+7(861)234-56-78';

    // For mobile devices, initiate phone call
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // For desktop, copy to clipboard and show notification
      navigator.clipboard.writeText(phoneNumber).then(() => {
        this.showNotification('Номер телефона скопирован в буфер обмена', 'success');
      }).catch(() => {
        this.showNotification('Не удалось скопировать номер', 'error');
      });
    }
  }

  handleCartClick() {
    // Animate cart icon
    const cartIcon = document.querySelector('.cart__icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartIcon.style.transform = 'scale(1)';
    }, 150);

    // Show cart or navigate to cart page
    this.showNotification('Корзина пока пуста. Добавьте продукты!', 'info');
  }

  handleNavClick(e) {
    const href = e.target.getAttribute('href');

    // Handle anchor links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetElement = document.querySelector(href);

      if (targetElement) {
        Utils.smoothScrollTo(targetElement, 80);
        this.closeMobileMenu();
      }
    }
  }

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && this.nav.classList.contains('nav--open')) {
      this.closeMobileMenu();
    }
  }

  updateCartCount(count = 0) {
    if (this.cartCount) {
      this.cartCount.textContent = count;
      this.cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  showNotification(message, type = 'info') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
      position: 'fixed',
      top: '100px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      backgroundColor: type === 'success' ? '#22C55E' :
                      type === 'error' ? '#EF4444' : '#3B82F6'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// ==============================================
// HERO ANIMATIONS & INTERACTIONS
// ==============================================

class HeroAnimations {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.heroContent = document.querySelector('.hero__content');
    this.heroVisual = document.querySelector('.hero__visual');
    this.heroStats = document.querySelector('.hero__stats');
    this.features = document.querySelectorAll('.feature');
    this.scrollIndicator = document.querySelector('.hero__scroll');

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.animateStats();
    this.setupParallaxEffect();
    this.bindScrollIndicator();
    this.setupFeatureHovers();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, options);

    // Observe hero elements
    if (this.heroContent) observer.observe(this.heroContent);
    if (this.heroVisual) observer.observe(this.heroVisual);
    if (this.heroStats) observer.observe(this.heroStats);

    this.features.forEach(feature => {
      observer.observe(feature);
    });
  }

  animateStats() {
    const stats = document.querySelectorAll('.stat__number');

    const animateNumber = (element, target) => {
      const duration = 2000;
      const start = Date.now();
      const startValue = 0;

      const easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
        element.textContent = target >= 1000 ? `${currentValue / 1000}К+` : `${currentValue}+`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    // Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target') || '0');
          animateNumber(entry.target, target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach((stat, index) => {
      const targets = [25, 800, 15000]; // Years, Cows, Clients
      stat.setAttribute('data-target', targets[index]);
      statsObserver.observe(stat);
    });
  }

  setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero__image-floating');

    const handleParallax = Utils.throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    }, 16);

    window.addEventListener('scroll', handleParallax);
  }

  bindScrollIndicator() {
    if (this.scrollIndicator) {
      this.scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('.trust');
        if (nextSection) {
          Utils.smoothScrollTo(nextSection, 80);
        }
      });

      // Hide scroll indicator when scrolled
      window.addEventListener('scroll', Utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const opacity = Math.max(0, 1 - scrolled / 300);
        this.scrollIndicator.style.opacity = opacity;
      }, 16));
    }
  }

  setupFeatureHovers() {
    this.features.forEach((feature, index) => {
      const icon = feature.querySelector('.feature__icon');

      feature.addEventListener('mouseenter', () => {
        // Add hover animation
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        feature.style.background = 'rgba(255, 255, 255, 0.9)';
      });

      feature.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1) rotate(0deg)';
        feature.style.background = 'rgba(255, 255, 255, 0.6)';
      });

      // Stagger animation on initial load
      setTimeout(() => {
        feature.style.opacity = '1';
        feature.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }
}

// ==============================================
// INTERACTIVE ELEMENTS & MICRO-INTERACTIONS
// ==============================================

class InteractiveElements {
  constructor() {
    this.buttons = document.querySelectorAll('.btn:not([type="submit"])');
    this.badges = document.querySelectorAll('.hero__badge, .trust__badge');

    this.init();
  }

  init() {
    this.setupButtonInteractions();
    this.setupBadgeInteractions();
    this.setupImageInteractions();
    this.setupFormInteractions();
  }

  setupButtonInteractions() {
    this.buttons.forEach(button => {
      // Ripple effect
      button.addEventListener('click', (e) => {
        this.createRipple(e, button);
      });

      // Magnetic effect for primary buttons
      if (button.classList.contains('btn--primary')) {
        this.addMagneticEffect(button);
      }

      // Loading state simulation
      button.addEventListener('click', () => {
        if (button.classList.contains('btn--primary')) {
          this.showButtonLoading(button);
        }
      });
    });
  }

  createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    Object.assign(ripple.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: '50%',
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none'
    });

    // Add ripple animation keyframes if not already present
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  addMagneticEffect(element) {
    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const distance = Math.sqrt(x * x + y * y);
      const maxDistance = 50;

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        const moveX = (x / distance) * strength * 8;
        const moveY = (y / distance) * strength * 8;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0, 0)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
  }

  showButtonLoading(button) {
    const originalText = button.innerHTML;
    const loadingHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" style="animation: spin 1s linear infinite;">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="9 3"/>
      </svg>
      <span>Загрузка...</span>
    `;

    // Add spin animation
    if (!document.querySelector('#loading-styles')) {
      const style = document.createElement('style');
      style.id = 'loading-styles';
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    button.innerHTML = loadingHTML;
    button.disabled = true;

    // Simulate loading time
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 2000);
  }

  setupBadgeInteractions() {
    this.badges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.05) rotate(1deg)';
      });

      badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  setupImageInteractions() {
    const images = document.querySelectorAll('.hero__image');

    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
      });

      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });

      // Add loading placeholder
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });

      img.addEventListener('error', () => {
        img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="200" y="150" text-anchor="middle" fill="%23999">Изображение недоступно</text></svg>';
      });
    });
  }

  setupFormInteractions() {
    // Future enhancement: form validation and interactions
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          input.parentElement?.classList.add('focused');
        });

        input.addEventListener('blur', () => {
          input.parentElement?.classList.remove('focused');
        });
      });
    });
  }
}

// ==============================================
// PERFORMANCE OPTIMIZER
// ==============================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.preloadCriticalResources();
    this.optimizeAnimations();
    this.setupErrorHandling();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }

  preloadCriticalResources() {
    const criticalImages = [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  optimizeAnimations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-normal', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      const animations = document.querySelectorAll('*');
      if (document.hidden) {
        animations.forEach(el => {
          el.style.animationPlayState = 'paused';
        });
      } else {
        animations.forEach(el => {
          el.style.animationPlayState = 'running';
        });
      }
    });
  }

  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript error:', e.error);
      // Could send to analytics or error reporting service
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
    });
  }
}

// ==============================================
// ANALYTICS & TRACKING
// ==============================================

class Analytics {
  constructor() {
    this.events = [];
    this.init();
  }

  init() {
    this.trackPageView();
    this.setupEventTracking();
    this.trackUserEngagement();
  }

  trackPageView() {
    this.trackEvent('page_view', {
      page: window.location.pathname,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`
    });
  }

  setupEventTracking() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn')) {
        this.trackEvent('button_click', {
          button_text: e.target.textContent.trim(),
          button_type: e.target.className,
          timestamp: Date.now()
        });
      }

      // Track navigation clicks
      if (e.target.matches('.nav__link')) {
        this.trackEvent('navigation_click', {
          link_text: e.target.textContent.trim(),
          href: e.target.getAttribute('href'),
          timestamp: Date.now()
        });
      }
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', Utils.throttle(() => {
      const scrollPercent = Math.round((window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          this.trackEvent('scroll_depth', {
            depth: maxScroll,
            timestamp: Date.now()
          });
        }
      }
    }, 1000));
  }

  trackUserEngagement() {
    let startTime = Date.now();

    // Track time on page
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Date.now() - startTime;
      this.trackEvent('time_on_page', {
        duration: timeOnPage,
        timestamp: Date.now()
      });
    });

    // Track feature interactions
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      feature.addEventListener('mouseenter', () => {
        this.trackEvent('feature_hover', {
          feature_index: index,
          feature_title: feature.querySelector('.feature__title')?.textContent,
          timestamp: Date.now()
        });
      });
    });
  }

  trackEvent(eventName, data) {
    const event = {
      event: eventName,
      ...data
    };

    this.events.push(event);

    // Send to analytics service (replace with your analytics provider)
    if (window.gtag) {
      window.gtag('event', eventName, data);
    }

    // Or send to custom analytics endpoint
    // this.sendToAnalytics(event);
  }

  sendToAnalytics(event) {
    // Example: send to custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    }).catch(err => {
      console.warn('Analytics tracking failed:', err);
    });
  }
}

// ==============================================
// MAP FUNCTIONALITY
// ==============================================

class StoresMap {
  constructor() {
    this.map = null;
    this.clusterer = null;
    this.placemarks = {};
    this.stores = [];
    this.activeStore = null;

    this.init();
  }

  init() {
    // Wait for Yandex Maps API to load
    if (typeof ymaps !== 'undefined') {
      ymaps.ready(() => this.initMap());
    } else {
      // Retry after a short delay if API not loaded yet
      setTimeout(() => this.init(), 500);
    }

    this.setupEventListeners();
    this.setupMobileControls();
  }

  initMap() {
    try {
      // Check if Yandex Maps API is loaded
      if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API is not loaded');
        this.showMapError('Не удается загрузить карту. Проверьте подключение к интернету.');
        return;
      }

      // Create map with mobile-friendly settings
      this.map = new ymaps.Map('stores-map', {
        center: [45.2, 38.95], // Center between all stores
        zoom: 10,
        controls: ['zoomControl', 'geolocationControl'],
        // Mobile-friendly settings
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true
      });

      // Configure behaviors for mobile
      this.configureMobileBehaviors();

      // Initialize stores data
      this.initStoresData();

      // Create clusterer
      this.clusterer = new ymaps.Clusterer({
        preset: 'islands#greenClusterIcons',
        clusterDisableClickZoom: false,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 300,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonPagerSize: 5
      });

      // Create placemarks
      this.createPlacemarks();

      // Add clusterer to map
      this.map.geoObjects.add(this.clusterer);

      // Set bounds to show all stores
      if (this.clusterer && this.clusterer.getBounds()) {
        this.map.setBounds(this.clusterer.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 20
        });
      }

      console.log('🗺️ Stores map initialized successfully');

    } catch (error) {
      console.error('Failed to initialize map:', error);
      this.showMapError('Произошла ошибка при загрузке карты. Попробуйте обновить страницу.');
    }
  }

  // Configure mobile-friendly behaviors
  configureMobileBehaviors() {
    if (!this.map) return;

    // Disable certain behaviors on mobile
    if (window.innerWidth <= 768) {
      this.map.behaviors.disable('scrollZoom');
      this.map.behaviors.disable('dblClickZoom');
      this.map.behaviors.disable('multiTouch');
    }

    // Re-enable behaviors on desktop
    window.addEventListener('resize', () => {
      if (!this.map) return;

      if (window.innerWidth <= 768) {
        this.map.behaviors.disable('scrollZoom');
        this.map.behaviors.disable('dblClickZoom');
        this.map.behaviors.disable('multiTouch');
      } else {
        this.map.behaviors.enable('scrollZoom');
        this.map.behaviors.enable('dblClickZoom');
        this.map.behaviors.enable('multiTouch');
      }
    });
  }

  // Show map error message
  showMapError(message) {
    const mapContainer = document.getElementById('stores-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          background: #f8f9fa;
          border-radius: 20px;
          flex-direction: column;
          gap: 10px;
          color: #666;
          text-align: center;
          padding: 20px;
        ">
          <div style="font-size: 48px;">🗺️</div>
          <div style="font-weight: 600;">${message}</div>
          <button onclick="location.reload()" style="
            background: #2E7D2E;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            margin-top: 10px;
          ">Обновить страницу</button>
        </div>
      `;
    }
  }

  initStoresData() {
    this.stores = [
      // Фирменные магазины
      {
        id: 'store1',
        name: 'Новотитаровская - Центр',
        address: 'ст. Новотитаровская, ул. Ленина, д.226 (центр)',
        coordinates: [45.260865, 38.979930],
        type: 'branded',
        location: 'novotitarovskaya',
        tags: ['Фирменный', 'Полный ассортимент']
      },
      {
        id: 'store2',
        name: 'Новотитаровская - Балочка',
        address: 'ст. Новотитаровская, ул. Ленина, д.114/1 (балочка)',
        coordinates: [45.259954, 38.965703],
        type: 'branded',
        location: 'novotitarovskaya',
        tags: ['Фирменный', 'Полный ассортимент']
      },
      {
        id: 'store3',
        name: 'Новотитаровская - Школа №35',
        address: 'ст. Новотитаровская, ул. Широкая, д.89 (напротив МОУ СОШ №35)',
        coordinates: [45.254869, 38.972440],
        type: 'branded',
        location: 'novotitarovskaya',
        tags: ['Фирменный']
      },
      {
        id: 'store4',
        name: 'Новотитаровская - Магнит',
        address: 'ст. Новотитаровская, ул. Широкая, д.58 (напротив магазина "Магнит")',
        coordinates: [45.253458, 38.973084],
        type: 'branded',
        location: 'novotitarovskaya',
        tags: ['Фирменный']
      },
      {
        id: 'store5',
        name: 'Новотитаровская - Тельмана',
        address: 'ст. Новотитаровская, ул. Тельмана (пересечение с ул. Сельская)',
        coordinates: [45.257365, 38.977129],
        type: 'branded',
        location: 'novotitarovskaya',
        tags: ['Фирменный']
      },
      {
        id: 'store6',
        name: 'Динская - Поликлиника',
        address: 'ст. Динская, ул. Кирпичная, д.73/1 (поликлиника)',
        coordinates: [45.217373, 39.223033],
        type: 'branded',
        location: 'dinskaya',
        tags: ['Фирменный']
      },
      {
        id: 'store7',
        name: 'Нововеличковская',
        address: 'ст. Нововеличковская, ул. Луначарского, 15',
        coordinates: [45.122910, 38.829510],
        type: 'branded',
        location: 'novovelichkovskaya',
        tags: ['Фирменный']
      },
      // Партнерские магазины
      {
        id: 'store8',
        name: 'Статус - Красная',
        address: 'ст. Динская, ул. Красная 94',
        coordinates: [45.211672, 39.236210],
        type: 'partner',
        location: 'dinskaya',
        tags: ['Партнерский', 'Молоко', 'Сыры']
      },
      {
        id: 'store9',
        name: 'Статус - Пролетарская',
        address: 'ст. Динская, ул. Пролетарская 40',
        coordinates: [45.214632, 39.231310],
        type: 'partner',
        location: 'dinskaya',
        tags: ['Партнерский', 'Молоко']
      },
      {
        id: 'store10',
        name: 'Минимаркет "Вкусноежка"',
        address: 'п. Северный, ул. Пригородная, д.105',
        coordinates: [45.276090, 39.016810],
        type: 'partner',
        location: 'other',
        tags: ['Партнерский']
      },
      {
        id: 'store11',
        name: 'Молоко',
        address: 'п. Прогресс, ул. Мечникова, д.3 (503)',
        coordinates: [45.285780, 38.965750],
        type: 'partner',
        location: 'other',
        tags: ['Партнерский']
      },
      {
        id: 'store12',
        name: 'Лавка Петровича - Южный',
        address: 'п. Южный, ул. Смоленская, д.51',
        coordinates: [45.084380, 38.972190],
        type: 'partner',
        location: 'other',
        tags: ['Партнерский']
      },
      {
        id: 'store13',
        name: 'Ботаника - Клары Лучко',
        address: 'г. Краснодар, ул. Клары Лучко, д.10',
        coordinates: [45.058690, 38.950210],
        type: 'partner',
        location: 'krasnodar',
        tags: ['Партнерский']
      },
      {
        id: 'store14',
        name: 'Ботаника - Яна Полуяна',
        address: 'г. Краснодар, ул. Яна Полуяна, д.47/2',
        coordinates: [45.062430, 38.953360],
        type: 'partner',
        location: 'krasnodar',
        tags: ['Партнерский']
      },
      {
        id: 'store15',
        name: 'Ботаника - ТЦ Красная площадь',
        address: 'г. Краснодар, ТЦ Красная площадь 1 этаж',
        coordinates: [45.088410, 38.979080],
        type: 'partner',
        location: 'krasnodar',
        tags: ['Партнерский']
      },
      {
        id: 'store16',
        name: 'Ботаника - Монтажников',
        address: 'г. Краснодар, ул. Монтажников, д.3Б',
        coordinates: [45.044860, 39.010050],
        type: 'partner',
        location: 'krasnodar',
        tags: ['Партнерский']
      },
      {
        id: 'store17',
        name: 'Фермерский дворик (Агромаг)',
        address: 'г. Краснодар, ул. Красная, д.176/5 Корпус№9',
        coordinates: [45.036600, 38.974830],
        type: 'partner',
        location: 'krasnodar',
        tags: ['Партнерский']
      },
      {
        id: 'store18',
        name: 'Продукты - Кореновская',
        address: 'г. Краснодар, ул. Кореновская, д.65',
        coordinates: [45.058050, 39.005350],
        type: 'partner',
        location: 'krasnodar',
        tags: ['Партнерский']
      }
    ];
  }

  createPlacemarks() {
    this.stores.forEach(store => {
      const iconColor = store.type === 'branded' ? '#2E7D2E' : '#D4A853';
      const iconContent = store.type === 'branded' ? 'Ф' : 'П';

      const placemark = new ymaps.Placemark(
        store.coordinates,
        {
          hintContent: store.name,
          balloonContentHeader: store.name,
          balloonContentBody: `
            <div class="map-balloon">
              <p>${store.address}</p>
              <p><strong>Тип:</strong> ${store.type === 'branded' ? 'Фирменный' : 'Партнерский'}</p>
              <p><strong>Часы работы:</strong> 9:00 - 20:00</p>
            </div>
          `,
          storeId: store.id
        },
        {
          preset: 'islands#circleIcon',
          iconColor: iconColor,
          iconContent: iconContent
        }
      );

      // Handle placemark click
      placemark.events.add('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          this.showStoreDetails(store);
          return false;
        }
        this.selectStore(store.id);
      });

      this.placemarks[store.id] = placemark;
      this.clusterer.add(placemark);
    });
  }

  setupEventListeners() {
    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => this.applyFilters());
    });

    // Store item clicks
    const storeItems = document.querySelectorAll('.store-item');
    storeItems.forEach(item => {
      item.addEventListener('click', () => {
        const storeId = item.dataset.id;
        this.selectStore(storeId);
        this.centerMapOnStore(storeId);
      });
    });

    // Quick filter buttons
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
    quickFilterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all buttons
        quickFilterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Apply filter
        this.applyQuickFilter(btn.dataset.filter);

        // Close mobile sidebar if open
        if (window.innerWidth <= 768) {
          const sidebar = document.querySelector('.map-section__sidebar');
          const mobileToggle = document.querySelector('.mobile-stores-toggle');
          if (sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');

            // Update button text
            const toggleText = mobileToggle?.querySelector('.toggle-text');
            if (toggleText) {
              toggleText.textContent = 'Показать список магазинов';
            }
          }
        }
      });
    });

    // Fullscreen toggle with touch support
    const fullscreenBtn = document.getElementById('map-fullscreen');
    const closeFullscreenBtn = document.getElementById('map-close-fullscreen');
    const mapContainer = document.querySelector('.map-section__map-container');

    if (fullscreenBtn && closeFullscreenBtn && mapContainer) {
      // Enter fullscreen
      const enterFullscreen = () => {
        mapContainer.classList.add('fullscreen');
        closeFullscreenBtn.style.display = 'flex';
        fullscreenBtn.style.display = 'none';

        // Prevent body scroll in fullscreen
        document.body.style.overflow = 'hidden';

        // Re-enable all map behaviors in fullscreen
        if (this.map) {
          this.map.behaviors.enable(['drag', 'scrollZoom', 'dblClickZoom', 'multiTouch']);
          setTimeout(() => {
            this.map.container.fitToViewport();
          }, 300);
        }
      };

      // Exit fullscreen
      const exitFullscreen = () => {
        mapContainer.classList.remove('fullscreen');
        closeFullscreenBtn.style.display = 'none';
        fullscreenBtn.style.display = 'flex';

        // Restore body scroll
        document.body.style.overflow = '';

        // Restore mobile-friendly behaviors
        if (this.map) {
          if (window.innerWidth <= 768) {
            this.map.behaviors.disable(['scrollZoom', 'dblClickZoom', 'multiTouch']);
          }
          setTimeout(() => {
            this.map.container.fitToViewport();
          }, 300);
        }
      };

      // Click events
      fullscreenBtn.addEventListener('click', enterFullscreen);
      closeFullscreenBtn.addEventListener('click', exitFullscreen);

      // Touch events for better mobile experience
      fullscreenBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        fullscreenBtn.style.transform = 'scale(0.9)';
      });

      fullscreenBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        fullscreenBtn.style.transform = 'scale(1)';
        enterFullscreen();
      });

      closeFullscreenBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        closeFullscreenBtn.style.transform = 'scale(0.9)';
      });

      closeFullscreenBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeFullscreenBtn.style.transform = 'scale(1)';
        exitFullscreen();
      });

      // ESC key to exit fullscreen
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mapContainer.classList.contains('fullscreen')) {
          exitFullscreen();
        }
      });
    }
  }

  setupMobileControls() {
    const mobileToggle = document.querySelector('.mobile-stores-toggle');
    const sidebar = document.querySelector('.map-section__sidebar');

    if (mobileToggle && sidebar) {
      // Add touch event listeners for better mobile experience
      mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSidebar(sidebar, mobileToggle);
      });

      // Add touch event for better responsiveness
      mobileToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        mobileToggle.style.transform = 'scale(0.95)';
      });

      mobileToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        mobileToggle.style.transform = 'scale(1)';
        this.toggleSidebar(sidebar, mobileToggle);
      });

      // Close sidebar when clicking close button (::before pseudo-element)
      sidebar.addEventListener('click', (e) => {
        const rect = sidebar.getBoundingClientRect();
        const closeButtonArea = {
          left: rect.right - 60,
          right: rect.right - 20,
          top: rect.top + 20,
          bottom: rect.top + 60
        };

        if (e.clientX >= closeButtonArea.left && e.clientX <= closeButtonArea.right &&
            e.clientY >= closeButtonArea.top && e.clientY <= closeButtonArea.bottom) {
          e.preventDefault();
          e.stopPropagation();
          this.closeSidebar(sidebar, mobileToggle);
        }
      });

      // Handle touch events for close button
      sidebar.addEventListener('touchstart', (e) => {
        const rect = sidebar.getBoundingClientRect();
        const touch = e.touches[0];
        const closeButtonArea = {
          left: rect.right - 60,
          right: rect.right - 20,
          top: rect.top + 20,
          bottom: rect.top + 60
        };

        if (touch.clientX >= closeButtonArea.left && touch.clientX <= closeButtonArea.right &&
            touch.clientY >= closeButtonArea.top && touch.clientY <= closeButtonArea.bottom) {
          e.preventDefault();
          e.stopPropagation();
          this.closeSidebar(sidebar, mobileToggle);
        }
      });

      // Handle escape key to close sidebar
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
          this.closeSidebar(sidebar, mobileToggle);
        }
      });

      // Close sidebar when clicking outside
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
          this.closeSidebar(sidebar, mobileToggle);
        }
      });

      // Handle touch events for closing sidebar when touching outside
      document.addEventListener('touchstart', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
          this.closeSidebar(sidebar, mobileToggle);
        }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
          this.closeSidebar(sidebar, mobileToggle);
        }
      });
    }

    // Mobile store details actions
    const directionsBtn = document.getElementById('get-directions');
    const callBtn = document.getElementById('call-store');

    if (directionsBtn) {
      directionsBtn.addEventListener('click', () => {
        if (this.activeStore) {
          const coords = this.activeStore.coordinates;
          const url = `https://yandex.ru/maps/?rtext=~${coords[0]},${coords[1]}`;
          window.open(url, '_blank');
        }
      });
    }

    if (callBtn) {
      callBtn.addEventListener('click', () => {
        // Add phone number logic here
        alert('Телефон: +7 (861) 234-56-78');
      });
    }
  }

  // Helper method to toggle sidebar
  toggleSidebar(sidebar, mobileToggle) {
    sidebar.classList.toggle('active');

    // Prevent body scroll when sidebar is open
    if (sidebar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      // Disable map touch events when sidebar is open
      if (this.map) {
        this.map.behaviors.disable('drag');
        this.map.behaviors.disable('scrollZoom');
      }
    } else {
      document.body.style.overflow = '';
      // Re-enable map touch events when sidebar is closed
      if (this.map) {
        this.map.behaviors.enable('drag');
        this.map.behaviors.enable('scrollZoom');
      }
    }

    // Update button text
    const toggleText = mobileToggle.querySelector('.toggle-text');
    if (toggleText) {
      toggleText.textContent = sidebar.classList.contains('active')
        ? 'Скрыть список магазинов'
        : 'Показать список магазинов';
    }
  }

  // Helper method to close sidebar
  closeSidebar(sidebar, mobileToggle) {
    sidebar.classList.remove('active');
    document.body.style.overflow = '';

    // Re-enable map touch events
    if (this.map) {
      this.map.behaviors.enable('drag');
      this.map.behaviors.enable('scrollZoom');
    }

    // Update button text
    const toggleText = mobileToggle.querySelector('.toggle-text');
    if (toggleText) {
      toggleText.textContent = 'Показать список магазинов';
    }
  }

  selectStore(storeId) {
    // Remove active class from all store items
    document.querySelectorAll('.store-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to selected store
    const storeElement = document.querySelector(`[data-id="${storeId}"]`);
    if (storeElement) {
      storeElement.classList.add('active');
      storeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update active store
    this.activeStore = this.stores.find(store => store.id === storeId);
  }

  centerMapOnStore(storeId) {
    const store = this.stores.find(s => s.id === storeId);
    if (store && this.map) {
      this.map.setCenter(store.coordinates, 16, {
        checkZoomRange: true,
        duration: 500
      });
    }
  }

  showStoreDetails(store) {
    const detailsSheet = document.getElementById('store-details');
    const nameEl = document.getElementById('details-name');
    const addressEl = document.getElementById('details-address');
    const tagsEl = document.getElementById('details-tags');

    if (detailsSheet && nameEl && addressEl && tagsEl) {
      nameEl.textContent = store.name;
      addressEl.textContent = store.address;

      tagsEl.innerHTML = '';
      store.tags.forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'store-tag';
        tagEl.textContent = tag;
        tagsEl.appendChild(tagEl);
      });

      detailsSheet.classList.add('active');
      this.activeStore = store;
    }

    // Close details sheet when clicking outside
    setTimeout(() => {
      const closeHandler = (e) => {
        if (!detailsSheet.contains(e.target)) {
          detailsSheet.classList.remove('active');
          document.removeEventListener('click', closeHandler);
        }
      };
      document.addEventListener('click', closeHandler);
    }, 100);
  }

  applyFilters() {
    const typeFilters = Array.from(document.querySelectorAll('input[value="branded"], input[value="partner"]'))
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const locationFilters = Array.from(document.querySelectorAll('input[id^="location-"]'))
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    this.filterStores(typeFilters, locationFilters);
  }

  applyQuickFilter(filter) {
    // Update checkboxes based on quick filter
    const typeCheckboxes = document.querySelectorAll('input[value="branded"], input[value="partner"]');
    const locationCheckboxes = document.querySelectorAll('input[id^="location-"]');

    if (filter === 'all') {
      // Check all checkboxes
      typeCheckboxes.forEach(cb => cb.checked = true);
      locationCheckboxes.forEach(cb => cb.checked = true);
      this.filterStores(['branded', 'partner'], ['novotitarovskaya', 'dinskaya', 'novovelichkovskaya', 'krasnodar', 'other']);
    } else if (filter === 'branded' || filter === 'partner') {
      // Check only selected type, all locations
      typeCheckboxes.forEach(cb => cb.checked = cb.value === filter);
      locationCheckboxes.forEach(cb => cb.checked = true);
      this.filterStores([filter], ['novotitarovskaya', 'dinskaya', 'novovelichkovskaya', 'krasnodar', 'other']);
    } else {
      // Check all types, only selected location
      typeCheckboxes.forEach(cb => cb.checked = true);
      locationCheckboxes.forEach(cb => {
        const value = cb.value || cb.id.replace('location-', '');
        cb.checked = value === filter;
      });
      this.filterStores(['branded', 'partner'], [filter]);
    }
  }

  filterStores(typeFilters, locationFilters) {
    // Filter store items in sidebar
    const storeItems = document.querySelectorAll('.store-item');
    storeItems.forEach(item => {
      const type = item.dataset.type;
      const location = item.dataset.location;

      const showItem = typeFilters.includes(type) && locationFilters.includes(location);
      item.style.display = showItem ? 'block' : 'none';
    });

    // Filter map placemarks
    if (this.clusterer) {
      this.clusterer.removeAll();

      this.stores.forEach(store => {
        const showStore = typeFilters.includes(store.type) && locationFilters.includes(store.location);
        if (showStore && this.placemarks[store.id]) {
          this.clusterer.add(this.placemarks[store.id]);
        }
      });

      // Update map bounds
      if (this.clusterer.getLength() > 0) {
        this.map.setBounds(this.clusterer.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 20
        });
      }
    }

    // Hide empty categories
    const categories = document.querySelectorAll('.store-category');
    categories.forEach(category => {
      const visibleItems = category.querySelectorAll('.store-item[style="display: block"], .store-item:not([style*="display: none"])');
      category.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });
  }
}

// ==============================================
// MAIN APPLICATION INITIALIZATION
// ==============================================

class DairyFarmApp {
  constructor() {
    this.components = {};
    this.isInitialized = false;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize core components
      this.components.header = new Header();
      this.components.heroAnimations = new HeroAnimations();
      this.components.interactiveElements = new InteractiveElements();
      this.components.performanceOptimizer = new PerformanceOptimizer();
      this.components.analytics = new Analytics();

      // Initialize map if map section exists
      if (document.getElementById('stores-map')) {
        this.components.storesMap = new StoresMap();
      }

      this.isInitialized = true;

      console.log('🥛 Dairy Farm website initialized successfully!');

      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('dairyFarmReady', {
        detail: { components: this.components }
      }));

    } catch (error) {
      console.error('Failed to initialize dairy farm app:', error);
    }
  }

  // Public API for external interactions
  getComponent(name) {
    return this.components[name];
  }

  updateCartCount(count) {
    if (this.components.header) {
      this.components.header.updateCartCount(count);
    }
  }

  showNotification(message, type) {
    if (this.components.header) {
      this.components.header.showNotification(message, type);
    }
  }
}

// Initialize the application
const dairyFarmApp = new DairyFarmApp();

// Expose app to global scope for external access
window.DairyFarmApp = dairyFarmApp;

// ==============================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ==============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DairyFarmApp, Utils };
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.mobileNav = document.getElementById('mobile-nav');
        this.mobileNavClose = document.getElementById('mobile-nav-close');
        this.mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

        this.init();
    }

    init() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.openMenu());
        }

        if (this.mobileNavClose) {
            this.mobileNavClose.addEventListener('click', () => this.closeMenu());
        }

        if (this.mobileNavOverlay) {
            this.mobileNavOverlay.addEventListener('click', () => this.closeMenu());
        }

        // Close menu when clicking on links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.closeMenu(), 300);
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileNav.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.mobileNav.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        this.mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus trap
        const firstFocusable = this.mobileNav.querySelector('button, a');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    closeMenu() {
        this.mobileNav.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to toggle button
        if (this.mobileToggle) {
            this.mobileToggle.focus();
        }
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle all navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize Mobile Navigation and Smooth Scroll
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    new SmoothScroll();
});