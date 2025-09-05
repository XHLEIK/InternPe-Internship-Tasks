// ===============================================
// SHOP PAGE FUNCTIONALITY
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // SHOP HERO SLIDER FUNCTIONALITY
    // ===============================================
    const shopHeroSlidesWrapper = document.getElementById('shopHeroSlidesWrapper');
    const shopHeroPrevBtn = document.getElementById('shopHeroPrevBtn');
    const shopHeroNextBtn = document.getElementById('shopHeroNextBtn');
    const shopHeroIndicators = document.getElementById('shopHeroIndicators');
    const shopHeroSlides = document.querySelectorAll('.shop-hero-slide');
    const shopHeroIndicatorDots = document.querySelectorAll('.shop-hero-indicator');
    
    let currentShopHeroSlide = 0;
    const totalShopHeroSlides = shopHeroSlides.length;
    
    // Function to update shop hero slider position
    function updateShopHeroSlider() {
        const translateX = -currentShopHeroSlide * (100 / totalShopHeroSlides);
        if (shopHeroSlidesWrapper) {
            shopHeroSlidesWrapper.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update active states
        shopHeroSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentShopHeroSlide);
        });
        
        shopHeroIndicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentShopHeroSlide);
        });
    }
    
    // Next slide function
    function nextShopHeroSlide() {
        currentShopHeroSlide = (currentShopHeroSlide + 1) % totalShopHeroSlides;
        updateShopHeroSlider();
    }
    
    // Previous slide function
    function prevShopHeroSlide() {
        currentShopHeroSlide = (currentShopHeroSlide - 1 + totalShopHeroSlides) % totalShopHeroSlides;
        updateShopHeroSlider();
    }
    
    // Go to specific slide
    function goToShopHeroSlide(slideIndex) {
        currentShopHeroSlide = slideIndex;
        updateShopHeroSlider();
    }
    
    // Event listeners for navigation buttons
    if (shopHeroPrevBtn && shopHeroNextBtn) {
        shopHeroPrevBtn.addEventListener('click', prevShopHeroSlide);
        shopHeroNextBtn.addEventListener('click', nextShopHeroSlide);
    }
    
    // Event listeners for indicator dots
    shopHeroIndicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToShopHeroSlide(index));
    });
    
    // Auto-play functionality for shop hero
    let shopHeroAutoPlayInterval;
    
    function startShopHeroAutoPlay() {
        shopHeroAutoPlayInterval = setInterval(nextShopHeroSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopShopHeroAutoPlay() {
        clearInterval(shopHeroAutoPlayInterval);
    }
    
    // Start auto-play
    if (shopHeroSlidesWrapper) {
        startShopHeroAutoPlay();
    }
    
    // Pause auto-play on hover
    const shopHeroSliderContainer = document.querySelector('.shop-hero-slider-container');
    if (shopHeroSliderContainer) {
        shopHeroSliderContainer.addEventListener('mouseenter', stopShopHeroAutoPlay);
        shopHeroSliderContainer.addEventListener('mouseleave', startShopHeroAutoPlay);
    }
    
    // Touch/swipe support for shop hero slider on mobile
    let shopHeroStartX, shopHeroStartY, shopHeroDistX, shopHeroDistY;
    const shopHeroSwipeThreshold = 100;
    
    if (shopHeroSliderContainer) {
        shopHeroSliderContainer.addEventListener('touchstart', function(e) {
            shopHeroStartX = e.touches[0].clientX;
            shopHeroStartY = e.touches[0].clientY;
            stopShopHeroAutoPlay();
        });
        
        shopHeroSliderContainer.addEventListener('touchmove', function(e) {
            if (Math.abs(e.touches[0].clientX - shopHeroStartX) > Math.abs(e.touches[0].clientY - shopHeroStartY)) {
                e.preventDefault();
            }
        });
        
        shopHeroSliderContainer.addEventListener('touchend', function(e) {
            shopHeroDistX = e.changedTouches[0].clientX - shopHeroStartX;
            shopHeroDistY = e.changedTouches[0].clientY - shopHeroStartY;
            
            if (Math.abs(shopHeroDistX) > Math.abs(shopHeroDistY) && Math.abs(shopHeroDistX) > shopHeroSwipeThreshold) {
                if (shopHeroDistX > 0) {
                    prevShopHeroSlide();
                } else {
                    nextShopHeroSlide();
                }
            }
            
            setTimeout(startShopHeroAutoPlay, 2000);
        });
    }
    
    // Initialize shop hero slider
    if (shopHeroSlidesWrapper) {
        updateShopHeroSlider();
    }
    
    // Add scroll behavior for browse buttons
    const shopBrowseBtns = document.querySelectorAll('.shop-browse-btn');
    shopBrowseBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const shopSection = document.getElementById('shop-section');
            if (shopSection) {
                shopSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===============================================
    // PRODUCT DATA AND SHOP FUNCTIONALITY
    // ===============================================
    
    // Product Data
    const products = [
        // Men's Fashion
        { id: 1, name: "Classic Leather Jacket", category: "men", price: 5999, originalPrice: 8999, image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 2, name: "Denim Casual Shirt", category: "men", price: 1999, originalPrice: 2999, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", badge: "New" },
        { id: 3, name: "Cotton Polo T-Shirt", category: "men", price: 1299, originalPrice: null, image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=400&fit=crop", badge: null },
        { id: 4, name: "Slim Fit Chinos", category: "men", price: 2499, originalPrice: 3499, image: "https://images.unsplash.com/photo-1506629905607-c0a7d51b6111?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 5, name: "Casual Sneakers", category: "men", price: 3999, originalPrice: null, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", badge: "Popular" },
        { id: 6, name: "Winter Hoodie", category: "men", price: 2799, originalPrice: 3999, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 7, name: "Classic Watch", category: "men", price: 4499, originalPrice: null, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", badge: "Premium" },
        { id: 8, name: "Cargo Shorts", category: "men", price: 1799, originalPrice: 2299, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 9, name: "Flannel Shirt", category: "men", price: 2299, originalPrice: null, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop", badge: null },
        { id: 10, name: "Canvas Backpack", category: "men", price: 3299, originalPrice: 4499, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", badge: "Sale" },

        // Women's Fashion
        { id: 11, name: "Floral Summer Dress", category: "women", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 12, name: "Silk Blouse", category: "women", price: 2799, originalPrice: null, image: "https://images.unsplash.com/photo-1564257577-f1e0b5b1b02f?w=400&h=400&fit=crop", badge: "New" },
        { id: 13, name: "High Waist Jeans", category: "women", price: 2999, originalPrice: 3999, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop", badge: "Popular" },
        { id: 14, name: "Elegant Handbag", category: "women", price: 4999, originalPrice: null, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", badge: "Premium" },
        { id: 15, name: "Knit Cardigan", category: "women", price: 2499, originalPrice: 3299, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 16, name: "Midi Skirt", category: "women", price: 1999, originalPrice: null, image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d57?w=400&h=400&fit=crop", badge: null },
        { id: 17, name: "Leather Boots", category: "women", price: 5499, originalPrice: 6999, image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 18, name: "Cropped Jacket", category: "women", price: 3799, originalPrice: null, image: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=400&h=400&fit=crop", badge: "New" },
        { id: 19, name: "Statement Necklace", category: "women", price: 1499, originalPrice: 1999, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 20, name: "Wrap Top", category: "women", price: 1799, originalPrice: null, image: "https://images.unsplash.com/photo-1566479179817-317b7e7d8b8c?w=400&h=400&fit=crop", badge: null },

        // Formal Wear
        { id: 21, name: "Business Suit", category: "formal", price: 12999, originalPrice: 15999, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", badge: "Premium" },
        { id: 22, name: "Formal Blazer", category: "formal", price: 6999, originalPrice: 8999, image: "https://images.unsplash.com/photo-1594938390532-fcd4d30a4d16?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 23, name: "Evening Gown", category: "formal", price: 8999, originalPrice: null, image: "https://images.unsplash.com/photo-1566479179817-317b7e7d8b8c?w=400&h=400&fit=crop", badge: "Elegant" },
        { id: 24, name: "Dress Shirt", category: "formal", price: 2499, originalPrice: 3199, image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 25, name: "Formal Shoes", category: "formal", price: 7499, originalPrice: null, image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop", badge: "Premium" },
        { id: 26, name: "Silk Tie", category: "formal", price: 999, originalPrice: 1499, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 27, name: "Cocktail Dress", category: "formal", price: 5999, originalPrice: 7999, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 28, name: "Formal Trousers", category: "formal", price: 3499, originalPrice: null, image: "https://images.unsplash.com/photo-1506629905607-c0a7d51b6111?w=400&h=400&fit=crop", badge: null },
        { id: 29, name: "Pearl Earrings", category: "formal", price: 2999, originalPrice: null, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", badge: "Elegant" },
        { id: 30, name: "Cufflinks Set", category: "formal", price: 1999, originalPrice: 2799, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", badge: "Sale" },

        // Casual Wear
        { id: 31, name: "Basic T-Shirt", category: "casual", price: 799, originalPrice: null, image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=400&fit=crop", badge: "Basic" },
        { id: 32, name: "Relaxed Jeans", category: "casual", price: 2199, originalPrice: 2999, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop", badge: "Comfort" },
        { id: 33, name: "Casual Sneakers", category: "casual", price: 2999, originalPrice: null, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", badge: "Comfort" },
        { id: 34, name: "Denim Jacket", category: "casual", price: 3499, originalPrice: 4499, image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 35, name: "Casual Shorts", category: "casual", price: 1499, originalPrice: null, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", badge: null },
        { id: 36, name: "Sweatshirt", category: "casual", price: 1999, originalPrice: 2699, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", badge: "Cozy" },
        { id: 37, name: "Canvas Shoes", category: "casual", price: 1799, originalPrice: null, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", badge: "Classic" },
        { id: 38, name: "Baseball Cap", category: "casual", price: 899, originalPrice: 1299, image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop", badge: "Sale" },
        { id: 39, name: "Casual Dress", category: "casual", price: 2299, originalPrice: null, image: "https://images.unsplash.com/photo-1566479179817-317b7e7d8b8c?w=400&h=400&fit=crop", badge: "Comfort" },
        { id: 40, name: "Flannel Pajama", category: "casual", price: 1699, originalPrice: 2199, image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop", badge: "Cozy" },

        // Sports Wear
        { id: 41, name: "Athletic Leggings", category: "sports", price: 1999, originalPrice: null, image: "https://images.unsplash.com/photo-1506629905607-c0a7d51b6111?w=400&h=400&fit=crop", badge: "Performance" },
        { id: 42, name: "Running Shoes", category: "sports", price: 4999, originalPrice: 6499, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", badge: "Performance" },
        { id: 43, name: "Gym Tank Top", category: "sports", price: 1299, originalPrice: null, image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=400&fit=crop", badge: "Breathable" },
        { id: 44, name: "Sports Bra", category: "sports", price: 1799, originalPrice: 2299, image: "https://images.unsplash.com/photo-1506629905607-c0a7d51b6111?w=400&h=400&fit=crop", badge: "Support" },
        { id: 45, name: "Training Shorts", category: "sports", price: 1599, originalPrice: null, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop", badge: "Flexible" },
        { id: 46, name: "Yoga Mat", category: "sports", price: 2499, originalPrice: 3199, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", badge: "Premium" },
        { id: 47, name: "Water Bottle", category: "sports", price: 799, originalPrice: null, image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop", badge: "Essential" },
        { id: 48, name: "Fitness Tracker", category: "sports", price: 6999, originalPrice: 8999, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", badge: "Tech" },
        { id: 49, name: "Compression Shirt", category: "sports", price: 2299, originalPrice: null, image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=400&fit=crop", badge: "Performance" },
        { id: 50, name: "Athletic Backpack", category: "sports", price: 3499, originalPrice: 4299, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", badge: "Durable" },

        // Accessories
        { id: 51, name: "Designer Sunglasses", category: "accessories", price: 3999, originalPrice: null, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", badge: "Trendy" },
        { id: 52, name: "Leather Wallet", category: "accessories", price: 1999, originalPrice: 2699, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop", badge: "Classic" },
        { id: 53, name: "Gold Bracelet", category: "accessories", price: 7999, originalPrice: null, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", badge: "Luxury" },
        { id: 54, name: "Silk Scarf", category: "accessories", price: 1499, originalPrice: 1999, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop", badge: "Elegant" },
        { id: 55, name: "Leather Belt", category: "accessories", price: 1799, originalPrice: null, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", badge: "Essential" },
        { id: 56, name: "Phone Case", category: "accessories", price: 899, originalPrice: 1299, image: "https://images.unsplash.com/photo-1512499617640-c2f999e7f1f5?w=400&h=400&fit=crop", badge: "Protective" },
        { id: 57, name: "Hair Accessories", category: "accessories", price: 699, originalPrice: null, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", badge: "Cute" },
        { id: 58, name: "Crossbody Bag", category: "accessories", price: 2999, originalPrice: 3999, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", badge: "Trendy" },
        { id: 59, name: "Ring Set", category: "accessories", price: 1299, originalPrice: null, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", badge: "Stylish" },
        { id: 60, name: "Keychain", category: "accessories", price: 399, originalPrice: 599, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", badge: "Cute" }
    ];

    // DOM Elements
    const searchInput = document.getElementById('productSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productsGrid = document.getElementById('productsGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    const productsCount = document.getElementById('productsCount');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');

    // State
    let currentCategory = 'all';
    let currentSearchTerm = '';
    let filteredProducts = [...products];

    // Initialize
    init();

    function init() {
        renderProducts(products);
        setupEventListeners();
        updateProductCount(products.length);
        hideLoading();
    }

    function setupEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', handleSearch);
        clearSearchBtn.addEventListener('click', clearSearch);
        
        // Category buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', handleCategoryClick);
        });

        // Add to cart buttons (will be added dynamically)
        document.addEventListener('click', handleAddToCart);
    }

    function handleSearch(e) {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (currentSearchTerm) {
            clearSearchBtn.classList.add('show');
        } else {
            clearSearchBtn.classList.remove('show');
        }
        
        filterProducts();
    }

    function clearSearch() {
        searchInput.value = '';
        currentSearchTerm = '';
        clearSearchBtn.classList.remove('show');
        filterProducts();
        searchInput.focus();
    }

    function handleCategoryClick(e) {
        const button = e.currentTarget;
        const category = button.dataset.category;
        
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current category
        currentCategory = category;
        
        // Update category title
        updateCategoryTitle(category);
        
        // Filter products
        filterProducts();
    }

    function updateCategoryTitle(category) {
        const titles = {
            'all': 'All Products',
            'men': "Men's Fashion",
            'women': "Women's Fashion",
            'formal': 'Formal Wear',
            'casual': 'Casual Wear',
            'sports': 'Sports Wear',
            'accessories': 'Accessories'
        };
        
        categoryTitle.textContent = titles[category] || 'All Products';
    }

    function filterProducts() {
        showLoading();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            let filtered = [...products];
            
            // Filter by category
            if (currentCategory !== 'all') {
                filtered = filtered.filter(product => product.category === currentCategory);
            }
            
            // Filter by search term
            if (currentSearchTerm) {
                filtered = filtered.filter(product => 
                    product.name.toLowerCase().includes(currentSearchTerm)
                );
            }
            
            filteredProducts = filtered;
            updateProductCount(filtered.length);
            
            if (filtered.length === 0) {
                showNoResults();
            } else {
                hideNoResults();
                renderProducts(filtered);
            }
            
            hideLoading();
        }, 300);
    }

    function renderProducts(products) {
        productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            showNoResults();
            return;
        }
        
        products.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });
        
        hideNoResults();
    }

    function createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.setProperty('--index', index);
        card.dataset.productId = product.id;
        
        const originalPriceHTML = product.originalPrice 
            ? `<span class="product-original-price">₹${product.originalPrice}</span>`
            : '';
            
        const badgeHTML = product.badge 
            ? `<div class="product-badge">${product.badge}</div>`
            : '';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${badgeHTML}
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    ₹${product.price}
                    ${originalPriceHTML}
                </div>
            </div>
        `;
        
        return card;
    }

    function getCategoryName(category) {
        const names = {
            'men': "Men's Fashion",
            'women': "Women's Fashion",
            'formal': 'Formal Wear',
            'casual': 'Casual Wear',
            'sports': 'Sports Wear',
            'accessories': 'Accessories'
        };
        
        return names[category] || category;
    }

    function handleAddToCart(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            e.preventDefault();
            const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
            const product = products.find(p => p.id == productId);
            
            if (product) {
                addToCart(product);
                showAddToCartFeedback(e.target.closest('.add-to-cart-btn'));
            }
        }
    }

    function addToCart(product) {
        // Use global cart system if available
        if (window.addToCart) {
            window.addToCart(product);
        } else {
            // Fallback for when cart system isn't loaded
            console.log('Added to cart:', product);
            showNotification(`${product.name} added to cart!`);
        }
    }

    function showAddToCartFeedback(button) {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.background = '';
        }, 1000);
    }

    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
        }, 3000);
    }

    function updateProductCount(count) {
        productsCount.textContent = count;
    }

    function showLoading() {
        loadingSpinner.style.display = 'block';
        productsGrid.style.display = 'none';
        noResults.style.display = 'none';
    }

    function hideLoading() {
        loadingSpinner.style.display = 'none';
        productsGrid.style.display = 'grid';
    }

    function showNoResults() {
        noResults.style.display = 'block';
        productsGrid.style.display = 'none';
    }

    function hideNoResults() {
        noResults.style.display = 'none';
    }

    // Back to top functionality (if not already in main script)
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Make products array globally available for potential external use
    window.shopProducts = products;
});
