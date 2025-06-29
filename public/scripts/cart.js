const CART_KEY = 'techperipherals_cart';

// Obtener carrito
function getCart() {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    const parsedCart = cart ? JSON.parse(cart) : [];
    console.log('getCart() returning:', parsedCart);
    return parsedCart;
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
}

// Guardar carrito
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
    dispatchCartEvent();
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// Disparar evento de actualización
function dispatchCartEvent() {
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// API Pública del Carrito
const cart = {
  // Añadir al carrito
  add: (product, quantity = 1) => {
    console.log('Cart.add called with:', product, quantity);
    const cartItems = getCart();
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      console.log('Updated existing item:', existingItem);
    } else {
      const newItem = {
        id: product.id,
        name: product.title || product.name,
        price: parseFloat(product.price),
        image: product.image,
        quantity: parseInt(quantity)
      };
      cartItems.push(newItem);
      console.log('Added new item:', newItem);
    }
    
    saveCart(cartItems);
    const newCount = cart.count();
    console.log('Cart saved. Total items:', newCount);
    return newCount;
  },

  // Eliminar del carrito
  remove: (productId) => {
    console.log('Removing item with ID:', productId, 'Type:', typeof productId);
    const cartItems = getCart();
    const initialLength = cartItems.length;
    
    // Encontrar el índice del item a eliminar
    const itemIndex = cartItems.findIndex(item => {
      console.log('Comparing:', item.id, 'with', productId, 'Types:', typeof item.id, typeof productId);
      // Convertir ambos a string para comparación consistente
      return String(item.id) === String(productId);
    });
    
    console.log('Item index to remove:', itemIndex);
    
    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      saveCart(cartItems);
      console.log('Item removed successfully. New cart length:', cartItems.length);
      console.log('New cart contents:', cartItems);
    } else {
      console.warn('No item found with ID:', productId);
      console.log('Available items:', cartItems.map(item => ({id: item.id, name: item.name})));
    }
  },

  // Actualizar cantidad
  update: (productId, newQuantity) => {
    console.log('Updating item:', productId, 'to quantity:', newQuantity);
    const cartItems = getCart();
    const item = cartItems.find(item => String(item.id) === String(productId));
    
    if (item) {
      if (newQuantity <= 0) {
        // Si la cantidad es 0 o menos, eliminar el item
        cart.remove(productId);
        return;
      }
      
      item.quantity = Math.max(1, parseInt(newQuantity));
      saveCart(cartItems);
      console.log('Item updated:', item);
    } else {
      console.warn('Item not found for update:', productId);
      console.log('Available items:', cartItems.map(item => ({id: item.id, name: item.name})));
    }
  },

  // Obtener todos los items
  items: () => {
    const items = getCart();
    console.log('cart.items() called, returning:', items);
    return items;
  },

  // Contar items totales
  count: () => {
    const items = getCart();
    const count = items.reduce((total, item) => total + parseInt(item.quantity || 0), 0);
    console.log('cart.count() called, items:', items.length, 'total quantity:', count);
    return count;
  },

  // Calcular total
  total: () => {
    const items = getCart();
    const total = items.reduce((total, item) => {
      const price = parseFloat(item.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return total + (price * quantity);
    }, 0);
    console.log('cart.total() called, total:', total);
    return total;
  },

  // Limpiar carrito
  clear: () => {
    saveCart([]);
    console.log('Cart cleared');
  },

  // Manejar visibilidad del carrito
  open: () => {
    console.log('Opening cart drawer');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer) {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden';
      console.log('Cart drawer opened');
    } else {
      console.error('Cart drawer element not found');
    }
    
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  },

  close: () => {
    console.log('Closing cart drawer');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer) {
      drawer.classList.add('translate-x-full');
      drawer.classList.remove('translate-x-0');
      document.body.style.overflow = '';
      console.log('Cart drawer closed');
    }
    
    if (overlay) {
      overlay.classList.add('hidden');
    }
  },

  // Inicializar carrito
  init: () => {
    console.log('Initializing cart');
    updateCartUI();
    
    // Remover listener anterior si existe
    window.removeEventListener('cartUpdated', updateCartUI);
    window.addEventListener('cartUpdated', updateCartUI);
    
    // Agregar event listener para cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        cart.close();
      }
    });
    
    console.log('Cart initialized. Current items:', cart.count());
  }
};

// Actualizar UI del carrito
function updateCartUI() {
  console.log('Updating cart UI');
  
  // Forzar recálculo desde localStorage
  const currentCount = cart.count();
  const currentTotal = cart.total();
  
  console.log('UI Update - Count:', currentCount, 'Total:', currentTotal);
  
  // Actualizar contador del ícono
  const countElements = document.querySelectorAll('[data-cart-count]');
  countElements.forEach(el => {
    el.textContent = currentCount;
    console.log('Updated cart count element to:', currentCount);
  });

  // Actualizar totales
  const totalElements = document.querySelectorAll('[data-cart-total]');
  totalElements.forEach(el => {
    el.textContent = currentTotal.toFixed(2);
    console.log('Updated cart total element to:', currentTotal.toFixed(2));
  });
  
  // Actualizar contenido del drawer si existe
  updateCartDrawerContent();
}

// Actualizar contenido del drawer
function updateCartDrawerContent() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const cartItems = cart.items();
  
  console.log('Updating drawer content with items:', cartItems);
  
  if (cartItemsContainer) {
    if (cartItems.length === 0) {
      if (emptyCartMessage) emptyCartMessage.style.display = 'block';
      cartItemsContainer.style.display = 'none';
    } else {
      if (emptyCartMessage) emptyCartMessage.style.display = 'none';
      cartItemsContainer.style.display = 'block';
      
      // Regenerar items del carrito
      cartItemsContainer.innerHTML = cartItems.map(item => {
        // Asegurar que el ID sea seguro para usar en HTML
        const safeId = String(item.id).replace(/['"]/g, '');
        const safeName = String(item.name).replace(/['"]/g, '&quot;');
        
        return `
        <div class="flex items-center py-4 border-b border-gray-700" data-item-id="${safeId}">
          <div class="flex-shrink-0">
            <img src="${item.image}" alt="${safeName}" class="w-20 h-20 object-cover rounded-md">
          </div>
          <div class="ml-4 flex-grow">
            <h3 class="text-white font-medium">${safeName}</h3>
            <p class="text-gray-400">S/. ${parseFloat(item.price).toFixed(2)}</p>
          </div>
          <div class="flex items-center">
            <div class="flex items-center border border-gray-600 rounded-md">
              <button onclick="cart.update('${safeId}', ${item.quantity - 1})" class="px-3 py-1 text-gray-400 hover:text-white" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
              <span class="px-3 py-1 text-white">${item.quantity}</span>
              <button onclick="cart.update('${safeId}', ${item.quantity + 1})" class="px-3 py-1 text-gray-400 hover:text-white">+</button>
            </div>
            <button onclick="cart.remove('${safeId}')" class="ml-4 text-red-500 hover:text-red-400" title="Eliminar producto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>`;
      }).join('');
    }
  }
}

// Función de depuración
function debugCart() {
  console.log('=== CART DEBUG ===');
  console.log('localStorage content:', localStorage.getItem(CART_KEY));
  console.log('Parsed cart:', getCart());
  console.log('Cart count:', cart.count());
  console.log('Cart total:', cart.total());
  console.log('==================');
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.cart = cart;
  window.debugCart = debugCart; // Para depuración
  console.log('Cart made available globally');
}

export { cart };