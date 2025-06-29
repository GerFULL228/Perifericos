document.addEventListener('DOMContentLoaded', function() {
  // Valores iniciales
  const minPrecio = window.minPrecioCategoria || 0;
  const maxPrecio = window.maxPrecioCategoria || 10000;
  
  // Elementos del DOM
  const elements = {
    modal: {
      openBtn: document.getElementById('open-filters'),
      closeBtn: document.getElementById('close-filters'),
      modal: document.getElementById('filters-modal'),
      overlay: document.getElementById('filters-overlay')
    },
    products: {
      cards: document.querySelectorAll('.producto-card'),
      container: document.getElementById('productos-container'),
      noProductsMsg: document.getElementById('no-products'),
      count: document.getElementById('products-count')
    },
    filters: {
      resetBtns: [
        document.getElementById('desktop-reset-filters'),
        document.getElementById('reset-filters'),
        document.getElementById('reset-filters-btn')
      ].filter(Boolean),
      marca: {
        all: document.querySelectorAll('.marca-filter'),
        mobile: document.querySelectorAll('.marca-filter:not([id^="desktop-"])'),
        desktop: document.querySelectorAll('.marca-filter[id^="desktop-"]')
      }
    }
  };

  // Control del modal
  const modalControl = {
    open: () => {
      elements.modal.modal.classList.remove('-translate-x-full');
      elements.modal.overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    },
    close: () => {
      elements.modal.modal.classList.add('-translate-x-full');
      elements.modal.overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  // Event listeners para el modal
  elements.modal.openBtn?.addEventListener('click', modalControl.open);
  elements.modal.closeBtn?.addEventListener('click', modalControl.close);
  elements.modal.overlay?.addEventListener('click', modalControl.close);

  // Funciones para el filtrado
  const filterUtils = {
    getSelectedMarcas: () => {
      return Array.from(elements.filters.marca.all)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    },
    
    getPriceRange: () => {
      const desktopMin = document.getElementById('desktop-min-price-input');
      const desktopMax = document.getElementById('desktop-max-price-input');
      const mobileMin = document.getElementById('min-price-input');
      const mobileMax = document.getElementById('max-price-input');
      
      return {
        min: parseFloat(desktopMin?.value || mobileMin?.value || minPrecio),
        max: parseFloat(desktopMax?.value || mobileMax?.value || maxPrecio)
      };
    },
    
    validatePriceRange: (minVal, maxVal, isDesktop = false) => {
      if (minVal > maxVal) {
        if (isDesktop) {
          minVal = maxVal;
        } else {
          maxVal = minVal;
        }
      }
      return { min: minVal, max: maxVal };
    },
    
    updatePriceDisplay: (minVal, maxVal, isDesktop = false) => {
      const prefix = isDesktop ? 'desktop-' : '';
      const minDisplay = document.getElementById(`${prefix}min-price-value`);
      const maxDisplay = document.getElementById(`${prefix}max-price-value`);
      
      if (minDisplay) minDisplay.textContent = `S/. ${minVal.toFixed(2)}`;
      if (maxDisplay) maxDisplay.textContent = `S/. ${maxVal.toFixed(2)}`;
    },
    
    syncPriceControls: (sourcePrefix, targetPrefix) => {
      const controls = ['price-range-min', 'price-range-max', 'min-price-input', 'max-price-input'];
      
      controls.forEach(control => {
        const source = document.getElementById(`${sourcePrefix}${control}`);
        const target = document.getElementById(`${targetPrefix}${control}`);
        if (source && target) target.value = source.value;
      });
      
      const { min, max } = filterUtils.getPriceRange();
      filterUtils.updatePriceDisplay(min, max, targetPrefix === 'desktop-');
    }
  };

  // Filtrado principal
  function filterProducts() {
    const { min, max } = filterUtils.getPriceRange();
    const selectedMarcas = filterUtils.getSelectedMarcas();
    
    let visibleCount = 0;
    
    elements.products.cards.forEach(card => {
      const price = parseFloat(card.dataset.price);
      const marca = card.dataset.marca;
      
      const matchesMarca = selectedMarcas.length === 0 || selectedMarcas.includes(marca);
      const matchesPrice = price >= min && price <= max;
      
      if (matchesMarca && matchesPrice) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Actualizar UI
    if (elements.products.count) {
      elements.products.count.textContent = `Mostrando ${visibleCount} producto${visibleCount !== 1 ? 's' : ''}`;
    }
    
    const showNoProducts = visibleCount === 0;
    if (elements.products.container) {
      elements.products.container.style.display = showNoProducts ? 'none' : 'grid';
    }
    if (elements.products.noProductsMsg) {
      showNoProducts 
        ? elements.products.noProductsMsg.classList.remove('hidden')
        : elements.products.noProductsMsg.classList.add('hidden');
    }
  }

  // Resetear filtros
  function resetFilters() {
    // Resetear checkboxes
    elements.filters.marca.all.forEach(checkbox => checkbox.checked = false);
    
    // Resetear controles de precio
    const priceControls = [
      'price-range-min', 'price-range-max', 'min-price-input', 'max-price-input',
      'desktop-price-range-min', 'desktop-price-range-max', 'desktop-min-price-input', 'desktop-max-price-input'
    ];
    
    priceControls.forEach(control => {
      const element = document.getElementById(control);
      if (!element) return;
      
      if (control.includes('min')) {
        element.value = minPrecio;
      } else {
        element.value = maxPrecio;
      }
    });
    
    // Actualizar displays
    filterUtils.updatePriceDisplay(minPrecio, maxPrecio, false);
    filterUtils.updatePriceDisplay(minPrecio, maxPrecio, true);
    
    // Aplicar filtros
    filterProducts();
  }

  // Configurar eventos para controles de precio
  function setupPriceControls(prefix = '') {
    const isDesktop = prefix === 'desktop-';
    const minRange = document.getElementById(`${prefix}price-range-min`);
    const maxRange = document.getElementById(`${prefix}price-range-max`);
    const minInput = document.getElementById(`${prefix}min-price-input`);
    const maxInput = document.getElementById(`${prefix}max-price-input`);
    
    const handlePriceChange = () => {
      const minVal = parseFloat(minRange?.value || minPrecio);
      const maxVal = parseFloat(maxRange?.value || maxPrecio);
      
      const validated = filterUtils.validatePriceRange(minVal, maxVal, isDesktop);
      
      if (minRange) minRange.value = validated.min;
      if (maxRange) maxRange.value = validated.max;
      if (minInput) minInput.value = validated.min;
      if (maxInput) maxInput.value = validated.max;
      
      filterUtils.updatePriceDisplay(validated.min, validated.max, isDesktop);
      
      // Sincronizar con el otro conjunto de controles
      const otherPrefix = isDesktop ? '' : 'desktop-';
      filterUtils.syncPriceControls(prefix, otherPrefix);
      
      filterProducts();
    };
    
    if (minRange) minRange.addEventListener('input', handlePriceChange);
    if (maxRange) maxRange.addEventListener('input', handlePriceChange);
    
    if (minInput) {
      minInput.addEventListener('change', () => {
        const value = Math.max(minPrecio, parseFloat(minInput.value) || minPrecio);
        minRange.value = value;
        handlePriceChange();
      });
    }
    
    if (maxInput) {
      maxInput.addEventListener('change', () => {
        const value = Math.min(maxPrecio, parseFloat(maxInput.value) || maxPrecio);
        maxRange.value = value;
        handlePriceChange();
      });
    }
  }

  // Configurar eventos para checkboxes de marca
  function setupMarcaFilters() {
    elements.filters.marca.all.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        // Sincronizar checkboxes entre móvil y desktop
        const id = checkbox.id;
        const otherId = id.includes('desktop-') 
          ? id.replace('desktop-', '') 
          : 'desktop-' + id;
        
        const otherCheckbox = document.getElementById(otherId);
        if (otherCheckbox) otherCheckbox.checked = checkbox.checked;
        
        filterProducts();
      });
    });
  }

  // Configurar eventos para botones de reset
  function setupResetButtons() {
    elements.filters.resetBtns.forEach(btn => {
      btn.addEventListener('click', resetFilters);
    });
  }

  // Inicialización
  function init() {
    setupPriceControls(); // Móvil
    setupPriceControls('desktop-'); // Escritorio
    setupMarcaFilters();
    setupResetButtons();
    filterProducts(); // Aplicar filtros iniciales
  }

  init();
});