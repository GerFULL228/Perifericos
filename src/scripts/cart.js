// src/scripts/cart.js
/**
 * Manejo del carrito de compras
 */

// Clave para el localStorage
const CART_KEY = 'techperipherals_cart';

// Obtener el carrito actual
export function getCart() {
  if (typeof window === 'undefined') return [];
  
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Guardar el carrito

// Añadir producto al carrito
export function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  
  saveCart(cart);
  openCart();
}

// Eliminar producto del carrito
export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

// Actualizar cantidad de un producto
export function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;
  
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
  }
}

// Obtener número total de items en el carrito
export function cartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

// Calcular el total del carrito
export function cartTotal(products = []) {
  if (products.length === 0) return 0;
  
  return getCart().reduce((total, cartItem) => {
    const product = products.find(p => p.id === cartItem.id);
    return total + (product?.price || 0) * cartItem.quantity;
  }, 0).toFixed(2);
}

// Obtener items del carrito con detalles de productos
export function cartItems(products = []) {
  return getCart().map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    return product ? { ...product, quantity: cartItem.quantity } : null;
  }).filter(Boolean);
}

// Abrir el drawer del carrito
export function openCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
  }
}

// Cerrar el drawer del carrito
export function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
  }
}

// src/scripts/cart.js
/**
 * Manejo del carrito de compras
 */

// Clave para el localStorage


// Obtener el carrito actual

// Guardar el carrito
function saveCart(cart) {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// ... (mantén todas las otras funciones como están, sin cambios)

// Inicializar eventos del carrito - Ahora es una función exportada
export function initCart() {
  if (typeof document === 'undefined') return;
  
  // Actualizar contador al cargar la página
  const countElement = document.getElementById('cart-count');
  if (countElement) {
    countElement.textContent = cartCount();
  }
  
  // Delegación de eventos para botones "Añadir al carrito"
  document.body.addEventListener('click', (e) => {
    const addToCartBtn = e.target.closest('[onclick*="addToCart"]');
    if (addToCartBtn) {
      e.preventDefault();
      const match = addToCartBtn.getAttribute('onclick').match(/addToCart\('(.+?)', (\d+)\)/);
      if (match) {
        addToCart(match[1], parseInt(match[2]));
      }
    }
  });
}