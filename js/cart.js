// Cart Management System
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.createCartElements();
    this.attachEventListeners();
    this.updateCartUI();
    this.updateCartBadge();
  }

  createCartElements() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fa fa-check"></i>
      </div>
      <span>Item added to cart!</span>
    `;
    document.body.appendChild(notification);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'cart-sidebar-overlay';
    document.body.appendChild(overlay);

    // Create cart sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'cart-sidebar';
    sidebar.innerHTML = `
      <div class="cart-sidebar-header">
        <h3>
          Shopping Cart
          <span class="cart-count-badge">0</span>
        </h3>
        <button class="cart-close-btn">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="cart-sidebar-items">
        <div class="cart-empty-message">
          <i class="fa fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      </div>
      <div class="cart-sidebar-footer">
        <div class="cart-total">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">$0.00</span>
        </div>
        <button class="cart-checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    `;
    document.body.appendChild(sidebar);

    // Add badge to cart icon
    const cartLink = document.querySelector('.custom-navbar-cta a[href="cart.html"]');
    if (cartLink && !cartLink.querySelector('.cart-icon-badge')) {
      const badge = document.createElement('span');
      badge.className = 'cart-icon-badge';
      badge.textContent = '0';
      cartLink.style.position = 'relative';
      cartLink.appendChild(badge);
    }
  }

  attachEventListeners() {
    // Cart icon click - open sidebar (prevent default navigation)
    const cartIcons = document.querySelectorAll('.custom-navbar-cta a[href="cart.html"]');
    cartIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openCartSidebar();
      });
    });

    // Close button
    const closeBtn = document.querySelector('.cart-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeCartSidebar());
    }

    // Overlay click
    const overlay = document.querySelector('.cart-sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeCartSidebar());
    }

    // Prevent all product-item links from navigating
    const productLinks = document.querySelectorAll('.product-item');
    productLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Add to cart buttons - icon-cross (plus buttons)
    const addToCartBtns = document.querySelectorAll('.product-item .icon-cross');
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productItem = btn.closest('.product-item');
        this.addToCart(productItem);
      });
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length > 0) {
          window.location.href = 'checkout.html';
        } else {
          alert('Your cart is empty!');
        }
      });
    }
  }

  addToCart(productItem) {
    const name = productItem.querySelector('.product-title').textContent;
    const priceText = productItem.querySelector('.product-price').textContent;
    const price = parseFloat(priceText.replace('$', ''));
    const image = productItem.querySelector('.product-thumbnail').src;

    // Check if item already exists
    const existingItem = this.items.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({
        name,
        price,
        image,
        quantity: 1
      });
    }

    this.saveCart();
    this.updateCartUI();
    this.updateCartBadge();
    this.showNotification();
    this.openCartSidebar();
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      this.closeCartSidebar();
    }, 3000);
  }

  removeFromCart(index) {
    this.items.splice(index, 1);
    this.saveCart();
    this.updateCartUI();
    this.updateCartBadge();
  }

  updateQuantity(index, change) {
    if (this.items[index]) {
      this.items[index].quantity += change;
      
      if (this.items[index].quantity <= 0) {
        this.removeFromCart(index);
      } else {
        this.saveCart();
        this.updateCartUI();
        this.updateCartBadge();
      }
    }
  }

  updateCartUI() {
    const itemsContainer = document.querySelector('.cart-sidebar-items');
    const emptyMessage = itemsContainer.querySelector('.cart-empty-message');
    const totalValue = document.querySelector('.cart-total-value');
    const countBadge = document.querySelector('.cart-count-badge');

    if (this.items.length === 0) {
      if (emptyMessage) {
        emptyMessage.style.display = 'block';
      }
      if (totalValue) {
        totalValue.textContent = '$0.00';
      }
      if (countBadge) {
        countBadge.textContent = '0';
      }
      // Remove all cart items
      const existingItems = itemsContainer.querySelectorAll('.cart-item');
      existingItems.forEach(item => item.remove());
      return;
    }

    if (emptyMessage) {
      emptyMessage.style.display = 'none';
    }

    // Clear existing items
    const existingItems = itemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());

    // Add items
    let total = 0;
    let totalItems = 0;

    this.items.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      totalItems += item.quantity;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="cart-item-controls">
            <div class="cart-item-quantity">
              <button class="cart-qty-btn cart-qty-minus" data-index="${index}">-</button>
              <span class="cart-qty-value">${item.quantity}</span>
              <button class="cart-qty-btn cart-qty-plus" data-index="${index}">+</button>
            </div>
            <button class="cart-item-remove" data-index="${index}">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      itemsContainer.appendChild(cartItem);
    });

    // Update total
    if (totalValue) {
      totalValue.textContent = `$${total.toFixed(2)}`;
    }

    // Update count
    if (countBadge) {
      countBadge.textContent = totalItems;
    }

    // Attach event listeners to new buttons
    this.attachCartItemListeners();
  }

  attachCartItemListeners() {
    // Quantity buttons
    const minusBtns = document.querySelectorAll('.cart-qty-minus');
    const plusBtns = document.querySelectorAll('.cart-qty-plus');
    const removeBtns = document.querySelectorAll('.cart-item-remove');

    minusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        this.updateQuantity(index, -1);
      });
    });

    plusBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        this.updateQuantity(index, 1);
      });
    });

    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        this.removeFromCart(index);
      });
    });
  }

  updateCartBadge() {
    const badge = document.querySelector('.cart-icon-badge');
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  showNotification() {
    const notification = document.querySelector('.cart-notification');
    if (notification) {
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 2500);
    }
  }

  openCartSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.add('active');
    }
    if (overlay) {
      overlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  closeCartSidebar() {
    const sidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.cart-sidebar-overlay');
    
    if (sidebar) {
      sidebar.classList.remove('active');
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  saveCart() {
    localStorage.setItem('furniCart', JSON.stringify(this.items));
  }

  loadCart() {
    const saved = localStorage.getItem('furniCart');
    return saved ? JSON.parse(saved) : [];
  }

  getItems() {
    return this.items;
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
    this.updateCartBadge();
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new ShoppingCart();
});