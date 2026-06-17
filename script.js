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

// Handle dropdown toggle on mobile and touch devices
const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
const dropdownToggles = document.querySelectorAll('.dropdown > .dropdown-toggle');
dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        const parent = this.parentElement;
        if (window.innerWidth <= 1138) {
            // Mobile/Tablet drawer view
            e.preventDefault();
            closeAllDropdowns(parent);
            parent.classList.toggle('active');
        } else if (isTouchDevice) {
            // Touch device in desktop navbar view (e.g. iPad landscape)
            // First tap: open dropdown, prevent navigation
            // Second tap (dropdown already open): navigate to link
            if (!parent.classList.contains('touch-open')) {
                e.preventDefault();
                closeAllDropdowns(parent);
                document.querySelectorAll('.dropdown.touch-open').forEach(d => d.classList.remove('touch-open'));
                parent.classList.add('touch-open');
            }
        }
    });
});

// Close touch-opened dropdowns when tapping outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.touch-open').forEach(d => d.classList.remove('touch-open'));
    }
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

/* ===== Home "Contact Us" form: Product Required -> Size & Model, phone country -> city suggestions ===== */
(function () {
    const PRODUCT_CATALOG = {
        'Plastic Pallets': [
            { name: 'Plastic Pallet NG-1210HY-16-3', size: 'L: 1200 x W: 1000 x H: 160mm' },
            { name: 'Plastic Pallet NG-1212REV-14-6', size: 'L: 1200 x W: 1200 x H: 140mm' },
            { name: 'Plastic Pallet NG-1113-15-6', size: 'L: 1300 x W: 1100 x H: 150mm' },
            { name: 'Plastic Pallet NG-1210-14-9', size: 'L: 1200 x W: 1000 x H: 140mm' },
            { name: 'Plastic Pallet NG-1210-15-5', size: 'L: 1200 x W: 1000 x H: 160mm' },
            { name: 'Plastic Pallet NG-1210-15-3', size: 'L: 1200 x W: 1000 x H: 150mm' },
            { name: 'Plastic Pallet NG-1210-15-5', size: 'L: 1200 x W: 1000 x H: 150mm' },
            { name: 'Plastic Pallet NG-1111-15-6', size: 'L: 1100 x W: 1100 x H: 150mm' },
            { name: 'Plastic Pallet NG-1208-15-3', size: 'L: 1200 x W: 800 x H: 150mm' },
            { name: 'Plastic Pallet NG-1210-15-6', size: 'L: 1200 x W: 1000 x H: 150mm' }
        ],
        'Small Containers': [
            { name: 'Plastic Crate Closed 60x40x28cm', size: 'L: 600 x W: 400 x H: 280mm' },
            { name: 'Plastic Crate Closed 630x380x297mm', size: 'L: 630 x W: 380 x H: 297mm' },
            { name: 'Plastic Crate Ventilated 630x380x297mm', size: 'L: 630 x W: 380 x H: 297mm' },
            { name: 'Plastic Crate Closed 595x395x300mm', size: 'L: 595 x W: 395 x H: 300mm' },
            { name: 'Plastic Crate Ventilated 595x395x300mm', size: 'L: 595 x W: 395 x H: 300mm' },
            { name: 'Plastic Crate Closed 585x385x210mm', size: 'L: 585 x W: 385 x H: 210mm' },
            { name: 'Plastic Crate With Bail Arm 600x400x253mm', size: 'L: 600 x W: 400 x H: 253mm' },
            { name: 'Plastic Crate With Bail Arm 600x400x300mm', size: 'L: 600 x W: 400 x H: 300mm' },
            { name: 'Plastic Bottle Crate 447x362x313mm', size: 'L: 447 x W: 362 x H: 313mm' },
            { name: 'Plastic Nesting Crate 585x385x210mm (With Support)', size: 'L: 585 x W: 385 x H: 210mm' },
            { name: 'Plastic Document Container 560x386x333mm', size: 'L: 560 x W: 386 x H: 333mm' },
            { name: 'Plastic Fish Crate 600x400x350mm', size: 'L: 600 x W: 400 x H: 350mm' },
            { name: 'Plastic Ventilated Crate For Fruits 510x327x290mm (TPC Crate)', size: 'L: 510 x W: 327 x H: 290mm' },
            { name: 'Plastic Fish Crate Jumbo 1286x462x314mm', size: 'L: 1286 x W: 462 x H: 314mm' },
            { name: 'Plastic Live Chicken Cage', size: 'Heavy-Duty Poultry Transport' },
            { name: 'Plastic Nesting Crate 585x385x210mm', size: 'L: 585 x W: 385 x H: 210mm' },
            { name: 'Attached Lid Crate ALC-250', size: 'Attached Lid Crate' },
            { name: 'Attached Lid Crate ALC-320', size: 'Attached Lid Crate' },
            { name: 'Attached Lid Crate ALC-365', size: 'Attached Lid Crate' },
            { name: 'Attached Lid Crate ALC-416', size: 'Attached Lid Crate' }
        ],
        'Large Containers': [
            { name: 'Foldable Pallet Box NG-1210-100', size: 'L: 1200 x W: 1000 x H: 1000mm' },
            { name: 'Pallet Box NG1210/S2R', size: 'L: 1200 x W: 1000 x H: 800mm' },
            { name: 'Pallet Box Lid NG-1210', size: 'L: 1200 x W: 1000 x H: 50mm' },
            { name: 'Pallet Box NG-1208-80', size: 'L: 1200 x W: 800 x H: 800mm' },
            { name: 'Pallet Box NG-1210-76', size: 'L: 1200 x W: 1000 x H: 760mm' },
            { name: 'Pallet Box NG-1210-81', size: 'L: 1200 x W: 1000 x H: 810mm' },
            { name: 'Pallet Box NG-1210-91', size: 'L: 1200 x W: 1000 x H: 910mm' }
        ],
        'Waste Management': [
            { name: 'Waste Bin 120L', size: 'Capacity: 120 Liters' },
            { name: 'Waste Bin 240L', size: 'Capacity: 240 Liters' },
            { name: 'Waste Bin 360L', size: 'Capacity: 360 Liters' }
        ]
    };

    function escapeAttr(value) {
        return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    const productList = document.getElementById('productRequiredList');
    const sizeModelList = document.getElementById('sizeModelList');

    function renderSizeModel(category) {
        if (!sizeModelList) return;
        const items = PRODUCT_CATALOG[category] || [];
        if (!items.length) {
            sizeModelList.innerHTML = '<p class="size-model-empty">Select a product above to see available sizes &amp; models.</p>';
            return;
        }
        sizeModelList.innerHTML = items.map(function (item) {
            const value = item.size ? (item.name + ' \u2014 ' + item.size) : item.name;
            return '<label class="product-option-nexgen">' +
                '<input type="radio" name="size_model" value="' + escapeAttr(value) + '" required>' +
                '<span>' + escapeAttr(item.name) +
                (item.size ? '<small>' + escapeAttr(item.size) + '</small>' : '') +
                '</span></label>';
        }).join('');
    }

    if (productList && sizeModelList) {
        productList.addEventListener('change', function (e) {
            if (e.target && e.target.name === 'product_required') {
                renderSizeModel(e.target.value);
            }
        });
    }

    /* Contact phone field -> country -> city suggestions */
    const phoneInput = document.getElementById('contactPhone');
    const cityInput = document.getElementById('contactCity');
    const cityOptions = document.getElementById('cityOptionsNexgen');
    const cityCache = {};

    function setCities(cities) {
        if (!cityOptions) return;
        cityOptions.innerHTML = (cities || []).map(function (c) {
            return '<option value="' + escapeAttr(c) + '"></option>';
        }).join('');
    }

    function loadCities(countryName) {
        if (!countryName || !cityOptions) return;
        if (cityCache[countryName]) { setCities(cityCache[countryName]); return; }
        setCities([]);
        fetch('https://countriesnow.space/api/v0.1/countries/cities/q?country=' + encodeURIComponent(countryName))
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data && !data.error && Array.isArray(data.data)) {
                    cityCache[countryName] = data.data;
                    setCities(data.data);
                }
            })
            .catch(function () { /* leave City as free text */ });
    }

    if (phoneInput && typeof window.intlTelInput === 'function') {
        const iti = window.intlTelInput(phoneInput, {
            initialCountry: 'ae',
            separateDialCode: true,
            preferredCountries: ['ae', 'sa', 'qa', 'kw', 'om', 'bh']
        });

        function syncCountry() {
            const data = iti.getSelectedCountryData();
            if (!data || !data.name) return;
            const countryName = data.name.replace(/\s*\(.*$/, '').trim();
            if (cityInput) cityInput.placeholder = 'Select or type a city in ' + countryName;
            loadCities(countryName);
        }

        phoneInput.addEventListener('countrychange', syncCountry);
        syncCountry();
    }
})();
