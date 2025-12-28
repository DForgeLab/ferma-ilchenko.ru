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


  handlePhoneClick() {
    const phoneNumber = '+79282288505';

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
    // Handle resize events if needed
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
        this.mobileToggle = document.querySelector('.header__mobile-toggle');
        this.mobileNav = document.getElementById('mobile-nav');
        this.mobileNavClose = document.getElementById('mobile-nav-close');
        this.mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

        this.init();
    }

    init() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => this.toggleMenu());
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
            if (window.innerWidth > 1024 && this.mobileNav.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.mobileNav.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.mobileNav.classList.add('active');
        this.mobileToggle.classList.add('mobile-toggle--open');
        document.body.style.overflow = 'hidden';

        // Focus trap
        const firstFocusable = this.mobileNav.querySelector('button, a');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    closeMenu() {
        this.mobileNav.classList.remove('active');
        this.mobileToggle.classList.remove('mobile-toggle--open');
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

// ==============================================
// HERO SWIPER SLIDER (using Swiper.js)
// ==============================================

class HeroSwiper {
    constructor() {
        this.init();
    }

    init() {
        const swiperElement = document.querySelector('.hero-swiper');
        if (!swiperElement) return;

        this.swiper = new Swiper('.hero-swiper', {
            effect: "cards",
            grabCursor: true,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            a11y: {
                prevSlideMessage: 'Предыдущий слайд',
                nextSlideMessage: 'Следующий слайд',
                firstSlideMessage: 'Это первый слайд',
                lastSlideMessage: 'Это последний слайд',
            },
        });
    }
}

// Initialize Mobile Navigation and Smooth Scroll
document.addEventListener('DOMContentLoaded', () => {
    new MobileNavigation();
    new SmoothScroll();
    new HeroSwiper();
});