// Advanced Shop Features: Cart, Wishlist, Quick View, Currency, Language, Pagination

// ============= CURRENCY & LANGUAGE =============
const currencies = {
    USD: { symbol: '$', rate: 1, name: 'US Dollar' },
    EUR: { symbol: '€', rate: 0.92, name: 'Euro' },
    GBP: { symbol: '£', rate: 0.79, name: 'British Pound' },
    CAD: { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
    AUD: { symbol: 'A$', rate: 1.53, name: 'Australian Dollar' },
    JPY: { symbol: '¥', rate: 149.50, name: 'Japanese Yen' }
};

const languages = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    ja: '日本語'
};

let currentCurrency = localStorage.getItem('currency') || 'USD';
let currentLanguage = localStorage.getItem('language') || 'en';

// ============= CART MANAGEMENT =============
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartBadge();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.save();
        this.updateCartBadge();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartBadge();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
            this.updateCartBadge();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clear() {
        this.items = [];
        this.save();
        this.updateCartBadge();
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const count = this.getItemCount();
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============= WISHLIST MANAGEMENT =============
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.updateWishlistBadge();
    }

    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        
        if (index > -1) {
            this.items.splice(index, 1);
            this.showNotification(`${product.name} removed from wishlist`, 'info');
        } else {
            this.items.push(product);
            this.showNotification(`${product.name} added to wishlist!`, 'success');
        }
        
        this.save();
        this.updateWishlistBadge();
        return index === -1; // Returns true if added
    }

    has(productId) {
        return this.items.some(item => item.id === productId);
    }

    save() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }

    updateWishlistBadge() {
        const badge = document.getElementById('wishlistBadge');
        if (badge) {
            badge.textContent = this.items.length;
            badge.style.display = this.items.length > 0 ? 'flex' : 'none';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============= PAGINATION =============
class Pagination {
    constructor(itemsPerPage = 12) {
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
    }

    paginate(items) {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return items.slice(startIndex, endIndex);
    }

    getTotalPages(totalItems) {
        return Math.ceil(totalItems / this.itemsPerPage);
    }

    goToPage(page, totalItems) {
        const totalPages = this.getTotalPages(totalItems);
        this.currentPage = Math.max(1, Math.min(page, totalPages));
    }

    renderPagination(totalItems, onPageChange) {
        const totalPages = this.getTotalPages(totalItems);
        const paginationHTML = [];

        // Previous button
        paginationHTML.push(`
            <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="pagination.goToPage(${this.currentPage - 1}, ${totalItems}); ${onPageChange}">
                Previous
            </button>
        `);

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            paginationHTML.push(`
                <button class="page-btn" onclick="pagination.goToPage(1, ${totalItems}); ${onPageChange}">1</button>
            `);
            if (startPage > 2) {
                paginationHTML.push(`<span class="pagination-ellipsis">...</span>`);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML.push(`
                <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                        onclick="pagination.goToPage(${i}, ${totalItems}); ${onPageChange}">
                    ${i}
                </button>
            `);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML.push(`<span class="pagination-ellipsis">...</span>`);
            }
            paginationHTML.push(`
                <button class="page-btn" onclick="pagination.goToPage(${totalPages}, ${totalItems}); ${onPageChange}">
                    ${totalPages}
                </button>
            `);
        }

        // Next button
        paginationHTML.push(`
            <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="pagination.goToPage(${this.currentPage + 1}, ${totalItems}); ${onPageChange}">
                Next
            </button>
        `);

        return paginationHTML.join('');
    }
}

// ============= QUICK VIEW MODAL =============
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quickViewModal');
    const modalContent = document.getElementById('quickViewContent');
    
    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    const price = formatPrice(product.price);
    const inWishlist = wishlist.has(product.id);

    modalContent.innerHTML = `
        <button class="modal-close" onclick="closeQuickView()">×</button>
        <div class="quick-view-grid">
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-info">
                <div class="product-category-tag">${product.category}</div>
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-count">(${Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                <div class="quick-view-price">${price}</div>
                <p class="quick-view-description">${product.description}</p>
                
                <div class="quick-view-specs">
                    <div class="spec-item">
                        <strong>SKU:</strong> ${product.sku}
                    </div>
                    <div class="spec-item">
                        <strong>Dimensions:</strong> ${product.dimensions}
                    </div>
                    <div class="spec-item">
                        <strong>Material:</strong> ${product.material}
                    </div>
                    <div class="spec-item">
                        <strong>Availability:</strong> 
                        <span class="stock-badge">${product.inStock} in stock</span>
                    </div>
                </div>

                <div class="quick-view-actions">
                    <div class="quantity-selector">
                        <button onclick="decrementQuantity()">-</button>
                        <input type="number" id="quickViewQuantity" value="1" min="1" max="${product.inStock}">
                        <button onclick="incrementQuantity(${product.inStock})">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCartFromQuickView(${product.id})">
                        Add to Cart
                    </button>
                    <button class="wishlist-btn-large ${inWishlist ? 'active' : ''}" 
                            onclick="toggleWishlistFromQuickView(${product.id})">
                        ${inWishlist ? '♥' : '♡'}
                    </button>
                </div>

                <a href="product.html?id=${product.id}" class="view-full-details">
                    View Full Details →
                </a>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function incrementQuantity(max) {
    const input = document.getElementById('quickViewQuantity');
    input.value = Math.min(parseInt(input.value) + 1, max);
}

function decrementQuantity() {
    const input = document.getElementById('quickViewQuantity');
    input.value = Math.max(parseInt(input.value) - 1, 1);
}

function addToCartFromQuickView(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById('quickViewQuantity').value);
    cart.addItem(product, quantity);
}

function toggleWishlistFromQuickView(productId) {
    const product = products.find(p => p.id === productId);
    const added = wishlist.toggle(product);
    const btn = document.querySelector('.wishlist-btn-large');
    btn.textContent = added ? '♥' : '♡';
    btn.classList.toggle('active', added);
}

// ============= CURRENCY & LANGUAGE FUNCTIONS =============
function formatPrice(price) {
    const currency = currencies[currentCurrency];
    const convertedPrice = price * currency.rate;
    
    if (currentCurrency === 'JPY') {
        return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    return `${currency.symbol}${convertedPrice.toFixed(2).toLocaleString()}`;
}

function changeCurrency(newCurrency) {
    currentCurrency = newCurrency;
    localStorage.setItem('currency', newCurrency);
    
    // Update currency selector display
    const currencyBtn = document.getElementById('currencyBtn');
    if (currencyBtn) {
        currencyBtn.textContent = `${currencies[newCurrency].symbol} ${newCurrency}`;
    }
    
    // Re-render products with new currency
    if (typeof renderProducts === 'function') {
        renderProducts();
    }
    
    // Close dropdown
    const dropdown = document.getElementById('currencyDropdown');
    if (dropdown) dropdown.style.display = 'none';
}

function changeLanguage(newLanguage) {
    currentLanguage = newLanguage;
    localStorage.setItem('language', newLanguage);
    
    // Update language selector display
    const langBtn = document.getElementById('languageBtn');
    if (langBtn) {
        langBtn.textContent = languages[newLanguage];
    }
    
    // Close dropdown
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) dropdown.style.display = 'none';
    
    // In production, this would trigger translation
    console.log(`Language changed to: ${languages[newLanguage]}`);
}

// ============= CART SIDEBAR =============
function openCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    renderCartItems();
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button onclick="closeCartSidebar()" class="cta-button">Continue Shopping</button>
            </div>
        `;
        cartTotal.textContent = formatPrice(0);
        return;
    }

    cartItemsContainer.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="cart-item-quantity">
                    <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="cart.removeItem(${item.id}); renderCartItems()">×</button>
        </div>
    `).join('');

    cartTotal.textContent = formatPrice(cart.getTotal());
}

// ============= WHATSAPP CHECKOUT =============
function buildWhatsAppCartMessage() {
    const lines = [];
    lines.push('EC Interiors - New Cart Order');
    lines.push(`Currency: ${currentCurrency}`);
    try {
        const lang = languages && languages[currentLanguage] ? languages[currentLanguage] : currentLanguage;
        lines.push(`Language: ${lang}`);
    } catch (e) {}
    lines.push(`Items (${cart.getItemCount()}):`);
    cart.items.forEach(item => {
        const unit = formatPrice(item.price);
        const line = formatPrice(item.price * item.quantity);
        const sku = item.sku || 'N/A';
        lines.push(`- ${item.name} (SKU: ${sku}) x${item.quantity} @ ${unit} = ${line}`);
    });
    lines.push(`Total: ${formatPrice(cart.getTotal())}`);
    lines.push('');
    lines.push('Please confirm your name and delivery details. Thank you!');
    return lines.join('\n');
}

function checkoutViaWhatsApp() {
    if (!cart.items || cart.items.length === 0) {
        cart.showNotification('Your cart is empty', 'info');
        return;
    }
    const phone = '263777442441';
    const msg = buildWhatsAppCartMessage();
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    try { closeCartSidebar(); } catch (e) {}
    window.open(url, '_blank');
}

// ============= INITIALIZE =============
const cart = new ShoppingCart();
const wishlist = new Wishlist();
const pagination = new Pagination(12);

// Make functions globally available
window.cart = cart;
window.wishlist = wishlist;
window.pagination = pagination;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.incrementQuantity = incrementQuantity;
window.decrementQuantity = decrementQuantity;
window.addToCartFromQuickView = addToCartFromQuickView;
window.toggleWishlistFromQuickView = toggleWishlistFromQuickView;
window.formatPrice = formatPrice;
window.changeCurrency = changeCurrency;
window.changeLanguage = changeLanguage;
window.openCartSidebar = openCartSidebar;
window.closeCartSidebar = closeCartSidebar;
window.renderCartItems = renderCartItems;
window.checkoutViaWhatsApp = checkoutViaWhatsApp;
window.buildWhatsAppCartMessage = buildWhatsAppCartMessage;

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.id === 'quickViewModal') {
        closeQuickView();
    }
    if (e.target.id === 'cartOverlay') {
        closeCartSidebar();
    }
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.currency-selector')) {
        const dropdown = document.getElementById('currencyDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
    if (!e.target.closest('.language-selector')) {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
});
