/**
 * Animations JavaScript file for Ankit's Portfolio Website
 * Handles scroll animations, intersection observers, and advanced animation effects
 */

// Animation configuration
const animConfig = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    staggerDelay: 100
};

// Global animation state
let animationObserver;
let parallaxElements = [];
let scrollY = 0;
let ticking = false;

/**
 * Initialize all animations when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParallaxElements();
    initCounterAnimations();
    initProgressBars();
    initHoverAnimations();
    initScrollReveal();
    bindScrollEvents();
});

/**
 * Scroll Animation System using Intersection Observer
 */
function initScrollAnimations() {
    // Create intersection observer
    animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-aos') || 'fade-up';
                const delay = parseInt(element.getAttribute('data-aos-delay')) || 0;
                
                // Add animation class with delay
                setTimeout(() => {
                    element.classList.add('aos-animate');
                    
                    // Handle stagger animations
                    if (element.classList.contains('stagger-children')) {
                        staggerChildrenAnimation(element);
                    }
                    
                    // Handle counter animations
                    if (element.classList.contains('counter')) {
                        animateCounter(element);
                    }
                    
                    // Handle progress bars
                    if (element.classList.contains('skill-progress')) {
                        animateProgressBar(element);
                    }
                    
                }, delay);
                
                // Unobserve element to prevent re-triggering
                animationObserver.unobserve(element);
            }
        });
    }, {
        threshold: animConfig.threshold,
        rootMargin: animConfig.rootMargin
    });
    
    // Observe all elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(element => {
        element.classList.add('aos-element');
        const animationType = element.getAttribute('data-aos');
        element.classList.add(`aos-${animationType}`);
        animationObserver.observe(element);
    });
    
    // Observe stagger containers
    document.querySelectorAll('.stagger-children').forEach(element => {
        animationObserver.observe(element);
    });
    
    // Observe counters
    document.querySelectorAll('.counter').forEach(element => {
        animationObserver.observe(element);
    });
    
    // Observe progress bars
    document.querySelectorAll('.skill-progress').forEach(element => {
        animationObserver.observe(element);
    });
}

/**
 * Stagger Children Animation
 */
function staggerChildrenAnimation(container) {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
        }, index * animConfig.staggerDelay);
    });
}

/**
 * Counter Animation
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const start = parseInt(element.textContent) || 0;
    const increment = target / (duration / 16); // 60fps
    
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

/**
 * Progress Bar Animation
 */
function animateProgressBar(element) {
    const width = element.getAttribute('data-width') || '0%';
    const duration = parseInt(element.getAttribute('data-duration')) || 1500;
    
    element.style.transition = `width ${duration}ms ${animConfig.easing}`;
    setTimeout(() => {
        element.style.width = width;
    }, 100);
}

/**
 * Initialize Counter Animations
 */
function initCounterAnimations() {
    // Add counter class to stat numbers
    document.querySelectorAll('.stat h3').forEach(element => {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        if (number > 0) {
            element.classList.add('counter');
            element.setAttribute('data-target', number);
            element.textContent = '0';
        }
    });
}

/**
 * Initialize Progress Bars
 */
function initProgressBars() {
    document.querySelectorAll('.skill-progress').forEach(element => {
        element.style.width = '0%';
        element.setAttribute('data-aos', 'fade-right');
        element.setAttribute('data-aos-delay', '200');
    });
}

/**
 * Parallax Elements
 */
function initParallaxElements() {
    parallaxElements = document.querySelectorAll('.parallax-element');
    if (parallaxElements.length === 0) {
        // Create parallax elements for floating shapes
        document.querySelectorAll('.floating-shapes .shape').forEach(shape => {
            shape.classList.add('parallax-element');
            shape.setAttribute('data-speed', Math.random() * 0.5 + 0.2);
        });
        parallaxElements = document.querySelectorAll('.parallax-element');
    }
}

/**
 * Update parallax elements
 */
function updateParallax() {
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

/**
 * Hover Animations
 */
function initHoverAnimations() {
    // Add hover animations to cards
    document.querySelectorAll('.service-card, .project-card, .course-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover animations to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('btn-outline')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
    
    // Add hover animations to social links
    document.querySelectorAll('.social-links a, .social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover animations to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.2s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Scroll Reveal Animations
 */
function initScrollReveal() {
    // Create scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Add scroll reveal to sections
    document.querySelectorAll('section').forEach(section => {
        if (!section.classList.contains('hero')) {
            section.classList.add('scroll-reveal');
            revealObserver.observe(section);
        }
    });
}

/**
 * Scroll Event Handlers
 */
function bindScrollEvents() {
    window.addEventListener('scroll', throttle(() => {
        requestTick();
    }, 16));
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    scrollY = window.pageYOffset;
    
    // Update parallax elements
    updateParallax();
    
    // Update navbar transparency
    updateNavbarTransparency();
    
    // Update scroll indicator
    updateScrollIndicator();
    
    ticking = false;
}

/**
 * Update navbar transparency based on scroll
 */
function updateNavbarTransparency() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const opacity = Math.min(scrollY / 100, 1);
        navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity * 0.9})`;
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            navbar.style.backgroundColor = `rgba(15, 23, 42, ${opacity * 0.9})`;
        }
    }
}

/**
 * Update scroll indicator
 */
function updateScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
        const opacity = Math.max(1 - (scrollY / 300), 0);
        indicator.style.opacity = opacity;
    }
}

/**
 * Animate elements on page load
 */
function animateOnLoad() {
    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Animate navigation
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            navbar.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            navbar.style.transform = 'translateY(0)';
        }, 200);
    }
}

/**
 * Intersection Observer for lazy loading
 */
function initLazyLoading() {
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Handle lazy loading of images
                if (element.tagName === 'IMG' && element.dataset.src) {
                    element.src = element.dataset.src;
                    element.classList.add('loaded');
                    lazyObserver.unobserve(element);
                }
                
                // Handle lazy loading of background images
                if (element.dataset.bg) {
                    element.style.backgroundImage = `url(${element.dataset.bg})`;
                    element.classList.add('loaded');
                    lazyObserver.unobserve(element);
                }
            }
        });
    });
    
    // Observe lazy elements
    document.querySelectorAll('[data-src], [data-bg]').forEach(element => {
        lazyObserver.observe(element);
    });
}

/**
 * Text Animation Effects
 */
function initTextAnimations() {
    // Animate text reveal
    document.querySelectorAll('.text-reveal').forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.3s ease ${index * 0.05}s`;
            element.appendChild(span);
        });
        
        // Trigger animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('span').forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

/**
 * Morphing Animations
 */
function initMorphingAnimations() {
    const morphElements = document.querySelectorAll('.morphing-shape');
    
    morphElements.forEach(element => {
        let morphInterval;
        
        element.addEventListener('mouseenter', () => {
            morphInterval = setInterval(() => {
                const borderRadius = generateRandomBorderRadius();
                element.style.borderRadius = borderRadius;
            }, 500);
        });
        
        element.addEventListener('mouseleave', () => {
            clearInterval(morphInterval);
            element.style.borderRadius = '';
        });
    });
}

function generateRandomBorderRadius() {
    const values = [];
    for (let i = 0; i < 8; i++) {
        values.push(Math.floor(Math.random() * 50) + 25);
    }
    return `${values[0]}% ${values[1]}% ${values[2]}% ${values[3]}% / ${values[4]}% ${values[5]}% ${values[6]}% ${values[7]}%`;
}

/**
 * Utility Functions
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

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

/**
 * Animation Performance Optimization
 */
function optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--transition-normal', '0.15s ease');
        document.documentElement.style.setProperty('--transition-slow', '0.25s ease');
    }
    
    // Disable animations if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        
        // Disable CSS animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize everything
 */
document.addEventListener('DOMContentLoaded', function() {
    animateOnLoad();
    initLazyLoading();
    initTextAnimations();
    initMorphingAnimations();
    optimizeAnimations();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('*').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate animations on resize
    parallaxElements.forEach(element => {
        element.style.transform = '';
    });
    updateAnimations();
}, 250));

// Export animation utilities for global use
window.animationUtils = {
    staggerChildrenAnimation,
    animateCounter,
    animateProgressBar,
    throttle,
    debounce
};
