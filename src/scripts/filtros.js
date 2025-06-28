document.addEventListener('DOMContentLoaded', function() {
   const minPrecioCategoria = window.minPrecioCategoria;
  const maxPrecioCategoria = window.maxPrecioCategoria;
    // Elementos del modal
    const openFiltersBtn = document.getElementById('open-filters');
    const closeFiltersBtn = document.getElementById('close-filters');
    const filtersModal = document.getElementById('filters-modal');
    const filtersOverlay = document.getElementById('filters-overlay');
    
    // Productos
    const productCards = document.querySelectorAll('.producto-card');
    const noProductsMessage = document.getElementById('no-products');
    const productsContainer = document.querySelector('#productos-container .grid');
    const productsCount = document.getElementById('products-count');
    
    // Abrir modal
    function openFilters() {
      filtersModal.classList.remove('-translate-x-full');
      filtersOverlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
    
    // Cerrar modal
    function closeFilters() {
      filtersModal.classList.add('-translate-x-full');
      filtersOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
    
    // Event listeners para abrir/cerrar modal
    openFiltersBtn?.addEventListener('click', openFilters);
    closeFiltersBtn?.addEventListener('click', closeFilters);
    filtersOverlay?.addEventListener('click', closeFilters);
    
    // Función para validar que el precio mínimo no supere el máximo
    function validatePriceRange(minVal, maxVal, isDesktop = false) {
      const prefix = isDesktop ? 'desktop-' : '';
      const minRange = document.getElementById(`${prefix}price-range-min`);
      const maxRange = document.getElementById(`${prefix}price-range-max`);
      const minInput = document.getElementById(`${prefix}min-price-input`);
      const maxInput = document.getElementById(`${prefix}max-price-input`);
      
      // Asegurar que min no sea mayor que max
      if (minVal > maxVal) {
        if (isDesktop) {
          minRange.value = maxVal;
          minInput.value = maxVal;
          minVal = maxVal;
        } else {
          maxRange.value = minVal;
          maxInput.value = minVal;
          maxVal = minVal;
        }
      }
      
      return { min: minVal, max: maxVal };
    }
    
    // Función para actualizar los valores mostrados
    function updatePriceDisplay(minVal, maxVal, isDesktop = false) {
      const prefix = isDesktop ? 'desktop-' : '';
      const minDisplay = document.getElementById(`${prefix}min-price-value`);
      const maxDisplay = document.getElementById(`${prefix}max-price-value`);
      
      if (minDisplay) minDisplay.textContent = `S/. ${minVal.toFixed(2)}`;
      if (maxDisplay) maxDisplay.textContent = `S/. ${maxVal.toFixed(2)}`;
    }
    
    // Función para sincronizar controles de precio
    function syncPriceControls(sourcePrefix, targetPrefix) {
      const sourceMinRange = document.getElementById(`${sourcePrefix}price-range-min`);
      const sourceMaxRange = document.getElementById(`${sourcePrefix}price-range-max`);
      const targetMinRange = document.getElementById(`${targetPrefix}price-range-min`);
      const targetMaxRange = document.getElementById(`${targetPrefix}price-range-max`);
      const targetMinInput = document.getElementById(`${targetPrefix}min-price-input`);
      const targetMaxInput = document.getElementById(`${targetPrefix}max-price-input`);
      
      if (sourceMinRange && targetMinRange) {
        targetMinRange.value = sourceMinRange.value;
        targetMinInput.value = sourceMinRange.value;
      }
      if (sourceMaxRange && targetMaxRange) {
        targetMaxRange.value = sourceMaxRange.value;
        targetMaxInput.value = sourceMaxRange.value;
      }
      
      updatePriceDisplay(
        parseFloat(sourceMinRange?.value || minPrecioCategoria),
        parseFloat(sourceMaxRange?.value || maxPrecioCategoria),
        targetPrefix === 'desktop-'
      );
    }
    
    // Función para filtrar productos
    function filterProducts() {
      // Obtener marcas seleccionadas
      const selectedMarcas = [];
      document.querySelectorAll('.marca-filter:checked').forEach(checkbox => {
        selectedMarcas.push(checkbox.value);
      });
      
      // Obtener rango de precios (usar valores de desktop como referencia)
      const desktopMinInput = document.getElementById('desktop-min-price-input');
      const desktopMaxInput = document.getElementById('desktop-max-price-input');
      const mobileMinInput = document.getElementById('min-price-input');
      const mobileMaxInput = document.getElementById('max-price-input');
      
      const minPrice = parseFloat(desktopMinInput?.value || mobileMinInput?.value || minPrecioCategoria);
      const maxPrice = parseFloat(desktopMaxInput?.value || mobileMaxInput?.value || maxPrecioCategoria);
      
      let visibleCount = 0;
      
      productCards.forEach(card => {
        const price = parseFloat(card.getAttribute('data-price'));
        const marca = card.getAttribute('data-marca');
        
        // Verificar si cumple con los filtros
        const matchesMarca = selectedMarcas.length === 0 || selectedMarcas.includes(marca);
        const matchesPrice = price >= minPrice && price <= maxPrice;
        
        if (matchesMarca && matchesPrice) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Actualizar contador de productos
      if (productsCount) {
        productsCount.textContent = `Mostrando ${visibleCount} producto${visibleCount !== 1 ? 's' : ''}`;
      }
      
      // Mostrar/ocultar mensaje de no productos
      if (visibleCount === 0) {
        if (productsContainer) productsContainer.style.display = 'none';
        if (noProductsMessage) noProductsMessage.classList.remove('hidden');
      } else {
        if (productsContainer) productsContainer.style.display = 'grid';
        if (noProductsMessage) noProductsMessage.classList.add('hidden');
      }
    }
    
    // Función para resetear filtros
    function resetFilters() {
     
      // Desmarcar todos los checkboxes
      document.querySelectorAll('.marca-filter').forEach(checkbox => {
        checkbox.checked = false;
      });
        console.log('→ RESET filtros ejecutado');
         console.log('minPrecioCategoria:', typeof minPrecioCategoria);
         console.log('maxPrecioCategoria:', typeof maxPrecioCategoria);

      // Resetear controles de precio para móvil
      const mobileMinRange = document.getElementById('price-range-min');
      const mobileMaxRange = document.getElementById('price-range-max');
      const mobileMinInput = document.getElementById('min-price-input');
      const mobileMaxInput = document.getElementById('max-price-input');
      
      if (mobileMinRange) mobileMinRange.value = minPrecioCategoria;
      if (mobileMaxRange) mobileMaxRange.value = maxPrecioCategoria;
      if (mobileMinInput) mobileMinInput.value = minPrecioCategoria;
      if (mobileMaxInput) mobileMaxInput.value = maxPrecioCategoria;
      
      // Resetear controles de precio para desktop
      const desktopMinRange = document.getElementById('desktop-price-range-min');
      const desktopMaxRange = document.getElementById('desktop-price-range-max');
      const desktopMinInput = document.getElementById('desktop-min-price-input');
      const desktopMaxInput = document.getElementById('desktop-max-price-input');
      
      if (desktopMinRange) desktopMinRange.value = minPrecioCategoria;
      if (desktopMaxRange) desktopMaxRange.value = maxPrecioCategoria;
      if (desktopMinInput) desktopMinInput.value = minPrecioCategoria;
      if (desktopMaxInput) desktopMaxInput.value = maxPrecioCategoria;
      
      // Actualizar displays
      updatePriceDisplay(minPrecioCategoria, maxPrecioCategoria, false);
      updatePriceDisplay(minPrecioCategoria, maxPrecioCategoria, true);
      
      // Filtrar productos
      filterProducts();
    }
    
    // Configurar event listeners para filtros automáticos
    function setupAutoFilters(prefix = '') {
      // Event listeners para controles de precio
      const minRange = document.getElementById(`${prefix}price-range-min`);
      const maxRange = document.getElementById(`${prefix}price-range-max`);
      const minInput = document.getElementById(`${prefix}min-price-input`);
      const maxInput = document.getElementById(`${prefix}max-price-input`);
      
      if (minRange) {
        minRange.addEventListener('input', () => {
          const validated = validatePriceRange(
            parseFloat(minRange.value),
            parseFloat(maxRange.value),
            prefix === 'desktop-'
          );
          minInput.value = validated.min;
          updatePriceDisplay(validated.min, validated.max, prefix === 'desktop-');
          
          // Sincronizar con el otro conjunto de controles
          const otherPrefix = prefix === 'desktop-' ? '' : 'desktop-';
          syncPriceControls(prefix, otherPrefix);
          
          filterProducts();
        });
      }
      
      if (maxRange) {
        maxRange.addEventListener('input', () => {
          const validated = validatePriceRange(
            parseFloat(minRange.value),
            parseFloat(maxRange.value),
            prefix === 'desktop-'
          );
          maxInput.value = validated.max;
          updatePriceDisplay(validated.min, validated.max, prefix === 'desktop-');
          
          // Sincronizar con el otro conjunto de controles
          const otherPrefix = prefix === 'desktop-' ? '' : 'desktop-';
          syncPriceControls(prefix, otherPrefix);
          
          filterProducts();
        });
      }
      
      if (minInput) {
        minInput.addEventListener('change', () => {
          const value = Math.max(minPrecioCategoria, parseFloat(minInput.value) || minPrecioCategoria);
          const validated = validatePriceRange(value, parseFloat(maxRange.value), prefix === 'desktop-');
          
          minRange.value = validated.min;
          minInput.value = validated.min;
          updatePriceDisplay(validated.min, validated.max, prefix === 'desktop-');
          
          // Sincronizar con el otro conjunto de controles
          const otherPrefix = prefix === 'desktop-' ? '' : 'desktop-';
          syncPriceControls(prefix, otherPrefix);
          
          filterProducts();
        });
      }
      
      if (maxInput) {
        maxInput.addEventListener('change', () => {
          const value = Math.min(maxPrecioCategoria, parseFloat(maxInput.value) || maxPrecioCategoria);
          const validated = validatePriceRange(parseFloat(minRange.value), value, prefix === 'desktop-');
          
          maxRange.value = validated.max;
          maxInput.value = validated.max;
          updatePriceDisplay(validated.min, validated.max, prefix === 'desktop-');
          
          // Sincronizar con el otro conjunto de controles
          const otherPrefix = prefix === 'desktop-' ? '' : 'desktop-';
          syncPriceControls(prefix, otherPrefix);
          
          filterProducts();
        });
      }
    }
    
    // Configurar eventos para los botones de reset
    document.getElementById('desktop-reset-filters')?.addEventListener('click', resetFilters);
    document.getElementById('reset-filters')?.addEventListener('click', resetFilters);
    document.getElementById('reset-filters-btn')?.addEventListener('click', resetFilters);
    
    // Configurar eventos para los checkboxes de marca
    document.querySelectorAll('.marca-filter').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        // Sincronizar checkboxes entre móvil y desktop
        const id = checkbox.id;
        let otherId, otherCheckbox;
        
        if (id.includes('desktop-')) {
          otherId = id.replace('desktop-', '');
          otherCheckbox = document.getElementById(otherId);
        } else {
          otherId = 'desktop-' + id;
          otherCheckbox = document.getElementById(otherId);
        }
        
        if (otherCheckbox) {
          otherCheckbox.checked = checkbox.checked;
        }
        
        filterProducts();
      });
    });
    
    // Inicializar filtros para ambas vistas
    setupAutoFilters(); // Móvil
    setupAutoFilters('desktop-'); // Escritorio
    
    // Aplicar filtros iniciales
    filterProducts();
  });