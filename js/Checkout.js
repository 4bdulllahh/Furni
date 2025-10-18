// Checkout Page Script - Only runs on checkout page
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the checkout page
  const isCheckoutPage = document.querySelector('.site-block-order-table');
  
  if (!isCheckoutPage) {
    // Not on checkout page, don't run anything
    return;
  }

  // Wait a bit to ensure cart.js is loaded
  setTimeout(() => {
    initCheckout();
  }, 100);
});

function initCheckout() {
  // Load cart items from localStorage
  const cartData = localStorage.getItem('furniCart');
  const items = cartData ? JSON.parse(cartData) : [];

  console.log('Checkout items:', items); // Debug log

  // If cart is empty, show message
  if (items.length === 0) {
    showEmptyCartMessage();
    return;
  }

  // Update the order table
  updateOrderTable(items);
  
  // Display checkout items at top
  displayCheckoutItems(items);
  
  // Handle place order button
  handlePlaceOrder(items);
}

function updateOrderTable(items) {
  const orderTableBody = document.querySelector('.site-block-order-table tbody');
  
  if (!orderTableBody) {
    console.log('Order table not found');
    return;
  }

  // Clear all existing product rows
  orderTableBody.innerHTML = '';

  let subtotal = 0;

  // Add each cart item as a row
  items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name} <strong class="mx-2">x</strong> ${item.quantity}</td>
      <td>$${itemTotal.toFixed(2)}</td>
    `;
    orderTableBody.appendChild(row);
  });

  // Add subtotal row
  const subtotalRow = document.createElement('tr');
  subtotalRow.innerHTML = `
    <td class="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
    <td class="text-black">$${subtotal.toFixed(2)}</td>
  `;
  orderTableBody.appendChild(subtotalRow);

  // Add total row
  const totalRow = document.createElement('tr');
  totalRow.innerHTML = `
    <td class="text-black font-weight-bold"><strong>Order Total</strong></td>
    <td class="text-black font-weight-bold"><strong>$${subtotal.toFixed(2)}</strong></td>
  `;
  orderTableBody.appendChild(totalRow);
}

function displayCheckoutItems(items) {
  // Find the billing section
  const billingSection = document.querySelector('.col-md-6.mb-5.mb-md-0');
  
  if (!billingSection) {
    console.log('Billing section not found');
    return;
  }

  // Check if items display already exists
  if (document.querySelector('.checkout-cart-items')) {
    return;
  }

  const itemsDisplay = document.createElement('div');
  itemsDisplay.className = 'checkout-cart-items mb-4';
  
  let itemsHTML = `
    <h3 class="h5 mb-3 text-black font-weight-bold">Your Items (${items.length})</h3>
    <div class="checkout-items-list">
  `;

  items.forEach(item => {
    itemsHTML += `
      <div class="checkout-item">
        <div class="checkout-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="checkout-item-info">
          <h4 class="checkout-item-name">${item.name}</h4>
          <p class="checkout-item-quantity">Quantity: ${item.quantity}</p>
          <p class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `;
  });

  itemsHTML += `</div>`;
  itemsDisplay.innerHTML = itemsHTML;
  
  // Insert at the beginning of billing section
  billingSection.insertBefore(itemsDisplay, billingSection.firstChild);
}

function handlePlaceOrder(items) {
  const placeOrderBtn = document.querySelector('.btn-black.btn-lg.py-3.btn-block');
  
  if (!placeOrderBtn) {
    console.log('Place order button not found');
    return;
  }

  // Remove existing click handlers
  const newBtn = placeOrderBtn.cloneNode(true);
  placeOrderBtn.parentNode.replaceChild(newBtn, placeOrderBtn);

  newBtn.addEventListener('click', (e) => {
    console.log('Place order clicked');
    
    if (items.length === 0) {
      e.preventDefault();
      alert('Your cart is empty! Please add items before checkout.');
      window.location.href = 'shop.html';
      return;
    }
    
    // Get all required inputs
    const firstName = document.getElementById('c_fname');
    const lastName = document.getElementById('c_lname');
    const address = document.getElementById('c_address');
    const state = document.getElementById('c_state_country');
    const zip = document.getElementById('c_postal_zip');
    const email = document.getElementById('c_email_address');
    const phone = document.getElementById('c_phone');
    const country = document.getElementById('c_country');

    let isValid = true;
    let errorMessage = '';

    // Validate each field
    if (!firstName || !firstName.value.trim()) {
      isValid = false;
      errorMessage += '- First Name\n';
      if (firstName) firstName.style.borderColor = '#ff4444';
    } else if (firstName) {
      firstName.style.borderColor = '';
    }

    if (!lastName || !lastName.value.trim()) {
      isValid = false;
      errorMessage += '- Last Name\n';
      if (lastName) lastName.style.borderColor = '#ff4444';
    } else if (lastName) {
      lastName.style.borderColor = '';
    }

    if (!address || !address.value.trim()) {
      isValid = false;
      errorMessage += '- Address\n';
      if (address) address.style.borderColor = '#ff4444';
    } else if (address) {
      address.style.borderColor = '';
    }

    if (!state || !state.value.trim()) {
      isValid = false;
      errorMessage += '- State/Country\n';
      if (state) state.style.borderColor = '#ff4444';
    } else if (state) {
      state.style.borderColor = '';
    }

    if (!zip || !zip.value.trim()) {
      isValid = false;
      errorMessage += '- Postal/Zip Code\n';
      if (zip) zip.style.borderColor = '#ff4444';
    } else if (zip) {
      zip.style.borderColor = '';
    }

    if (!email || !email.value.trim()) {
      isValid = false;
      errorMessage += '- Email Address\n';
      if (email) email.style.borderColor = '#ff4444';
    } else if (email) {
      email.style.borderColor = '';
    }

    if (!phone || !phone.value.trim()) {
      isValid = false;
      errorMessage += '- Phone Number\n';
      if (phone) phone.style.borderColor = '#ff4444';
    } else if (phone) {
      phone.style.borderColor = '';
    }

    if (!country || country.value === '1') {
      isValid = false;
      errorMessage += '- Country\n';
      if (country) country.style.borderColor = '#ff4444';
    } else if (country) {
      country.style.borderColor = '';
    }

    if (!isValid) {
      e.preventDefault();
      alert('Please fill in all required fields:\n\n' + errorMessage);
      return;
    }

    // If valid, clear cart and proceed to thank you page
    localStorage.removeItem('furniCart');
    // Let the onclick handler proceed to thankyou.html
  });
}

function showEmptyCartMessage() {
  const container = document.querySelector('.untree_co-section .container');
  
  if (container) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'text-center py-5';
    emptyMessage.innerHTML = `
      <div style="padding: 60px 20px;">
        <i class="fa fa-shopping-cart" style="font-size: 80px; color: #d0d0d0; margin-bottom: 20px;"></i>
        <h2 class="mb-3">Your Cart is Empty</h2>
        <p class="mb-4" style="color: #6a6a6a;">Add some items to your cart before checking out.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    
    // Clear the existing content and show empty message
    const rowElement = container.querySelector('.row');
    if (rowElement) {
      rowElement.innerHTML = '';
      rowElement.appendChild(emptyMessage);
    }
  }
}