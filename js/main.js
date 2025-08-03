/**
 * Main JavaScript file for Ankit's Portfolio Website
 * Handles navigation, theme switching, forms, payments, and general interactivity
 */

// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';
let isMenuOpen = false;
let typingInterval;
let currentProjectFilter = 'all';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeNavigation();
    initializeHero();
    initializeScrollAnimations();
    initializeForms();
    initializeProjects();
    initializeFAQ();
    initializeCookieBanner();
    hideLoadingScreen();
});

/**
 * Loading Screen Management
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

/**
 * Theme Management
 */
function initializeTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    // Set initial theme
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeSwitch) themeSwitch.checked = true;
    }
    
    // Theme switch event listener
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                body.setAttribute('data-theme', 'dark');
                currentTheme = 'dark';
            } else {
                body.removeAttribute('data-theme');
                currentTheme = 'light';
            }
            localStorage.setItem('theme', currentTheme);
        });
    }
}

/**
 * Navigation Management
 */
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger bars
            const spans = hamburger.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                isMenuOpen = false;
                
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
    
    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * Hero Section Management
 */
function initializeHero() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;
    
    const phrases = [
        'Web Developer',
        'Video Editor',
        'Graphic Designer',
        'Digital Marketer',
        'Course Creator'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before next phrase
        }
        
        typingInterval = setTimeout(typeText, typeSpeed);
    }
    
    // Start typing animation
    typeText();
    
    // Animate skill progress bars
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width;
            }
        });
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * Scroll Animations
 */
function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // For stagger children
                if (entry.target.classList.contains('stagger-children')) {
                    entry.target.classList.add('animate');
                }
            }
        });
    }, observerOptions);
    
    // Observe elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
    
    // Observe stagger children containers
    document.querySelectorAll('.stagger-children').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Project Filtering
 */
function initializeProjects() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            currentProjectFilter = filter;
        });
    });
}

/**
 * Form Management
 */
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm(this);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Message length validation
    if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
    field.classList.remove('error');
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
    field.classList.add('error');
}

function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Name',
        'email': 'Email',
        'phone': 'Phone',
        'message': 'Message',
        'service': 'Service',
        'budget': 'Budget'
    };
    return labels[fieldName] || fieldName;
}

function handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    let isFormValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please fix the errors below.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Success response
        showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Optional: Send to actual backend
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).then(response => response.json())
        //   .then(result => {
        //       if (result.success) {
        //           showNotification('Message sent successfully!', 'success');
        //       } else {
        //           showNotification('Error sending message. Please try again.', 'error');
        //       }
        //   });
        
    }, 2000);
}

/**
 * Course Purchase Management
 */
function buyNow(courseId, courseName, price) {
    // Store course data in sessionStorage
    const courseData = {
        id: courseId,
        name: courseName,
        price: price,
        timestamp: Date.now()
    };
    
    sessionStorage.setItem('selectedCourse', JSON.stringify(courseData));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

/**
 * Payment Management
 */
function initializePayment() {
    // Load course data from sessionStorage
    const courseData = JSON.parse(sessionStorage.getItem('selectedCourse'));
    
    if (courseData) {
        updatePaymentPage(courseData);
    }
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        const header = option.querySelector('.payment-header');
        header.addEventListener('click', function() {
            // Remove active class from all options
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
        });
    });
    
    // UPI app buttons
    const upiButtons = document.querySelectorAll('.upi-app-btn');
    upiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            const amount = courseData ? courseData.price : 1999;
            const upiId = 'ankit@paytm';
            
            // Generate UPI payment URL
            const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Course Purchase`;
            
            // Try to open UPI app
            window.location.href = upiUrl;
            
            // Show payment verification section after a delay
            setTimeout(() => {
                showNotification(
                    'If the UPI app didn\'t open, please use the QR code or upload payment screenshot below.',
                    'info'
                );
            }, 3000);
        });
    });
}

function updatePaymentPage(courseData) {
    const courseTitleElement = document.getElementById('course-title');
    const subtotalElement = document.getElementById('subtotal');
    const totalAmountElement = document.getElementById('total-amount');
    
    if (courseTitleElement) {
        courseTitleElement.textContent = courseData.name;
    }
    
    if (subtotalElement && totalAmountElement) {
        subtotalElement.textContent = `₹${courseData.price}`;
        totalAmountElement.textContent = `₹${courseData.price}`;
    }
}

function copyUPIId() {
    const upiIdInput = document.querySelector('.upi-id-input input');
    if (upiIdInput) {
        upiIdInput.select();
        document.execCommand('copy');
        showNotification('UPI ID copied to clipboard!', 'success');
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('upload-preview');
    
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `
                    <div class="uploaded-image">
                        <img src="${e.target.result}" alt="Payment Screenshot" style="max-width: 200px; border-radius: 8px;">
                        <p>Screenshot uploaded successfully!</p>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
            
            showNotification('Screenshot uploaded! Please click "Confirm Payment" below.', 'success');
        } else {
            showNotification('Please upload an image file.', 'error');
        }
    }
}

function openRazorpay() {
    const courseData = JSON.parse(sessionStorage.getItem('selectedCourse'));
    const amount = courseData ? courseData.price * 100 : 199900; // Amount in paise
    
    // In a real implementation, you would integrate with Razorpay
    // For now, show a notification
    showNotification(
        'Razorpay integration would be implemented here. For demo purposes, please use UPI payment option.',
        'info'
    );
    
    // Example Razorpay integration (commented out)
    /*
    const options = {
        key: 'your_razorpay_key',
        amount: amount,
        currency: 'INR',
        name: 'Ankit Portfolio',
        description: courseData ? courseData.name : 'Course Purchase',
        handler: function(response) {
            // Handle successful payment
            showPaymentSuccess();
        },
        prefill: {
            name: '',
            email: '',
            contact: ''
        },
        theme: {
            color: '#6366f1'
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
    */
}

function completePayment() {
    const uploadPreview = document.getElementById('upload-preview');
    
    if (!uploadPreview || !uploadPreview.innerHTML.trim()) {
        showNotification('Please upload a payment screenshot first.', 'error');
        return;
    }
    
    // Show success modal
    showPaymentSuccess();
}

function showPaymentSuccess() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

/**
 * FAQ Management
 */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Cookie Banner Management
 */
function initializeCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    // Show banner if consent not given
    if (!cookieConsent && cookieBanner) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieBanner();
    showNotification('Cookie preferences saved.', 'success');
}

function manageCookies() {
    // In a real implementation, this would open a cookie management dialog
    showNotification('Cookie management panel would open here.', 'info');
    acceptCookies(); // For demo purposes
}

function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        box-shadow: 0 10px 30px var(--shadow-light);
        z-index: var(--z-tooltip);
        max-width: 400px;
        backdrop-filter: blur(10px);
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * Utility Functions
 */
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

// Initialize payment page if we're on it
if (window.location.pathname.includes('payment.html')) {
    document.addEventListener('DOMContentLoaded', initializePayment);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    // Close mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        isMenuOpen = false;
    }
});

// Export functions for global access
window.buyNow = buyNow;
window.copyUPIId = copyUPIId;
window.handleFileUpload = handleFileUpload;
window.openRazorpay = openRazorpay;
window.completePayment = completePayment;
window.closeModal = closeModal;
window.acceptCookies = acceptCookies;
window.manageCookies = manageCookies;
