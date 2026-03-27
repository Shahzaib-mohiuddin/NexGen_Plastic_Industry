// ============================================
// SAFETY GUARDS FOR BROWSER EXTENSIONS
// ============================================
window.solveSimpleChallenge = window.solveSimpleChallenge || function() {};

// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Close dropdowns when clicking outside
const closeAllDropdowns = (except = null) => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        if (dropdown !== except) {
            dropdown.classList.remove('active');
        }
    });
};

// Toggle mobile menu
const navbar = document.querySelector('.navbar-nexgen');
if (navToggle) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        if (navbar) navbar.classList.toggle('menu-open');
        closeAllDropdowns();
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        if (navbar) navbar.classList.remove('menu-open');
        closeAllDropdowns();
    }
});

// Handle dropdown toggle on mobile
const dropdownToggles = document.querySelectorAll('.dropdown > .dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 1138) { // Mobile/Tablet view
            e.preventDefault();
            const parent = this.parentElement;
            const isActive = parent.classList.contains('active');
            
            // Close all other dropdowns first
            closeAllDropdowns(parent);
            
            // Toggle this dropdown
            parent.classList.toggle('active');
        }
    });
});

// Close dropdowns when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-menu-nexgen a:not(.dropdown > a)');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        if (navbar) navbar.classList.remove('menu-open');
        closeAllDropdowns();
    });
});

// Navbar scroll effect - Show fixed white navbar after scrolling past hero section
// Optimized with DOM read/write batching for maximum performance
let lastScrollY = 0;
let heroHeight = 100;
let navbarTicking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar-nexgen');
    if (!navbar) return;
    
    // DOM READ phase - batch all reads together
    const currentScrollY = window.scrollY;
    const isProductDetailPage = document.body.classList.contains('product-detail-page');
    
    // Only proceed if scroll changed significantly (reduces unnecessary updates)
    if (Math.abs(currentScrollY - lastScrollY) < 5 && !isProductDetailPage) {
        return;
    }
    
    lastScrollY = currentScrollY;
    
    // DOM WRITE phase - batch all writes together
    if (isProductDetailPage) {
        navbar.classList.add('fixed-nav');
        return;
    }
    
    if (currentScrollY >= heroHeight) {
        navbar.classList.add('fixed-nav');
    } else {
        navbar.classList.remove('fixed-nav');
    }
}

// Cache hero height on page load to avoid repeated DOM reads
function cacheHeroHeight() {
    const heroSection = document.querySelector('.hero-nexgen, .industry-hero, .industries-hero, .page-header, .about-hero-section, .contact-page-hero, .sustainability-hero-section');
    heroHeight = heroSection ? heroSection.offsetHeight : 100;
}

// Optimized scroll handler with RAF and passive listener
window.addEventListener('scroll', () => {
    if (!navbarTicking) {
        window.requestAnimationFrame(() => {
            updateNavbar();
            navbarTicking = false;
        });
        navbarTicking = true;
    }
}, { passive: true });

// Run on page load to set initial state
document.addEventListener('DOMContentLoaded', () => {
    cacheHeroHeight();
    updateNavbar();
});

// Recalculate hero height on resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        cacheHeroHeight();
    }, 250);
}, { passive: true });

// Industries Swiper - Improved Configuration
if (document.querySelector('.industriesSwiper')) {
    const industriesSwiperElement = document.querySelector('.industriesSwiper');
    const industriesSlideCount = industriesSwiperElement.querySelectorAll('.swiper-slide').length;
    
    const industriesSwiper = new Swiper('.industriesSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: false,
        rewind: true,
        slidesPerGroup: 1,
        centeredSlides: false,
        grabCursor: true,
        watchSlidesProgress: true,
        preventClicks: false,
        preventClicksPropagation: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20
                            },
            768: {
                slidesPerView: 3,
                spaceBetween: 25
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 30
            },
            1440: {
                slidesPerView: 5,
                spaceBetween: 30
            }
        },
        on: {
            init: function() {
                // Ensure proper initialization
                this.update();
            },
            resize: function() {
                // Update on resize for better responsiveness
                this.update();
            }
        }
    });
}

// Products Swiper
if (document.querySelector('.productsSwiper')) {
    const productsSwiperElement = document.querySelector('.productsSwiper');
    const productsSlideCount = productsSwiperElement.querySelectorAll('.swiper-slide').length;
    
    const productsSwiper = new Swiper('.productsSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        rewind: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1280: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
        },
    });
}

// Smooth scroll for anchor links
try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            try {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            } catch (error) {
                console.warn('Smooth scroll error:', error);
            }
        });
    });
} catch (error) {
    console.warn('Smooth scroll initialization error:', error);
}

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Here you would typically send the data to a server
        // Form submitted
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// ============================================
// SMOOTH SCROLL REVEAL ANIMATION SYSTEM
// ============================================

(function() {
    // Reveal observer - triggers when elements scroll into view
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Don't unobserve - allows re-animation if needed
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    // Auto-detect and apply reveal classes to elements across all pages
    function initScrollReveal() {
        // Fade up - general sections, headings, text blocks
        const fadeUpSelectors = [
            '.tech-content', '.trade-content', '.innovation-content',
            '.product-section .product-row', '.product-content',
            '.challenges-content', '.challenges-image',
            '.product-details-box', '.quote-form-wrapper',
            '.product-category-hero-content',
            '.about-content', '.about-image',
            '.sustainability-content',
            '.contact-form-container', '.contact-info-container',
            '.capability-card', '.process-step',
            '.footer-nexgen-grid',
            'section > .container > h2',
            'section > .container > p',
            '.section-header',
            '.product-detail-wrapper',
            '.product-gallery', '.product-info-palletco',
            '.data-section',
            '.hero-nexgen-content', '.industry-hero-content',
            '.page-header-content'
        ];

        // Slide from left - images on the left side
        const slideLeftSelectors = [
            '.product-row:not(.reverse) .product-image',
            '.tech-image',
            '.challenges-section .challenges-image'
        ];

        // Slide from right - images on the right side
        const slideRightSelectors = [
            '.product-row.reverse .product-image'
        ];

        // Scale up - cards, grid items
        const scaleSelectors = [
            '.product-card-nexgen', '.industry-card',
            '.product-card-minimal',
            '.stat-card', '.value-card',
            '.timeline-item'
        ];

        // Stagger children - grids and lists
        const staggerSelectors = [
            '.product-grid-minimal',
            '.capabilities-grid',
            '.process-steps',
            '.footer-nexgen-grid',
            '.related-products-grid',
            '.stats-grid', '.values-grid',
            '.data-grid'
        ];

        // Apply reveal class
        fadeUpSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.closest('.hero-nexgen, .industry-hero, .product-category-hero')) {
                    el.classList.add('reveal');
                    revealObserver.observe(el);
                }
            });
        });

        // Apply slide-left class
        slideLeftSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal-left');
                revealObserver.observe(el);
            });
        });

        // Apply slide-right class
        slideRightSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal-right');
                revealObserver.observe(el);
            });
        });

        // Apply scale class
        scaleSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('reveal-scale');
                revealObserver.observe(el);
            });
        });

        // Apply stagger class
        staggerSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('stagger-children');
                revealObserver.observe(el);
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }
})();

// Parallax effect - disabled for better performance
// Uncomment if you want parallax, but it may cause scroll lag
/*
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-nexgen, .sustainability-nexgen, .rtp-section');
            parallaxElements.forEach(element => {
                const speed = 0.3;
                element.style.backgroundPositionY = -(scrolled * speed) + 'px';
            });
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });
*/

// ============================================
// IMAGE & VIDEO PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load videos when they come into view
const lazyLoadVideos = () => {
    const videos = document.querySelectorAll('video[preload="metadata"]');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                // Start loading the video when it's about to be visible
                video.preload = 'auto';
                video.load();
                videoObserver.unobserve(video);
            }
        });
    }, {
        rootMargin: '100px 0px', // Start loading 100px before video is visible
        threshold: 0
    });
    
    videos.forEach(video => videoObserver.observe(video));
};

// Optimize images by adding decode async
const optimizeImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        // Add decode async for smoother rendering
        img.decoding = 'async';
        
        // Add error handling for broken images
        img.onerror = function() {
            this.style.opacity = '0.5';
            console.warn('Failed to load image:', this.src);
        };
    });
};

// Preload critical images (above the fold)
const preloadCriticalImages = () => {
    const criticalImages = document.querySelectorAll('.hero-nexgen img, .navbar-nexgen img');
    
    criticalImages.forEach(img => {
        if (img.loading === 'lazy') {
            img.loading = 'eager';
        }
        img.fetchPriority = 'high';
    });
};

// Connection-aware loading - reduce quality on slow connections
const connectionAwareLoading = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Disable autoplay for videos on slow connections
            document.querySelectorAll('video[autoplay]').forEach(video => {
                video.removeAttribute('autoplay');
                video.poster = video.querySelector('source')?.src?.replace('.mp4', '-poster.jpg') || '';
            });
            
            // Slow connection detected - video autoplay disabled
        }
    }
};

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    preloadCriticalImages();
    optimizeImages();
    lazyLoadVideos();
    connectionAwareLoading();
});

// ============================================
// JOB APPLICATION FORM - FILE UPLOAD
// ============================================

// File upload handling for resume
const resumeInput = document.getElementById('resume');
const fileNameDisplay = document.querySelector('.file-name-display');

if (resumeInput && fileNameDisplay) {
    resumeInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Check file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                alert('File size exceeds 5MB. Please upload a smaller file.');
                this.value = '';
                fileNameDisplay.classList.remove('show');
                fileNameDisplay.textContent = '';
                return;
            }
            
            // Check file type
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const fileName = file.name.toLowerCase();
            const isValidType = allowedTypes.some(type => fileName.endsWith(type));
            
            if (!isValidType) {
                alert('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
                this.value = '';
                fileNameDisplay.classList.remove('show');
                fileNameDisplay.textContent = '';
                return;
            }
            
            // Display file name
            fileNameDisplay.textContent = file.name;
            fileNameDisplay.classList.add('show');
        } else {
            fileNameDisplay.classList.remove('show');
            fileNameDisplay.textContent = '';
        }
    });
}

// Application form submission
const applicationForm = document.getElementById('applicationForm');
if (applicationForm) {
    applicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        
        // Log form data (in production, this would be sent to a server)
        // Application submitted
        // Form data processed
        
        // Show success message
        alert('Thank you for your application! Our HR team will review your resume and get back to you soon.');
        
        // Reset form
        this.reset();
        if (fileNameDisplay) {
            fileNameDisplay.classList.remove('show');
            fileNameDisplay.textContent = '';
        }
    });
}

// Drag and drop functionality for file upload
const fileUploadBox = document.querySelector('.file-upload-box');
if (fileUploadBox && resumeInput) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadBox.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadBox.addEventListener(eventName, () => {
            fileUploadBox.style.borderColor = '#3b82f6';
            fileUploadBox.style.background = '#f0f7ff';
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadBox.addEventListener(eventName, () => {
            fileUploadBox.style.borderColor = '#e2e8f0';
            fileUploadBox.style.background = '#f8fafc';
        }, false);
    });
    
    fileUploadBox.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            resumeInput.files = files;
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            resumeInput.dispatchEvent(event);
        }
    }, false);
}

// ============================================
// PRODUCT DETAIL PAGE FUNCTIONS
// ============================================

// Quantity selector functions
function decreaseQty() {
    const qtyInput = document.getElementById('productQty');
    if (qtyInput && qtyInput.value > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
    }
}

function increaseQty() {
    const qtyInput = document.getElementById('productQty');
    if (qtyInput) {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    }
}

// Request quote function
function requestQuote() {
    const qtyInput = document.getElementById('productQty');
    const quantity = qtyInput ? qtyInput.value : 1;
    
    // Check if there's a quote form on the current page
    const quoteForm = document.getElementById('quoteForm');
    const quoteQuantity = document.getElementById('quoteQuantity');
    
    if (quoteForm && quoteQuantity) {
        // Set quantity and scroll to quote form
        quoteQuantity.value = quantity;
        quoteForm.scrollIntoView({ behavior: 'smooth' });
    } else {
        // No quote form found, redirect to contact page
        const pageTitle = document.querySelector('h1')?.textContent || 'Product';
        const pageUrl = window.location.href;
        
        // Create quote request message
        const message = `Quote Request - ${pageTitle}\nQuantity: ${quantity}\nProduct Page: ${pageUrl}`;
        
        // Redirect to contact page with pre-filled message
        window.location.href = `../contact.html?message=${encodeURIComponent(message)}`;
    }
}

// Add to wishlist function
function addToWishlist() {
    const wishlistBtn = document.querySelector('.wishlist-btn-palletco');
    const icon = wishlistBtn?.querySelector('i');
    
    if (!wishlistBtn || !icon) return;
    
    // Toggle heart icon
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Added to wishlist';
        
        // Show success message
        showNotification('Product added to wishlist!');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to wishlist';
        
        // Show removed message
        showNotification('Product removed from wishlist');
    }
}

// Notification helper function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'wishlist-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #16a89a;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
