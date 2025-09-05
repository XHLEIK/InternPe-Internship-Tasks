// ===============================================
// MOBILE NAVIGATION & HAMBURGER MENU
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburgerMenu = document.querySelector('.mobile-menu-toggle');
    const navbarContainer = document.querySelector('.navbar-container');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar li a');
    let mobileMenuOverlay;
    
    // Create mobile menu overlay
    function createMobileOverlay() {
        if (!mobileMenuOverlay) {
            mobileMenuOverlay = document.createElement('div');
            mobileMenuOverlay.className = 'mobile-menu-overlay';
            document.body.appendChild(mobileMenuOverlay);
            
            // Close menu when overlay is clicked
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        createMobileOverlay();
        navbarContainer.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = navbarContainer.classList.contains('active') ? 'hidden' : '';
        
        // Animate hamburger lines
        hamburgerMenu.classList.toggle('active');
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        navbarContainer.classList.remove('active');
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
        
        // Reset hamburger lines
        hamburgerMenu.classList.remove('active');
    }
    
    // Set active navigation link
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            // Check for exact match or hash match
            if (href === currentPath || (currentHash && href === currentHash)) {
                link.classList.add('active');
            }
        });
        
        // If no exact match, highlight first link for home page
        if (currentPath === '/' || currentPath.includes('index.html')) {
            navLinks[0].classList.add('active');
        }
    }
    
    // Event listeners
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when nav link is clicked (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
            
            // Handle smooth scrolling for hash links
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Update active state after scroll
                setTimeout(() => {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }, 100);
            }
        });
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
    
    // Set initial active state
    setActiveNavLink();
    
    // Update active state on scroll (for single page navigation)
    let ticking = false;
    function updateActiveOnScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const sections = document.querySelectorAll('section[id]');
                const scrollPos = window.scrollY + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = '#' + section.getAttribute('id');
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === sectionId) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateActiveOnScroll);
    
// ===============================================
// HERO OFFERS SLIDER FUNCTIONALITY
// ===============================================
    const heroSlidesWrapper = document.getElementById('heroSlidesWrapper');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    const heroIndicators = document.getElementById('heroIndicators');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicatorDots = document.querySelectorAll('.hero-indicator');
    
    let currentHeroSlide = 0;
    const totalHeroSlides = heroSlides.length;
    
    // Function to update hero slider position
    function updateHeroSlider() {
        const translateX = -currentHeroSlide * (100 / totalHeroSlides);
        heroSlidesWrapper.style.transform = `translateX(${translateX}%)`;
        
        // Update active states
        heroSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentHeroSlide);
        });
        
        heroIndicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentHeroSlide);
        });
    }
    
    // Next slide function
    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
        updateHeroSlider();
    }
    
    // Previous slide function
    function prevHeroSlide() {
        currentHeroSlide = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
        updateHeroSlider();
    }
    
    // Go to specific slide
    function goToHeroSlide(slideIndex) {
        currentHeroSlide = slideIndex;
        updateHeroSlider();
    }
    
    // Event listeners for navigation buttons
    if (heroPrevBtn && heroNextBtn) {
        heroPrevBtn.addEventListener('click', prevHeroSlide);
        heroNextBtn.addEventListener('click', nextHeroSlide);
    }
    
    // Event listeners for indicator dots
    heroIndicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToHeroSlide(index));
    });
    
    // Auto-play functionality
    let heroAutoPlayInterval;
    
    function startHeroAutoPlay() {
        heroAutoPlayInterval = setInterval(nextHeroSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopHeroAutoPlay() {
        clearInterval(heroAutoPlayInterval);
    }
    
    // Start auto-play
    startHeroAutoPlay();
    
    // Pause auto-play on hover
    const heroSliderContainer = document.querySelector('.hero-slider-container');
    if (heroSliderContainer) {
        heroSliderContainer.addEventListener('mouseenter', stopHeroAutoPlay);
        heroSliderContainer.addEventListener('mouseleave', startHeroAutoPlay);
    }
    
    // Keyboard navigation for hero slider
    document.addEventListener('keydown', function(e) {
        // Only handle arrow keys if we're not in an input field
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            if (e.key === 'ArrowLeft') {
                prevHeroSlide();
                stopHeroAutoPlay();
                setTimeout(startHeroAutoPlay, 3000); // Restart after 3 seconds
            } else if (e.key === 'ArrowRight') {
                nextHeroSlide();
                stopHeroAutoPlay();
                setTimeout(startHeroAutoPlay, 3000); // Restart after 3 seconds
            }
        }
    });
    
    // Touch/swipe support for hero slider on mobile
    let heroStartX, heroStartY, heroDistX, heroDistY;
    const heroSwipeThreshold = 100; // Minimum distance for swipe
    
    if (heroSliderContainer) {
        heroSliderContainer.addEventListener('touchstart', function(e) {
            heroStartX = e.touches[0].clientX;
            heroStartY = e.touches[0].clientY;
            stopHeroAutoPlay(); // Stop auto-play during touch interaction
        });
        
        heroSliderContainer.addEventListener('touchmove', function(e) {
            // Only prevent default if it's a horizontal swipe
            if (Math.abs(e.touches[0].clientX - heroStartX) > Math.abs(e.touches[0].clientY - heroStartY)) {
                e.preventDefault(); // Prevent scrolling for horizontal swipes
            }
        });
        
        heroSliderContainer.addEventListener('touchend', function(e) {
            heroDistX = e.changedTouches[0].clientX - heroStartX;
            heroDistY = e.changedTouches[0].clientY - heroStartY;
            
            // Check if it's a horizontal swipe
            if (Math.abs(heroDistX) > Math.abs(heroDistY) && Math.abs(heroDistX) > heroSwipeThreshold) {
                if (heroDistX > 0) {
                    prevHeroSlide(); // Swipe right - go to previous
                } else {
                    nextHeroSlide(); // Swipe left - go to next
                }
            }
            
            // Restart auto-play after touch interaction
            setTimeout(startHeroAutoPlay, 2000);
        });
    }
    
    // Initialize hero slider
    updateHeroSlider();
    
    // Add intersection observer for performance
    if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startHeroAutoPlay();
                } else {
                    stopHeroAutoPlay();
                }
            });
        });
        
        if (heroSliderContainer) {
            heroObserver.observe(heroSliderContainer);
        }
    }
});

// ===============================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ===============================================

document.querySelectorAll('#navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===============================================
// SHOP NOW BUTTON INTERACTION
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const shopNowBtn = document.querySelector('.shop-now-btn');
    
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // You can add navigation logic here
            // For example: window.location.href = 'shop.html';
            console.log('Shop Now clicked!');
        });
    }
});

// ===============================================
// HEADER SCROLL EFFECT
// ===============================================

window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// ===============================================
// FEATURES SECTION INTERACTIONS
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    const exploreButtons = document.querySelectorAll('.explore-btn');
    
    // Add click interactions to feature cards
    featureCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        card.addEventListener('click', function(e) {
            // Prevent default if clicking on the explore button
            if (!e.target.classList.contains('explore-btn')) {
                // Add click animation
                this.style.transform = 'translateY(-5px) scale(1.01)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                // Log category for navigation (replace with actual navigation)
                console.log(`Navigating to ${category} category`);
                // You can add navigation logic here
                // For example: window.location.href = `shop.html?category=${category}`;
            }
        });
        
        // Add hover sound effect simulation
        card.addEventListener('mouseenter', function() {
            // You can add sound effects here if needed
            console.log(`Hovering over ${category} category`);
        });
    });
    
    // Explore button interactions
    exploreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            e.preventDefault();
            
            const card = this.closest('.feature-card');
            const category = card.getAttribute('data-category');
            
            // Add button click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Navigation logic
            console.log(`Exploring ${category} collection`);
            // You can add navigation logic here
            // For example: window.location.href = `shop.html?category=${category}`;
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe feature cards for scroll animations
    featureCards.forEach(card => {
        observer.observe(card);
    });
});

// ===============================================
// FEATURED PRODUCTS FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Product Action Buttons
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist');
    const viewAllBtn = document.querySelector('.view-all-btn');

    // Quick View functionality
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            // Add visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show alert (replace with modal in real application)
            showNotification(`Quick view: ${productTitle}`, 'info');
            console.log('Quick view clicked for:', productTitle);
        });
    });

    // Add to Cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            
            // Get product data
            const productData = getProductDataFromElement(this);
            
            if (productData) {
                // Add visual feedback
                this.style.transform = 'scale(0.9)';
                this.style.background = 'rgba(46, 204, 113, 0.8)';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.background = '';
                }, 300);
                
                // Add to cart using global function
                if (window.addToCart) {
                    window.addToCart(productData);
                } else {
                    // Fallback notification
                    showNotification(`${productData.name} added to cart! (₹${productData.price})`, 'success');
                    console.log('Added to cart:', productData);
                }
            }
        });
    });

    // Add to Wishlist functionality
    addToWishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            // Toggle wishlist state
            const icon = this.querySelector('i');
            const isInWishlist = icon.classList.contains('fas');
            
            if (isInWishlist) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.background = 'rgba(231, 76, 60, 0.8)';
                showNotification(`${productTitle} removed from wishlist!`, 'info');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.background = 'rgba(255, 182, 193, 0.8)';
                showNotification(`${productTitle} added to wishlist! ❤️`, 'success');
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.background = '';
            }, 300);
            
            console.log('Wishlist toggled for:', productTitle, 'In wishlist:', !isInWishlist);
        });
    });

    // View All Products functionality
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            showNotification('Redirecting to all products...', 'info');
            console.log('View all products clicked');
        });
    }

    // Product Card Click functionality
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on action buttons
            if (e.target.closest('.action-btn')) return;
            
            const productTitle = this.querySelector('.product-title').textContent;
            showNotification(`Opening ${productTitle} details...`, 'info');
            console.log('Product card clicked:', productTitle);
        });
    });

    // Product hover effects enhancement
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle animation to product image
            const productImg = this.querySelector('.product-img');
            if (productImg) {
                productImg.style.transform = 'scale(1.05)';
            }
            
            // Animate stars
            const stars = this.querySelectorAll('.stars i');
            stars.forEach((star, index) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.2) rotate(5deg)';
                }, index * 50);
            });
        });

        card.addEventListener('mouseleave', function() {
            // Reset product image
            const productImg = this.querySelector('.product-img');
            if (productImg) {
                productImg.style.transform = '';
            }
            
            // Reset stars
            const stars = this.querySelectorAll('.stars i');
            stars.forEach(star => {
                star.style.transform = '';
            });
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateX(400px);
            transition: all 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    function getNotificationColor(type) {
        switch(type) {
            case 'success': return 'linear-gradient(45deg, #27ae60, #2ecc71)';
            case 'error': return 'linear-gradient(45deg, #e74c3c, #c0392b)';
            case 'warning': return 'linear-gradient(45deg, #f39c12, #e67e22)';
            default: return 'linear-gradient(45deg, #667eea, #764ba2)';
        }
    }

    // Add scroll animations for products
    const productObserverOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, productObserverOptions);

    // Observe all product cards
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        productObserver.observe(card);
    });
});

// ===============================================
// CALL TO ACTION FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer
    function startCountdown() {
        // Set the target date (5 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 5);
        targetDate.setHours(12, 30, 45, 0); // Set to 12:30:45

        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = targetDate.getTime() - now;

            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                // Update the display
                const daysEl = document.getElementById('days');
                const hoursEl = document.getElementById('hours');
                const minutesEl = document.getElementById('minutes');
                const secondsEl = document.getElementById('seconds');

                if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');

                // Add animation effect when seconds change
                if (secondsEl) {
                    secondsEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        secondsEl.style.transform = 'scale(1)';
                    }, 200);
                }
            } else {
                // Timer expired
                if (document.getElementById('days')) document.getElementById('days').textContent = '00';
                if (document.getElementById('hours')) document.getElementById('hours').textContent = '00';
                if (document.getElementById('minutes')) document.getElementById('minutes').textContent = '00';
                if (document.getElementById('seconds')) document.getElementById('seconds').textContent = '00';
            }
        }

        // Update countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Start the countdown
    startCountdown();

    // CTA Button Interactions
    const ctaPrimaryBtn = document.querySelector('.cta-primary-btn');
    const ctaSecondaryBtn = document.querySelector('.cta-secondary-btn');

    if (ctaPrimaryBtn) {
        ctaPrimaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show notification
            showNotification('Redirecting to sale items...', 'success');
            console.log('CTA Primary button clicked - Shop Now & Save');
            
            // In a real application, this would redirect to sale page
            setTimeout(() => {
                alert('This would redirect to the sale page with 70% off items!');
            }, 500);
        });
    }

    if (ctaSecondaryBtn) {
        ctaSecondaryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show notification
            showNotification('Loading all deals...', 'info');
            console.log('CTA Secondary button clicked - View All Deals');
            
            // In a real application, this would show deals page
            setTimeout(() => {
                alert('This would show all available deals and discounts!');
            }, 500);
        });
    }

    // Feature Items Hover Effects
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.color = '#ff8e8e';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = '';
                icon.style.color = '#ff6b6b';
            }
        });
    });

    // Time Unit Hover Effects
    const timeUnits = document.querySelectorAll('.time-unit');
    timeUnits.forEach(unit => {
        unit.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.25)';
            this.style.borderColor = 'rgba(255, 107, 107, 0.5)';
        });

        unit.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    });

    // Parallax Effect for Floating Elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const ctaSection = document.getElementById('cta-section');
        
        if (ctaSection) {
            const ctaTop = ctaSection.offsetTop;
            const ctaHeight = ctaSection.offsetHeight;
            
            // Check if CTA section is in viewport
            if (scrolled + window.innerHeight > ctaTop && scrolled < ctaTop + ctaHeight) {
                const elements = document.querySelectorAll('.float-element');
                elements.forEach((element, index) => {
                    const speed = (index + 1) * 0.1;
                    const yPos = -(scrolled - ctaTop) * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }
        }
    });

    // Intersection Observer for CTA Animation
    const ctaObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate CTA elements when they come into view
                const ctaContent = entry.target.querySelector('.cta-content');
                const ctaImage = entry.target.querySelector('.cta-image');
                
                if (ctaContent) {
                    ctaContent.style.opacity = '1';
                    ctaContent.style.transform = 'translateX(0)';
                }
                
                if (ctaImage) {
                    ctaImage.style.opacity = '1';
                    ctaImage.style.transform = 'translateX(0)';
                }

                // Animate floating elements
                const floatElements = entry.target.querySelectorAll('.float-element');
                floatElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'scale(1)';
                    }, index * 200);
                });
            }
        });
    }, ctaObserverOptions);

    // Observe CTA section
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
        // Initial state
        const ctaContent = ctaSection.querySelector('.cta-content');
        const ctaImage = ctaSection.querySelector('.cta-image');
        const floatElements = ctaSection.querySelectorAll('.float-element');

        if (ctaContent) {
            ctaContent.style.opacity = '0';
            ctaContent.style.transform = 'translateX(-50px)';
            ctaContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }

        if (ctaImage) {
            ctaImage.style.opacity = '0';
            ctaImage.style.transform = 'translateX(50px)';
            ctaImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }

        floatElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'scale(0)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        ctaObserver.observe(ctaSection);
    }

    // CTA Badge Animation
    const ctaBadge = document.querySelector('.cta-badge');
    if (ctaBadge) {
        setInterval(() => {
            ctaBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                ctaBadge.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
});

// ===============================================
// NEWSLETTER FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Basic email validation
            if (validateEmail(email)) {
                // Simulate successful subscription
                showNotification('🎉 Thank you for subscribing! Welcome to our newsletter.', 'success');
                emailInput.value = '';
                
                // Add success animation
                const signupBtn = newsletterForm.querySelector('.signup-btn');
                signupBtn.innerHTML = '<span>Subscribed!</span><i class="fas fa-check"></i>';
                signupBtn.style.background = 'linear-gradient(45deg, #34d399, #22c55e)';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    signupBtn.innerHTML = '<span>Sign Up</span><i class="fas fa-paper-plane"></i>';
                    signupBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
                }, 3000);
                
            } else {
                showNotification('❌ Please enter a valid email address.', 'error');
            }
        });
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `newsletter-notification ${type}`;
        notification.innerHTML = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(45deg, #34d399, #22c55e)' : 'linear-gradient(45deg, #ef4444, #f87171)'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
});

// ===============================================
// BACK TO TOP FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ===============================================
// FOOTER ANIMATIONS
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Animate footer elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe footer elements
    const footerElements = document.querySelectorAll('.footer-brand, .footer-links, .footer-contact');
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});
