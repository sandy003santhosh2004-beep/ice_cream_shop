// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
    if (link) {
      if (window.scrollY >= top && window.scrollY < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
});

// Hamburger menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll to top
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Product filter
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Testimonials carousel
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let autoPlay;

function goToSlide(index) {
  testimonialCards[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  testimonialCards[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % testimonialCards.length);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoPlay);
    goToSlide(parseInt(dot.dataset.index));
    autoPlay = setInterval(nextSlide, 4000);
  });
});

autoPlay = setInterval(nextSlide, 4000);

// Contact form → WhatsApp
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !phone || !message) return;

  const text = `Hello Dairy Shop! 👋\n\nName: ${name}\nPhone: ${phone}\n\nMessage:\n${message}`;
  const waUrl = `https://wa.me/916382912011?text=${encodeURIComponent(text)}`;
  formSuccess.style.display = 'block';
  contactForm.reset();
  setTimeout(() => {
    formSuccess.style.display = 'none';
    window.open(waUrl, '_blank');
  }, 1000);
});

// ===================== CART SYSTEM =====================
let cart = [];

const cartPanel     = document.getElementById('cartPanel');
const cartOverlay   = document.getElementById('cartOverlay');
const cartNavBtn    = document.getElementById('cartNavBtn');
const cartCloseBtn  = document.getElementById('cartCloseBtn');
const cartCount     = document.getElementById('cartCount');
const cartItemsList = document.getElementById('cartItemsList');
const cartEmpty     = document.getElementById('cartEmpty');
const cartPanelFooter = document.getElementById('cartPanelFooter');
const cartWhatsappBtn = document.getElementById('cartWhatsappBtn');
const cartClearBtn  = document.getElementById('cartClearBtn');

function openCart() {
  cartPanel.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartPanel.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartNavBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function renderCart() {
  cartItemsList.innerHTML = '';
  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartPanelFooter.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartPanelFooter.style.display = 'block';

    // Group items by name
    const grouped = {};
    cart.forEach(item => {
      grouped[item] = (grouped[item] || 0) + 1;
    });

    Object.entries(grouped).forEach(([name, qty]) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <span class="cart-item-name">${name}</span>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="dec" data-name="${name}">−</button>
          <span class="qty-count">${qty}</span>
          <button class="qty-btn" data-action="inc" data-name="${name}">+</button>
          <button class="remove-btn" data-name="${name}" aria-label="Remove">🗑️</button>
        </div>
      `;
      cartItemsList.appendChild(li);
    });

    // Qty & remove listeners
    cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = btn.dataset.name;
        if (btn.dataset.action === 'inc') {
          cart.push(n);
        } else {
          const idx = cart.lastIndexOf(n);
          if (idx !== -1) cart.splice(idx, 1);
        }
        renderCart();
      });
    });

    cartItemsList.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const n = btn.dataset.name;
        cart = cart.filter(i => i !== n);
        renderCart();
      });
    });
  }
}

// Add-to-cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const product = btn.dataset.product;
    cart.push(product);
    renderCart();

    // Animate button
    btn.textContent = '✅ Added!';
    btn.style.background = 'linear-gradient(135deg,#25d366,#128c7e)';
    setTimeout(() => {
      btn.innerHTML = '🛒 Add to Order';
      btn.style.background = '';
    }, 1200);

    // Bounce the cart badge
    cartCount.classList.add('bounce');
    setTimeout(() => cartCount.classList.remove('bounce'), 400);

    openCart();
  });
});

// Send order via WhatsApp
cartWhatsappBtn.addEventListener('click', () => {
  if (cart.length === 0) return;

  const customerName  = document.getElementById('cartCustomerName').value.trim() || 'Customer';
  const customerPhone = document.getElementById('cartCustomerPhone').value.trim() || '-';

  const grouped = {};
  cart.forEach(item => { grouped[item] = (grouped[item] || 0) + 1; });

  const itemLines = Object.entries(grouped)
    .map(([name, qty]) => `  • ${name} × ${qty}`)
    .join('\n');

  const message =
    `🛒 *New Order – Dairy Shop Kovilpatti*\n\n` +
    `👤 Name: ${customerName}\n` +
    `📞 Phone: ${customerPhone}\n\n` +
    `📦 *Order Details:*\n${itemLines}\n\n` +
    `Please confirm my order. Thank you! 🙏`;

  window.open(`https://wa.me/916382912011?text=${encodeURIComponent(message)}`, '_blank');
});

// Clear cart
cartClearBtn.addEventListener('click', () => {
  cart = [];
  renderCart();
});

// Intersection Observer for animations
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

const animatedEls = document.querySelectorAll('.why-card, .product-card, .contact-card');
animatedEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

