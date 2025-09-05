// Simplified Cart Manager
class CartManager {
    constructor() {
        this.cart = [];
        this.loadCart();
    }

    // Initialize cart system
    init() {
        this.renderCart();
        this.updateCartBadge();
        this.updateSummary();
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Clear cart button
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.processCheckout());
        }

        // Promo code
        const promoBtn = document.getElementById('applyPromoBtn');
        if (promoBtn) {
            promoBtn.addEventListener('click', () => this.applyPromoCode());
        }
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('fashionStoreCart');
            this.cart = savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
        }
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('fashionStoreCart', JSON.stringify(this.cart));
            this.updateCartBadge();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Add item to cart
    addItem(product, size = 'M', color = 'Default') {
        console.log('Adding to cart:', product);
        
        const existingItem = this.cart.find(item => 
            item.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category || 'Fashion',
                size: size,
                color: color,
                quantity: 1
            });
        }

        this.saveCart();
        this.renderCart();
        this.updateSummary();
        this.showNotification('Product added to cart!');
    }

    // Remove item from cart
    removeItem(productId, size, color) {
        this.cart = this.cart.filter(item => 
            !(item.id === productId && item.size === size && item.color === color)
        );
        this.saveCart();
        this.renderCart();
        this.updateSummary();
        this.showNotification('Product removed from cart');
    }

    // Update quantity
    updateQuantity(productId, size, color, newQuantity) {
        const item = this.cart.find(item => 
            item.id === productId && item.size === size && item.color === color
        );

        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
            this.updateSummary();
        } else if (item && newQuantity <= 0) {
            this.removeItem(productId, size, color);
        }
    }

    // Clear cart
    clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.updateSummary();
            this.showNotification('Cart cleared');
        }
    }

    // Render cart
    renderCart() {
        const emptyCart = document.getElementById('emptyCart');
        const cartContainer = document.getElementById('cartItemsContainer');
        const cartItemsList = document.getElementById('cartItemsList');

        console.log('Rendering cart, items:', this.cart.length);

        if (this.cart.length === 0) {
            if (emptyCart) {
                emptyCart.style.display = 'block';
                console.log('Showing empty cart');
            }
            if (cartContainer) {
                cartContainer.style.display = 'none';
            }
            return;
        }

        if (emptyCart) {
            emptyCart.style.display = 'none';
        }
        if (cartContainer) {
            cartContainer.style.display = 'block';
            console.log('Showing cart container');
        }

        if (cartItemsList) {
            cartItemsList.innerHTML = this.cart.map(item => this.renderCartItem(item)).join('');
            console.log('Rendered cart items:', cartItemsList.innerHTML.length);
        }

        this.updateItemCount();
    }

    // Render individual cart item
    renderCartItem(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-category">${item.category}</p>
                    <div class="item-price">₹${item.price.toLocaleString()}</div>
                </div>
                
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', '${item.size}', '${item.color}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="cartManager.updateQuantity('${item.id}', '${item.size}', '${item.color}', parseInt(this.value))">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', '${item.size}', '${item.color}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="cartManager.removeItem('${item.id}', '${item.size}', '${item.color}')">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }

    // Update cart badge
    updateCartBadge() {
        const badge = document.getElementById('cartCount');
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        
        if (badge) {
            badge.textContent = itemCount;
            badge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        
        // Update all cart count elements
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = itemCount;
            el.style.display = itemCount > 0 ? 'flex' : 'none';
        });
    }

    // Update item count
    updateItemCount() {
        const itemCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const itemCountEl = document.getElementById('itemCount');
        const summaryItemCountEl = document.getElementById('summaryItemCount');
        
        if (itemCountEl) itemCountEl.textContent = itemCount;
        if (summaryItemCountEl) summaryItemCountEl.textContent = itemCount;
    }

    // Update summary
    updateSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const shipping = subtotal >= 999 ? 0 : 99;
        const total = subtotal + tax + shipping;

        // Update display
        this.updateElement('subtotalAmount', `₹${subtotal.toLocaleString()}`);
        this.updateElement('taxAmount', `₹${tax.toLocaleString()}`);
        this.updateElement('shippingAmount', shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`);
        this.updateElement('totalAmount', `₹${total.toLocaleString()}`);

        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    // Update element text
    updateElement(id, text) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }

    // Apply promo code
    applyPromoCode() {
        const promoInput = document.getElementById('promoInput');
        const promoMessage = document.getElementById('promoMessage');
        
        if (!promoInput || !promoMessage) return;

        const code = promoInput.value.trim().toLowerCase();
        
        // Simple promo codes
        const promoCodes = {
            'welcome10': { discount: 10, type: 'percentage' },
            'save50': { discount: 50, type: 'fixed' },
            'freeship': { discount: 0, type: 'shipping' }
        };

        if (promoCodes[code]) {
            promoMessage.textContent = 'Promo code applied successfully!';
            promoMessage.className = 'promo-message success';
            // Apply discount logic here
        } else {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message error';
        }
    }

    // Process checkout
    processCheckout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        alert('Proceeding to checkout... This is a demo.');
        // In a real app, redirect to checkout page
    }

    // Show notification
    showNotification(message) {
        // Simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            transition: opacity 0.3s;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Get cart data (for external access)
    getCart() {
        return [...this.cart];
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Make CartManager available globally
window.CartManager = CartManager;

// Helper function to extract product data from DOM element
function getProductDataFromElement(element) {
    const productCard = element.closest('.product-card');
    if (!productCard) {
        console.error('Product card not found');
        return null;
    }
    
    try {
        const id = productCard.getAttribute('data-product-id');
        const title = productCard.querySelector('.product-title')?.textContent?.trim();
        const category = productCard.querySelector('.product-category')?.textContent?.trim();
        const currentPriceText = productCard.querySelector('.current-price')?.textContent?.trim();
        const image = productCard.querySelector('.product-img')?.src;
        
        // Extract price number from text like "₹249"
        const price = currentPriceText ? parseInt(currentPriceText.replace(/[^\d]/g, '')) : 0;
        
        const productData = {
            id: id,
            name: title,
            price: price,
            image: image,
            category: category || 'Fashion'
        };
        
        console.log('Extracted product data:', productData);
        return productData;
    } catch (error) {
        console.error('Error extracting product data:', error);
        return null;
    }
}

// Make function available globally
window.getProductDataFromElement = getProductDataFromElement;

// Global addToCart function for compatibility with other pages
window.addToCart = function(productData) {
    console.log('Global addToCart called with:', productData);
    if (window.cartManager) {
        window.cartManager.addItem(productData);
    } else {
        console.error('Cart manager not initialized');
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.cartManager === 'undefined') {
        window.cartManager = new CartManager();
        window.cartManager.init();
        console.log('Simple cart manager initialized');
    }
});
