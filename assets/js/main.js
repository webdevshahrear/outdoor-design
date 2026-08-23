
// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

$(document).ready(function() {

  // ==========================================
  // HOMEPAGE PORTFOLIO FILTERING
  // ==========================================
  $('.index-cat-btn').on('click', function() {
    // Styling update
    $('.index-cat-btn').removeClass('btn-dark').addClass('btn-outline-luxury text-muted border-0');
    $(this).removeClass('btn-outline-luxury text-muted border-0').addClass('btn-dark');
    
    // Filter logic
    const filter = $(this).data('filter');
    if (filter === 'all') {
      $('#index-products-grid .product-card').show();
    } else {
      $('#index-products-grid .product-card').hide();
      $(`#index-products-grid .product-card[data-category="${filter}"]`).show();
    }
  });

  // Re-initialize any modal specific scripts here
  $('#consultationForm').on('submit', function(e) {
    e.preventDefault();
    if (window.showToast) {
      window.showToast('Site Survey Booked!', 'Our senior surveyor is scheduled for your selected date.');
    } else {
      alert('Site Survey Booked!\nOur senior surveyor is scheduled for your selected date.');
    }
    $('#consultationModal').modal('hide');
  });

  // Initialize Carousel explicitly
  const heroCarousel = document.getElementById('heroCarousel');
  let bsCarousel = null;
  let isPlaying = true;
  let carouselInterval = 7000;
  
  if (heroCarousel) {
    bsCarousel = new bootstrap.Carousel(heroCarousel, {
      interval: carouselInterval,
      ride: 'carousel',
      pause: false
    });

    // Custom Controls Logic
    const $playPauseBtn = $('#heroPlayPauseBtn');
    const $slideCurrent = $('#heroSlideCurrent');
    const $progressBars = $('.slide-progress-bar');
    
    let progressTimer = null;
    let progressValue = 0;
    
    function startProgress() {
      clearInterval(progressTimer);
      progressValue = 0;
      $progressBars.css('width', '0%');
      
      const activeIndex = $(heroCarousel).find('.carousel-item.active').index();
      const $currentBar = $progressBars.eq(activeIndex);
      
      progressTimer = setInterval(() => {
        if(isPlaying) {
          progressValue += (100 / (carouselInterval / 100)); // Update every 100ms
          $currentBar.css('width', progressValue + '%');
          if(progressValue >= 100) {
            clearInterval(progressTimer);
          }
        }
      }, 100);
    }

    heroCarousel.addEventListener('slide.bs.carousel', function (e) {
      $slideCurrent.text((e.to + 1).toString().padStart(2, '0'));
      clearInterval(progressTimer);
      $progressBars.css('width', '0%');
    });

    heroCarousel.addEventListener('slid.bs.carousel', function (e) {
      startProgress();
    });

    $playPauseBtn.on('click', function() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        bsCarousel.cycle();
        $(this).html('<i class="fa-solid fa-pause"></i>');
      } else {
        bsCarousel.pause();
        $(this).html('<i class="fa-solid fa-play"></i>');
      }
    });

    startProgress();
  }

  // Handle Quote Form Submit
  $('#quoteForm').on('submit', function(e) {
    e.preventDefault();
    const name = $('#quoteName').val();
    const phone = $('#quotePhone').val();
    
    if (!name || !phone) {
      showToast('Error', 'Name and contact number are required.');
      return;
    }
    
    showToast('Quote Request Received', 'Our senior architectural estimator will contact you within 2 hours with CAD details.');
    this.reset();
  });

  // Handle WhatsApp click
  $('.whatsapp-btn').on('click', function(e) {
    e.preventDefault();
    const message = encodeURIComponent($(this).data('message') || "Hello Al-Manzil Luxe, I want to discuss a new villa project quotation.");
    window.open('https://wa.me/971501234567?text=' + message, '_blank');
  });
  
  // Navbar Sticky behavior
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 50) {
      $('.navbar').addClass('shadow-sm').css('background-color', 'rgba(255, 255, 255, 0.95)');
    } else {
      $('.navbar').removeClass('shadow-sm').css('background-color', '#fff');
    }
  });

  // Interactive 3D Configurator Logic
  if ($('#configCanvas').length) {
    let state = {
      modelType: 'gate',
      widthCm: 500,
      heightCm: 240,
      finish: { name: 'Matt Charcoal & Brushed Gold', price: 0, primary: '#1C1C1E', accent: '#C6A15B' },
      bio: true,
      led: true,
      mist: false,
      nightMode: false,
      isOpen: false
    };

    function calculatePrice() {
      let base = state.modelType === 'gate' ? 32000 : state.modelType === 'pergola' ? 44000 : 26000;
      
      const areaSqM = (state.widthCm / 100) * (state.heightCm / 100);
      const standardArea = state.modelType === 'gate' ? 12 : state.modelType === 'pergola' ? 24 : 6;
      const areaDiff = Math.max(0, areaSqM - standardArea);
      const areaAddon = areaDiff * (state.modelType === 'pergola' ? 1200 : 1500);

      const finishAddon = state.finish.price;
      const motorAddon = 4500;
      const bioAddon = state.bio ? 3500 : 0;
      const ledAddon = state.led ? 2200 : 0;
      const mistAddon = state.mist ? 5500 : 0;

      const total = Math.round(base + areaAddon + finishAddon + motorAddon + bioAddon + ledAddon + mistAddon);
      $('#livePrice').text('AED ' + total.toLocaleString());
    }

    function renderVisualizer() {
      const $canvas = $('#configCanvas');
      const $vis = $('#visualizer');
      
      // Update canvas background based on nightMode
      if (state.nightMode) {
        $canvas.removeClass('bg-warm-beige').css('background-color', '#171717');
        $('#toggleNightMode .mode-icon').removeClass('fa-sun text-warning').addClass('fa-moon text-gold');
        $('#toggleNightMode .mode-text').text('Night Illumination');
      } else {
        $canvas.addClass('bg-warm-beige').css('background-color', '');
        $('#toggleNightMode .mode-icon').removeClass('fa-moon text-gold').addClass('fa-sun text-warning');
        $('#toggleNightMode .mode-text').text('Daylight Simulation');
      }

      $vis.empty();

      if (state.modelType === 'gate') {
        let gateHtml = `
          <div class="rounded-1 border" style="width: 100%; height: 180px; background-color: ${state.finish.primary}; border-color: ${state.finish.accent} !important; border-width: 4px !important; transition: all 0.7s; display: flex; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; transform: ${state.isOpen ? 'translateX(130px) scale(0.95)' : 'translateX(0) scale(1)'}; opacity: ${state.isOpen ? '0.8' : '1'};">
            <div class="d-flex w-100 h-100">
        `;
        for (let i=0; i<8; i++) {
          gateHtml += `
              <div class="flex-grow-1 position-relative d-flex flex-column justify-content-center align-items-center" style="border-right: 1px solid rgba(198, 161, 91, 0.3);">
                <div style="width: 4px; height: 100%; background-color: ${state.finish.accent}; opacity: 0.6;"></div>
                ${i % 2 === 0 ? `<div style="width: 12px; height: 12px; border: 1px solid ${state.finish.accent}; transform: rotate(45deg); position: absolute;"></div>` : ''}
              </div>
          `;
        }
        gateHtml += `</div>`;
        if (state.bio) {
          gateHtml += `
            <div class="position-absolute end-0 top-0 m-3 bg-dark rounded-1 border" style="width: 12px; height: 32px; border-color: ${state.finish.accent} !important; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 2px 0;">
              <div class="rounded-circle" style="width: 4px; height: 4px; background-color: #22c55e;"></div>
              <div style="width: 6px; height: 4px; background-color: ${state.finish.accent};"></div>
            </div>
          `;
        }
        if (state.led && state.nightMode) {
          gateHtml += `<div class="position-absolute bottom-0 start-0 w-100" style="height: 40px; background: linear-gradient(to top, rgba(198, 161, 91, 0.4), transparent); filter: blur(4px);"></div>`;
        }
        gateHtml += `</div>`;
        $vis.html(gateHtml);
      } 
      else if (state.modelType === 'pergola') {
        let pregHtml = `
          <div class="w-100 h-100 d-flex flex-column justify-content-between position-relative">
            <div class="w-100 rounded-1 shadow-sm d-flex align-items-center justify-content-around overflow-hidden" style="height: 50px; border: 2px solid ${state.finish.accent}; background-color: ${state.finish.primary};">
        `;
        for(let i=0; i<14; i++) {
          pregHtml += `<div style="width: 6px; height: 100%; background-color: ${state.finish.accent}; transition: transform 0.5s; transform: ${state.isOpen ? 'rotate(45deg)' : 'rotate(0)'};"></div>`;
        }
        pregHtml += `
            </div>
            <div class="w-100 d-flex justify-content-between px-2" style="height: 150px;">
              <div class="rounded-1" style="width: 16px; height: 100%; background-color: ${state.finish.primary}; border: 1px solid ${state.finish.accent};"></div>
              <div class="rounded-1" style="width: 16px; height: 100%; background-color: ${state.finish.primary}; border: 1px solid ${state.finish.accent};"></div>
            </div>
        `;
        if (state.mist) {
          pregHtml += `<div class="position-absolute w-100" style="top: 50px; height: 80px; left: 0; background: linear-gradient(to bottom, rgba(56, 189, 248, 0.2), transparent); filter: blur(4px); pointer-events: none;"></div>`;
        }
        if (state.led && state.nightMode) {
          pregHtml += `<div class="position-absolute w-100" style="top: 50px; height: 100px; left: 0; background: linear-gradient(to bottom, rgba(198, 161, 91, 0.3), transparent); filter: blur(4px); pointer-events: none;"></div>`;
        }
        pregHtml += `</div>`;
        $vis.html(pregHtml);
      }
      else if (state.modelType === 'door') {
        let doorHtml = `
          <div class="rounded-1 shadow-sm position-relative d-flex align-items-center justify-content-between" style="width: 150px; height: 220px; border: 2px solid ${state.finish.accent}; background-color: ${state.finish.primary}; transition: all 0.7s; transform-origin: left; transform: ${state.isOpen ? 'perspective(1000px) rotateY(45deg)' : 'perspective(1000px) rotateY(0)'};">
            <div class="position-absolute end-0 top-50 translate-middle-y shadow me-3 rounded-pill" style="width: 8px; height: 120px; background-color: ${state.finish.accent};"></div>
        `;
        if (state.bio) {
          doorHtml += `<div class="position-absolute end-0 top-0 mt-5 me-3 bg-dark rounded-1" style="width: 8px; height: 16px; border: 1px solid ${state.finish.accent};"></div>`;
        }
        doorHtml += `</div>`;
        $vis.html(doorHtml);
      }
    }

    function updateUI() {
      // Sliders
      $('#widthLabel').text(`${state.widthCm} cm (${((state.widthCm/100)*3.28).toFixed(1)} ft)`);
      $('#heightLabel').text(`${state.heightCm} cm (${((state.heightCm/100)*3.28).toFixed(1)} ft)`);
      $('#scaleIndicator').text(`Scale: ${state.widthCm}cm (W) × ${state.heightCm}cm (H)`);
      $('#widthSlider').val(state.widthCm);
      $('#heightSlider').val(state.heightCm);

      // Finish buttons
      $('.finish-btn').removeClass('active bg-ivory fw-semibold').css('border-color', '#E8E4DC');
      $(`.finish-btn[data-finish="${state.finish.name}"]`).addClass('active bg-ivory fw-semibold').css('border-color', '#C6A15B');

      // Checkboxes
      $('#cbBiometrics').prop('checked', state.bio);
      $('#cbLed').prop('checked', state.led);
      $('#cbMist').prop('checked', state.mist);

      // Toggle Text
      $('#toggleSimulate').text(state.isOpen ? 'Close Simulation' : 'Simulate Opening Drive');

      calculatePrice();
      renderVisualizer();
    }

    // Event Listeners
    $('.config-type-btn').on('click', function() {
      $('.config-type-btn').removeClass('active text-white bg-dark').addClass('text-muted');
      $(this).addClass('active text-white bg-dark').removeClass('text-muted');
      
      const type = $(this).data('type');
      state.modelType = type;
      state.isOpen = false;
      
      if (type === 'gate') {
        state.widthCm = 500; state.heightCm = 240;
        $('#widthSlider').attr('min', 300).attr('max', 1000);
        $('#heightSlider').attr('min', 180).attr('max', 400);
        $('#mistSystemOption').hide();
      } else if (type === 'pergola') {
        state.widthCm = 600; state.heightCm = 280;
        $('#widthSlider').attr('min', 300).attr('max', 1000);
        $('#heightSlider').attr('min', 180).attr('max', 400);
        $('#mistSystemOption').show();
      } else {
        state.widthCm = 180; state.heightCm = 350;
        $('#widthSlider').attr('min', 120).attr('max', 240);
        $('#heightSlider').attr('min', 240).attr('max', 420);
        $('#mistSystemOption').hide();
      }
      updateUI();
    });

    $('#widthSlider').on('input', function() { state.widthCm = $(this).val(); updateUI(); });
    $('#heightSlider').on('input', function() { state.heightCm = $(this).val(); updateUI(); });

    $('.finish-btn').on('click', function() {
      state.finish = {
        name: $(this).data('finish'),
        price: parseInt($(this).data('price')),
        primary: $(this).data('primary'),
        accent: $(this).data('accent')
      };
      updateUI();
    });

    $('#cbBiometrics').on('change', function() { state.bio = $(this).is(':checked'); updateUI(); });
    $('#cbLed').on('change', function() { state.led = $(this).is(':checked'); updateUI(); });
    $('#cbMist').on('change', function() { state.mist = $(this).is(':checked'); updateUI(); });

    $('#toggleNightMode').on('click', function() { state.nightMode = !state.nightMode; updateUI(); });
    $('#toggleSimulate').on('click', function() { state.isOpen = !state.isOpen; updateUI(); });

    // Initial setup
    $('.config-type-btn[data-type="gate"]').addClass('active text-white bg-dark').removeClass('text-muted');
    $('.config-type-btn').not('[data-type="gate"]').addClass('text-muted');
    updateUI();
  }

});


// ==========================================
// SHOP PAGE FILTERS & SORTING
// ==========================================
$(document).ready(function() {
  if ($('#shopSearch').length > 0) {
    const $products = $('.product-card');
    
    function filterProducts() {
      const searchTerm = $('#shopSearch').val().toLowerCase();
      const activeCategory = $('#shopCategories .active-category').data('filter');
      const maxPrice = parseInt($('#shopPrice').val());
      
      let visibleCount = 0;
      
      $products.each(function() {
        const $el = $(this);
        const name = $el.data('name') || '';
        const category = $el.data('category');
        const price = parseInt($el.data('price')) || 0;
        
        const matchSearch = name.includes(searchTerm);
        const matchCategory = (activeCategory === 'all' || category === activeCategory);
        const matchPrice = price <= maxPrice;
        
        if (matchSearch && matchCategory && matchPrice) {
          $el.show();
          visibleCount++;
        } else {
          $el.hide();
        }
      });
      
      // Update count text
      $('strong.text-charcoal').first().text(visibleCount);
    }
    
    function sortProducts() {
      const sortVal = $('#shopSort').val();
      const $grid = $products.first().parent(); // The row g-4 container
      
      const elements = $products.get();
      elements.sort(function(a, b) {
        const valA = parseInt($(a).data('price'));
        const valB = parseInt($(b).data('price'));
        
        if (sortVal === 'price-asc') {
          return valA - valB;
        } else if (sortVal === 'price-desc') {
          return valB - valA;
        }
        return 0; // 'featured' leaves as is
      });
      
      $.each(elements, function(index, el) {
        $grid.append(el);
      });
    }
    
    // Event Listeners
    $('#shopSearch').on('input', filterProducts);
    
    $('#shopCategories button').on('click', function(e) {
      e.preventDefault();
      $('#shopCategories button').removeClass('active-category border-gold text-charcoal font-semibold').addClass('border-0 text-muted');
      $(this).removeClass('border-0 text-muted').addClass('active-category border border-gold text-charcoal font-semibold');
      filterProducts();
    });
    
    $('#shopPrice').on('input', function() {
      const val = $(this).val();
      const formatted = new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);
      $('#priceDisplay').text(formatted);
      filterProducts();
    });
    
    $('#shopSort').on('change', function() {
      sortProducts();
    });
  }
});


// ==========================================
// ADMIN DASHBOARD CHART
// ==========================================
$(document).ready(function() {
  const ctx = document.getElementById('revenueChart');
  if (ctx) {
    const revenueData = [
      { month: 'Oct 2025', revenue: 420000 },
      { month: 'Nov 2025', revenue: 680000 },
      { month: 'Dec 2025', revenue: 950000 },
      { month: 'Jan 2026', revenue: 820000 },
      { month: 'Feb 2026', revenue: 1140000 },
      { month: 'Mar 2026 (Est)', revenue: 1450000 }
    ];
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: revenueData.map(d => d.month),
        datasets: [{
          label: 'Revenue (AED)',
          data: revenueData.map(d => d.revenue),
          borderColor: '#C6A15B',
          backgroundColor: 'rgba(198, 161, 91, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'AED ' + (value / 1000) + 'k';
              }
            }
          }
        }
      }
    });
  }
});

// ==========================================
// INDEX PAGE FILTERS
// ==========================================
$(document).ready(function() {
  if ($('#index-products-grid').length > 0) {
    const $indexProducts = $('.index-product-card');
    
    $('.index-cat-btn').on('click', function(e) {
      e.preventDefault();
      // Update active state
      $('.index-cat-btn').removeClass('active-category btn-dark text-white').addClass('btn-outline-luxury text-muted border-0');
      $(this).removeClass('btn-outline-luxury text-muted border-0').addClass('active-category btn-dark text-white');
      
      const filter = $(this).data('filter');
      
      $indexProducts.each(function() {
        const cat = $(this).data('category');
        if (filter === 'all' || cat === filter) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
  }
});

// ==========================================
// CART MANAGER & PREMIUM UI/UX TOAST
// ==========================================
$(document).ready(function() {
  
  // Premium Toast System
  if ($('#luxeToast').length === 0) {
    const toastHtml = `
      <div id="luxeToast" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1090;">
        <div class="toast align-items-center text-bg-dark border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true" style="transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); transform: translateY(100px); opacity: 0;">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-3">
              <i class="fa-solid fa-check-circle text-gold fs-5"></i>
              <div>
                <strong class="d-block text-gold" id="luxeToastTitle" style="font-size: 0.85rem; letter-spacing: 0.05em;">Success</strong>
                <span id="luxeToastMsg" style="font-size: 0.75rem;">Action completed.</span>
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto shadow-none" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    `;
    $('body').append(toastHtml);
  }

  // Override showToast globally
  window.showToast = function(title, message) {
    $('#luxeToastTitle').text(title);
    $('#luxeToastMsg').text(message);
    const $toastEl = $('#luxeToast .toast');
    const bsToast = new bootstrap.Toast($toastEl[0], { delay: 3000 });
    
    // Custom animation classes
    $toastEl.css({transform: 'translateY(0)', opacity: '1'});
    bsToast.show();
    
    $toastEl[0].addEventListener('hidden.bs.toast', () => {
      $toastEl.css({transform: 'translateY(100px)', opacity: '0'});
    }, {once: true});
  };

  // --- CART SYSTEM ---
  const CartManager = {
    items: JSON.parse(localStorage.getItem('luxeCart')) || [],
    
    save() {
      localStorage.setItem('luxeCart', JSON.stringify(this.items));
      this.render();
    },
    
    add(product) {
      const existing = this.items.find(i => i.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        this.items.push({...product, qty: 1});
      }
      this.save();
      
      // Show toast
      if (window.showToast) {
        window.showToast('Added to Specifications', product.name + ' has been added.');
      }
      
      // Automatically open the cart drawer for better UX
      const drawerEl = document.getElementById('cartDrawer');
      if (drawerEl && typeof bootstrap !== 'undefined') {
        let bsOffcanvas = bootstrap.Offcanvas.getInstance(drawerEl);
        if (!bsOffcanvas) {
          bsOffcanvas = new bootstrap.Offcanvas(drawerEl);
        }
        bsOffcanvas.show();
      }
    },
    
    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
      this.save();
    },
    
    updateQty(id, delta) {
      const item = this.items.find(i => i.id === id);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) this.remove(id);
        else this.save();
      }
    },
    
    clear() {
      this.items = [];
      this.save();
    },
    
    render() {
      const totalItems = this.items.reduce((sum, item) => sum + item.qty, 0);
      
      // Update all cart badges
      $('.fa-bag-shopping').siblings('.badge, .cart-badge').text(totalItems);
      $('#cartDrawerLabel').siblings('.text-muted').text(`${totalItems} Commissions in Specification`);
      
      this.renderDrawer();
      this.renderCartPage();
    },
    
    renderDrawer() {
      const $drawer = $('#cartDrawer .offcanvas-body');
      if ($drawer.length === 0) return; // Not loaded yet
      
      if (this.items.length === 0) {
        $drawer.html(`
          <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
            <div class="d-flex align-items-center justify-content-center bg-white border border-luxury rounded-circle text-gold mb-3" style="width: 64px; height: 64px;">
              <i class="fa-solid fa-bag-shopping fs-4"></i>
            </div>
            <h3 class="font-display fw-medium text-charcoal fs-5 mb-2">Your Cart is Empty</h3>
            <p class="text-muted mb-4" style="font-size: 0.8rem; max-width: 250px;">Select from our bespoke gates, doors, or pergolas.</p>
            <div class="w-100 d-flex flex-column gap-2">
              <a href="shop.html" class="btn btn-primary-luxury w-100">Browse Collections</a>
            </div>
          </div>
        `);
        return;
      }
      
      let html = `<div class="d-flex flex-column gap-3 flex-grow-1 overflow-auto pe-2">`;
      let subtotal = 0;
      
      this.items.forEach(item => {
        subtotal += item.price * item.qty;
        html += `
          <div class="d-flex gap-3 align-items-center bg-white p-2 border border-luxury rounded-1 position-relative">
            <div class="border border-luxury rounded-1 overflow-hidden flex-shrink-0" style="width: 60px; height: 60px;">
              <img src="${item.image}" class="w-100 h-100 object-fit-cover">
            </div>
            <div class="flex-grow-1">
              <h6 class="font-display fw-medium text-charcoal m-0" style="font-size: 0.8rem;">${item.name}</h6>
              <div class="text-muted" style="font-size: 0.65rem;">AED ${item.price.toLocaleString()}</div>
              <div class="d-flex align-items-center gap-2 mt-1">
                <button class="btn btn-sm p-0 text-muted cart-qty-btn" data-id="${item.id}" data-action="minus"><i class="fa-solid fa-minus" style="font-size: 0.5rem;"></i></button>
                <span class="fw-semibold text-charcoal" style="font-size: 0.7rem;">${item.qty}</span>
                <button class="btn btn-sm p-0 text-muted cart-qty-btn" data-id="${item.id}" data-action="plus"><i class="fa-solid fa-plus" style="font-size: 0.5rem;"></i></button>
              </div>
            </div>
            <button class="btn btn-link text-muted p-1 hover-text-danger position-absolute top-0 end-0 m-1 cart-remove-btn" data-id="${item.id}"><i class="fa-solid fa-xmark" style="font-size: 0.7rem;"></i></button>
          </div>
        `;
      });
      
      html += `</div>
        <div class="mt-4 pt-3 border-top border-luxury">
          <div class="d-flex justify-content-between mb-3">
            <span class="text-muted fw-semibold" style="font-size: 0.8rem;">Subtotal</span>
            <span class="font-display fw-bold text-charcoal">AED ${subtotal.toLocaleString()}</span>
          </div>
          <a href="cart.html" class="btn btn-primary-luxury w-100">Review Commission</a>
        </div>
      `;
      
      $drawer.html(html);
    },
    
    renderCartPage() {
      const $cartContainer = $('#cart-items-container');
      if ($cartContainer.length === 0) return;
      
      if (this.items.length === 0) {
        $cartContainer.html(`
          <div class="bg-white border border-luxury rounded-1 p-5 text-center shadow-sm">
            <i class="fa-solid fa-box-open text-gold display-4 mb-3"></i>
            <h3 class="font-display fw-medium text-charcoal fs-4 mb-2">No Commissions Found</h3>
            <p class="text-muted mb-4" style="font-size: 0.85rem;">Your architectural cart is currently empty.</p>
            <a href="shop.html" class="btn btn-dark px-4 py-2 text-uppercase fw-semibold" style="font-size: 0.75rem; letter-spacing: 0.1em;">Return to Collections</a>
          </div>
        `);
        $('#cart-summary-total').text('AED 0');
        $('#cart-summary-subtotal').text('AED 0');
        $('#cart-summary-vat').text('AED 0');
        return;
      }
      
      let html = '';
      let subtotal = 0;
      
      this.items.forEach(item => {
        subtotal += item.price * item.qty;
        html += `
          <div class="bg-white border border-luxury rounded-1 p-4 d-flex flex-column flex-sm-row gap-4 align-items-start align-items-sm-center justify-content-between shadow-sm transition-all hover-border-gold">
            <div class="d-flex gap-3 align-items-center flex-grow-1">
              <div class="border border-luxury rounded-1 overflow-hidden flex-shrink-0" style="width: 80px; height: 80px;">
                <img src="${item.image}" alt="Product" class="w-100 h-100 object-fit-cover">
              </div>
              <div>
                <h3 class="font-display fw-medium text-charcoal mb-1" style="font-size: 1rem;">${item.name}</h3>
                <p class="text-muted m-0" style="font-size: 0.75rem;">Category: <span class="text-charcoal fw-medium text-capitalize">${item.category}</span></p>
              </div>
            </div>
            
            <div class="d-flex align-items-center gap-4 align-self-end align-self-sm-center">
              <div class="d-flex align-items-center border border-luxury rounded-1 bg-ivory">
                <button class="btn btn-sm px-2 text-charcoal border-0 shadow-none cart-qty-btn" data-id="${item.id}" data-action="minus"><i class="fa-solid fa-minus" style="font-size: 0.6rem;"></i></button>
                <span class="fw-semibold text-charcoal" style="font-size: 0.8rem; width: 20px; text-align: center;">${item.qty}</span>
                <button class="btn btn-sm px-2 text-charcoal border-0 shadow-none cart-qty-btn" data-id="${item.id}" data-action="plus"><i class="fa-solid fa-plus" style="font-size: 0.6rem;"></i></button>
              </div>
              <div class="text-end" style="min-width: 90px;">
                <span class="font-display fw-semibold text-charcoal d-block" style="font-size: 1rem;">AED ${(item.price * item.qty).toLocaleString()}</span>
                <span class="text-muted" style="font-size: 0.65rem;">AED ${item.price.toLocaleString()} each</span>
              </div>
              <button class="btn btn-link text-muted p-0 ms-2 hover-text-danger cart-remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
        `;
      });
      
      $cartContainer.html(html);
      
      const vat = subtotal * 0.05;
      const total = subtotal + vat;
      
      $('#cart-summary-subtotal').text('AED ' + subtotal.toLocaleString());
      $('#cart-summary-vat').text('AED ' + vat.toLocaleString());
      $('#cart-summary-total').text('AED ' + total.toLocaleString());
    }
  };

  // Expose globally to allow other scripts to call it
  window.CartManager = CartManager;

  // Bind dynamic click events (since items might be injected after load)
  $(document).on('click', '.add-to-cart-btn', function(e) {
    e.preventDefault();
    const id = $(this).data('id') || 'prod_' + Math.floor(Math.random()*1000);
    const name = $(this).data('name') || $(this).closest('.luxury-card').find('h4').text().trim() || 'Bespoke Item';
    const price = parseInt($(this).data('price')) || 32000;
    const category = $(this).data('category') || 'Architectural';
    const image = $(this).data('image') || $(this).closest('.luxury-card').find('img').attr('src') || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400';
    
    CartManager.add({ id, name, price, category, image });
  });

  $(document).on('click', '.cart-qty-btn', function() {
    const id = $(this).data('id');
    const action = $(this).data('action');
    CartManager.updateQty(id, action === 'plus' ? 1 : -1);
  });

  $(document).on('click', '.cart-remove-btn', function() {
    const id = $(this).data('id');
    CartManager.remove(id);
  });

  $('#clearCartBtn').on('click', function() {
    CartManager.clear();
  });

  // Initial render
  CartManager.render();

});



// ==========================================
// UI UX PRO MAX LOGIC
// ==========================================
$(document).ready(function() {
  
  // 1. Premium Dual Magnetic Cursor (Dot + Ring)
  const ringEl = document.getElementById('custom-cursor');

  if (ringEl) {
    document.body.classList.add('hide-native');

    // --- Inject cursor dot via JS (no HTML edits needed) ---
    const dotEl = document.createElement('div');
    dotEl.id = 'cursor-dot';
    document.body.appendChild(dotEl);

    // State
    let mouseX = -200, mouseY = -200;
    let ringX  = -200, ringY  = -200;
    let prevMouseX = -200, prevMouseY = -200;
    let cursorVisible = false;
    let isMagnetic = false;
    let magnetTarget = null;
    let isTextMode = false;
    let trailThrottle = 0;

    const interactiveSelector  = 'a, button, input, select, textarea, label, .luxury-card, .cursor-pointer, [data-bs-toggle]';
    const textSelector          = 'p, h1, h2, h3, h4, h5, h6, span, li, blockquote';

    // --- Mousemove ---
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // First move: snap ring and show both cursors
      if (!cursorVisible) {
        ringX = mouseX; ringY = mouseY;
        cursorVisible = true;
        ringEl.style.opacity = '1';
        dotEl.style.opacity  = '1';
      }

      // Dot follows exactly (instant)
      dotEl.style.left = (mouseX - 4) + 'px';
      dotEl.style.top  = (mouseY - 4) + 'px';

      // Trail dots on fast movement
      const speed = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      if (speed > 18 && cursorVisible) {
        trailThrottle++;
        if (trailThrottle % 2 === 0) {          // every 2nd fast frame
          const trail = document.createElement('div');
          trail.className = 'cursor-trail';
          trail.style.left = (mouseX - 3) + 'px';
          trail.style.top  = (mouseY - 3) + 'px';
          document.body.appendChild(trail);
          trail.addEventListener('animationend', () => trail.remove());
        }
      }
      prevMouseX = mouseX; prevMouseY = mouseY;
    }, { passive: true });

    // --- Visibility: leave / enter window ---
    document.addEventListener('mouseleave', () => {
      ringEl.style.opacity = '0';
      dotEl.style.opacity  = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorVisible) {
        ringEl.style.opacity = '1';
        dotEl.style.opacity  = '1';
      }
    });

    // --- Animation Loop: ring lerps, magnetic pull ---
    function cursorLoop() {
      let targetX = mouseX, targetY = mouseY;

      // Magnetic pull: attract ring toward element center
      if (isMagnetic && magnetTarget) {
        const rect = magnetTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const distX = mouseX - centerX;
        const distY = mouseY - centerY;
        targetX = mouseX - distX * 0.3;
        targetY = mouseY - distY * 0.3;
      }

      // Lerp ring
      ringX += (targetX - ringX) * 0.12;
      ringY += (targetY - ringY) * 0.12;

      const halfRing = (ringEl.offsetWidth || 24) / 2;
      ringEl.style.left = (ringX - halfRing) + 'px';
      ringEl.style.top  = (ringY - halfRing) + 'px';

      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();

    // --- Hover: interactive elements (ring expands + gold) ---
    document.addEventListener('mouseover', function(e) {
      const el = e.target.closest(interactiveSelector);
      if (el) {
        ringEl.classList.add('hover-state');
        dotEl.classList.add('dot-hover');
        isMagnetic   = true;
        magnetTarget = el;
      }
      // Text mode: ring becomes a thin underline-style indicator
      if (!el && e.target.closest(textSelector)) {
        ringEl.classList.add('text-mode');
        isTextMode = true;
      }
    });
    document.addEventListener('mouseout', function(e) {
      if (e.target.closest(interactiveSelector)) {
        ringEl.classList.remove('hover-state');
        dotEl.classList.remove('dot-hover');
        isMagnetic   = false;
        magnetTarget = null;
      }
      if (isTextMode && e.target.closest(textSelector)) {
        ringEl.classList.remove('text-mode');
        isTextMode = false;
      }
    });

    // --- Click: shrink ring, pulse dot, spawn 2 ripple rings ---
    document.addEventListener('mousedown', function(e) {
      ringEl.classList.add('click-state');
      dotEl.classList.add('dot-click');

      // Spawn 2 ripple rings with staggered delay
      [0, 120].forEach(function(delay) {
        setTimeout(function() {
          const ripple = document.createElement('div');
          ripple.className = 'cursor-ripple';
          ripple.style.left = e.clientX + 'px';
          ripple.style.top  = e.clientY + 'px';
          document.body.appendChild(ripple);
          ripple.addEventListener('animationend', () => ripple.remove());
        }, delay);
      });
    });

    document.addEventListener('mouseup', function() {
      ringEl.classList.remove('click-state');
      dotEl.classList.remove('dot-click');
    });
  }

  // 2. Parallax Effect
  const parallaxElements = document.querySelectorAll('.aspect-4-3 img, .aspect-16-9 img, .aspect-21-9 img');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      parallaxElements.forEach(el => {
        const rect = el.parentElement.getBoundingClientRect();
        // Only parallax if in viewport
        if(rect.top < window.innerHeight && rect.bottom > 0) {
          const yPos = (rect.top * 0.15); // Adjust multiplier for strength
          el.style.transform = `translateY(${yPos}px) scale(1.15)`;
        }
      });
    });
    // Set initial scale to allow parallax movement
    parallaxElements.forEach(el => {
      el.style.transform = 'scale(1.15)';
      el.style.transformOrigin = 'center center';
      el.style.transition = 'transform 0.1s linear';
    });
  }

  // 3. Smart Navbar (Hide on scroll down, show on scroll up)
  let lastScrollTop = 0;
  const $navbar = $('.navbar.sticky-top');
  
  $(window).on('scroll', function() {
    let st = $(this).scrollTop();
    
    // Smart hide/show logic
    if (st > lastScrollTop && st > 150){
       // Downscroll
       $navbar.addClass('nav-hidden');
    } else {
       // Upscroll
       $navbar.removeClass('nav-hidden');
    }
    
    // Glassmorphism logic (existing updated)
    if (st > 50) {
      $navbar.addClass('shadow-sm');
    } else {
      $navbar.removeClass('shadow-sm');
    }
    
    lastScrollTop = st;
  });

  // 4. VanillaTilt for Luxury Cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".luxury-card"), {
      max: 5,
      speed: 400,
      glare: true,
      "max-glare": 0.1,
      scale: 1.02
    });
  }
  
});



// ==========================================
// WISHLIST MANAGER
// ==========================================
$(document).ready(function() {
  
  const WishlistManager = {
    items: JSON.parse(localStorage.getItem('luxeWishlist')) || [],
    
    save() {
      localStorage.setItem('luxeWishlist', JSON.stringify(this.items));
      this.updateButtons();
      this.renderWishlistPage();
    },
    
    add(product) {
      if (!this.items.find(i => i.id === product.id)) {
        this.items.push(product);
        this.save();
        window.showToast('Saved to Wishlist', product.name + ' added to your wishlist.');
      } else {
        this.remove(product.id);
      }
    },
    
    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
      this.save();
    },
    
    isSaved(id) {
      return !!this.items.find(i => i.id === id);
    },
    
    updateButtons() {
      $('.add-to-wishlist-btn').each(function() {
        const id = $(this).data('id');
        const $icon = $(this).find('i');
        if (WishlistManager.isSaved(id)) {
          $icon.removeClass('fa-regular').addClass('fa-solid');
          $(this).addClass('text-danger border-danger');
        } else {
          $icon.removeClass('fa-solid').addClass('fa-regular');
          $(this).removeClass('text-danger border-danger');
        }
      });
    },
    
    renderWishlistPage() {
      const $container = $('#wishlist-items-container');
      if ($container.length === 0) return;
      
      const $count = $('#wishlist-count');
      $count.text(this.items.length);
      
      if (this.items.length === 0) {
        $container.html(`
          <div class="text-center py-5">
            <div class="d-flex align-items-center justify-content-center bg-white border border-luxury rounded-circle mx-auto text-muted shadow-sm mb-4" style="width: 80px; height: 80px;">
              <i class="fa-solid fa-heart text-gold fs-1"></i>
            </div>
            <h2 class="font-display fw-light fs-2 text-charcoal mb-3">Your Architectural Wishlist is Empty</h2>
            <p class="text-muted mx-auto mb-4" style="max-width: 500px; font-size: 0.9rem;">Save your favourite gate designs, pivot doors, and pergola models for consultation.</p>
            <a href="shop.html" class="btn btn-dark rounded-1 text-uppercase fw-semibold tracking-wider d-inline-flex align-items-center gap-2" style="font-size: 0.75rem; padding: 1rem 2rem;">
              Explore Collections <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        `);
        return;
      }
      
      let html = '<div class="row g-4">';
      this.items.forEach(item => {
        html += `
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="luxury-card h-100 rounded-1 overflow-hidden d-flex flex-column shadow-sm position-relative">
              <div class="position-absolute top-0 end-0 m-2 z-1">
                <button class="btn btn-sm btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center wishlist-remove-btn shadow" 
                  data-id="${item.id}" style="width:28px;height:28px;">
                  <i class="fa-solid fa-xmark" style="font-size:0.65rem;"></i>
                </button>
              </div>
              <div class="position-relative bg-warm-beige overflow-hidden" style="height: 180px;">
                <img src="${item.image}" class="w-100 h-100 object-fit-cover" alt="${item.name}">
              </div>
              <div class="p-3 bg-white d-flex flex-column flex-grow-1">
                <h4 class="font-display fw-medium fs-6 text-charcoal mb-1">${item.name}</h4>
                <p class="text-muted mb-2" style="font-size: 0.7rem; text-transform: capitalize;">${item.category}</p>
                <div class="mt-auto">
                  <span class="fw-bold text-charcoal d-block mb-2" style="font-size: 0.85rem;">AED ${parseInt(item.price).toLocaleString()}</span>
                  <button class="btn btn-dark btn-sm w-100 rounded-1 fw-semibold text-uppercase add-to-cart-btn"
                    style="font-size: 0.6rem; letter-spacing: 0.06em;"
                    data-id="${item.id}" data-name="${item.name}" data-price="${item.price}"
                    data-category="${item.category}" data-image="${item.image}"
                    data-bs-toggle="offcanvas" data-bs-target="#cartDrawer">
                    <i class="fa-solid fa-bag-shopping me-1"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      });
      html += '</div>';
      $container.html(html);
    }
  };
  
  window.WishlistManager = WishlistManager;
  
  // Bind wishlist add button
  $(document).on('click', '.add-to-wishlist-btn', function(e) {
    e.preventDefault();
    const product = {
      id: $(this).data('id'),
      name: $(this).data('name'),
      price: $(this).data('price'),
      category: $(this).data('category'),
      image: $(this).data('image')
    };
    WishlistManager.add(product);
  });
  
  // Bind wishlist remove button (on wishlist page)
  $(document).on('click', '.wishlist-remove-btn', function() {
    WishlistManager.remove($(this).data('id'));
  });
  
  // Init
  setTimeout(() => {
    WishlistManager.updateButtons();
    WishlistManager.renderWishlistPage();
  }, 600);
  
  
  // ==========================================
  // SEARCH OVERLAY
  // ==========================================
  const $searchOverlay = $('#searchOverlay');
  
  // Bind search icon click to open overlay
  $(document).on('click', '.search-trigger-btn', function(e) {
    e.preventDefault();
    $searchOverlay.addClass('active');
    setTimeout(() => $('#searchInput').focus(), 300);
  });
  
  // Close on overlay background click
  $searchOverlay.on('click', function(e) {
    if ($(e.target).is('#searchOverlay') || $(e.target).is('.search-close-btn')) {
      $searchOverlay.removeClass('active');
    }
  });
  
  // Close on Escape key
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') $searchOverlay.removeClass('active');
  });
  
  // Live search logic
  const searchProducts = [
    { name: 'Royal Noir Automatic Sliding Villa Gate', category: 'gates', price: 34500, href: 'product.html?id=gate-01', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dubai Modern Laser-Cut Geometric Villa Gate', category: 'gates', price: 42000, href: 'product.html?id=gate-02', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
    { name: 'Palazzo Monumental Pivot Door', category: 'doors', price: 45000, href: 'product.html?id=door-01', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ultra-Slim Thermal Aluminium Window System', category: 'windows', price: 28000, href: 'product.html?id=win-01', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bioclimatic Louvered Pergola', category: 'pergolas', price: 65000, href: 'product.html?id=perg-01', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Arabian Heritage Wrought Iron Gate', category: 'gates', price: 38500, href: 'product.html?id=gate-03', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80' },
    { name: 'Steel Louvered Privacy Screen Panel', category: 'screens', price: 18500, href: 'shop.html', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Cantilever Carport System', category: 'carports', price: 42000, href: 'shop.html', image: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=400&q=80' },
  ];
  
  $('#searchInput').on('input', function() {
    const q = $(this).val().toLowerCase().trim();
    const $results = $('#searchResults');
    
    if (q.length < 2) {
      $results.html('<p class="text-muted text-center py-4" style="font-size:0.8rem;">Type to search architectural collections...</p>');
      return;
    }
    
    const matches = searchProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    
    if (matches.length === 0) {
      $results.html(`<p class="text-muted text-center py-4" style="font-size:0.8rem;">No results for "<strong>${q}</strong>". Try "gates", "doors", or "pergolas".</p>`);
      return;
    }
    
    let html = '<div class="row g-3">';
    matches.forEach(p => {
      html += `
        <div class="col-6 col-md-4">
          <a href="${p.href}" class="d-flex gap-3 align-items-center text-decoration-none bg-ivory border border-luxury rounded-1 p-2 hover-border-gold">
            <img src="${p.image}" class="rounded-1 object-fit-cover flex-shrink-0" style="width:50px;height:50px;" alt="${p.name}">
            <div>
              <div class="fw-semibold text-charcoal" style="font-size:0.75rem; line-height:1.3;">${p.name}</div>
              <div class="text-gold" style="font-size:0.65rem;">AED ${p.price.toLocaleString()}</div>
            </div>
          </a>
        </div>`;
    });
    html += '</div>';
    $results.html(html);
  });
  
  
  // ==========================================
  // CHECKOUT — Sync CartManager to Summary
  // ==========================================
  const $checkoutItems = $('#checkoutCartItems');
  if ($checkoutItems.length && window.CartManager) {
    const items = CartManager.items;
    if (items.length > 0) {
      let html = '';
      let subtotal = 0;
      items.forEach(item => {
        subtotal += item.price * item.qty;
        html += `<div class="d-flex justify-content-between align-items-center text-charcoal" style="font-size: 0.75rem;">
          <span class="fw-medium text-truncate pe-2">${item.qty}x ${item.name}</span>
          <span class="fw-semibold flex-shrink-0">AED ${(item.price * item.qty).toLocaleString()}</span>
        </div>`;
      });
      $checkoutItems.html(html);
      const vat = subtotal * 0.05;
      const total = subtotal + vat;
      $('#checkoutSubtotal').text('AED ' + subtotal.toLocaleString());
      $('#checkoutVat').text('AED ' + vat.toLocaleString());
      $('#checkoutTotal').text('AED ' + total.toLocaleString());
    }
  }
  
  
  // ==========================================
  // AOS INIT (Fixed — called after DOM ready)
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({ once: true, offset: 60, duration: 900, easing: 'ease-out-cubic' });
  }
  
  
  // ==========================================
  // NAVBAR ACTIVE STATE
  // ==========================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.navbar-nav .nav-link, .navbar-nav a').each(function() {
    const href = $(this).attr('href') || '';
    if (href && href.includes(currentPage) && currentPage !== '') {
      $(this).addClass('active fw-bold');
      $(this).css('color', 'var(--accent-gold)');
    }
  });
  
});
