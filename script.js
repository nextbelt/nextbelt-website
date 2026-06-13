document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.emailjs && window.emailjs.init) {
      window.emailjs.init("XW2oPn7x9b6e_Brkl");
    }
  } catch (e) {
    console.warn("EmailJS init skipped:", e);
  }

  // Timestamp page load for the form anti-bot time-trap
  const pageLoadedAt = Date.now();

  // Mobile Menu Toggle Function
  window.toggleMobileMenu = function() {
    const nav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-icon');
    const toggleBtn = document.querySelector('.menu-toggle');

    if (nav) {
      const isOpen = nav.classList.toggle('active');

      // Change icon between hamburger and X
      if (menuIcon) {
        menuIcon.textContent = isOpen ? '✕' : '☰';
      }
      // Keep the toggle button's ARIA state in sync for screen readers
      if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    }
  };

  // Close mobile menu when clicking a link (but not dropdown toggles)
  const navLinks = document.querySelectorAll('#mobile-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't close if clicking on dropdown toggle
      if (link.parentElement.classList.contains('nav-dropdown') && link.parentElement.querySelector('.dropdown-menu')) {
        // This is the dropdown toggle, don't close menu
        return;
      }
      
      const nav = document.getElementById('mobile-nav');
      const menuIcon = document.getElementById('menu-icon');
      
      if (nav && window.innerWidth <= 768) {
        nav.classList.remove('active');
        if (menuIcon) {
          menuIcon.textContent = '☰';
        }
        const toggleBtn = document.querySelector('.menu-toggle');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Dropdown toggle (all widths). The trigger is href="#", so always
  // preventDefault to avoid jumping to the top of the page on desktop click.
  const dropdowns = document.querySelectorAll('.nav-dropdown > a');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const opened = dropdown.parentElement.classList.toggle('open');
      dropdown.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('mobile-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (nav && menuToggle && 
        nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      const menuIcon = document.getElementById('menu-icon');
      if (menuIcon) {
        menuIcon.textContent = '☰';
      }
    }
  });

  // Hide Tawk.to branding - comprehensive approach
  function hideTawkBranding() {
    try {
      // Method 1: Target direct tawk.to links
      document.querySelectorAll('a[href*="tawk.to"]').forEach(link => {
        const text = (link.textContent || link.innerText || '').toLowerCase();
        if (link.target === '_blank' && (text.includes('tawk') || text.includes('powered'))) {
          link.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;width:0!important;';
          
          // Hide small parent containers
          let parent = link.parentElement;
          for (let i = 0; i < 3 && parent; i++) {
            if (parent.offsetHeight > 0 && parent.offsetHeight < 70 && parent.offsetWidth < 250) {
              parent.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;overflow:hidden!important;';
            }
            parent = parent.parentElement;
          }
        }
      });
      
      // Method 2: Target small divs with extreme z-index
      document.querySelectorAll('div').forEach(div => {
        const style = window.getComputedStyle(div);
        const zIndex = parseInt(style.zIndex);
        const text = (div.textContent || '').toLowerCase();
        
        if (zIndex > 999999000 && div.offsetHeight > 0 && div.offsetHeight < 50 && div.offsetWidth < 250) {
          if (text.includes('tawk') || text.includes('powered') || text.includes('by')) {
            div.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;overflow:hidden!important;';
          }
        }
      });
      
      // Method 3: Look for text content "Powered by tawk.to"
      const xpath = "//text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'powered by tawk')]";
      const textNodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (let i = 0; i < textNodes.snapshotLength; i++) {
        let node = textNodes.snapshotItem(i);
        let element = node.parentElement;
        let depth = 0;
        while (element && depth < 5) {
          if (element.offsetHeight < 70) {
            element.style.cssText = 'display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;overflow:hidden!important;';
          }
          element = element.parentElement;
          depth++;
        }
      }
    } catch (e) {
      console.debug('Tawk hiding error:', e);
    }
  }

  // Initial runs with delays
  const delays = [100, 300, 500, 1000, 1500, 2000, 3000, 5000, 7000];
  delays.forEach(delay => setTimeout(hideTawkBranding, delay));
  
  // Continuous checking for a bounded window — the widget loads within a few
  // seconds, so we stop after 15s to avoid indefinite main-thread/layout work.
  const tawkInterval = setInterval(hideTawkBranding, 2000);
  let tawkObserver = null;

  // MutationObserver for dynamic changes
  setTimeout(() => {
    tawkObserver = new MutationObserver(hideTawkBranding);
    tawkObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }, 500);

  // Tear down the branding-hider once the widget has settled (hidden styles persist).
  setTimeout(() => {
    clearInterval(tawkInterval);
    if (tawkObserver) tawkObserver.disconnect();
  }, 15000);

  const toastEl = document.getElementById('toast');
  function showToast(msg, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden', 'error', 'show');
    if (isError) toastEl.classList.add('error');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3200);
  }
  window.showToast = window.showToast || showToast;

  const SERVICE_ID = "service_9pdxtom";
  const ADMIN_TEMPLATE_ID = "template_mulotoe";

  const getEl = (ids) => ids.map(id => document.getElementById(id)).find(Boolean) || null;
  const getVal = (ids, fb = "") => {
    const el = getEl(ids);
    return (el && typeof el.value === "string") ? el.value.trim() : fb;
  };

  const contactForm =
    document.getElementById('contact-form') ||
    document.getElementById('demo-form') ||
    document.querySelector('form#contact') ||
    null;

  if (contactForm && !contactForm.dataset.bound) {
    contactForm.dataset.bound = "1";
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (getVal(['hp_site','website','hp','botfield'])) return;

      // Anti-bot time-trap: a human won't submit within 3s of page load
      if (Date.now() - pageLoadedAt < 3000) return;

      const name    = getVal(['name','c_name','contact-name'], '');
      const email   = getVal(['email','c_email','contact-email'], '');
      const subject = getVal(['subject','c_subject','contact-subject'], 'Website Contact');
      const message = getVal(['user_message','message','c_message','contact-message'], '');
      const now     = new Date().toLocaleString();

      if (!name || !email || !message) {
        showToast("Please add your name, email, and a message.", true);
        return;
      }

      if (!window.emailjs) {
        showToast("Email service not loaded. Please try again.", true);
        return;
      }

      const params = {
        to_email: "info@next-belt.com",
        title: subject,
        name,
        time: now,
        email,
        user_message: message,
        reply_to: email
      };

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      const restoreBtn = () => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || 'Send Message';
        }
      };

      window.emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, params)
        .then(() => {
          try { contactForm.reset(); } catch {}
          restoreBtn();
          showToast("Thanks! We’ve received your message and emailed a confirmation.");
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          restoreBtn();
          showToast("Message sent to NextBelt. If no confirmation arrives, we’ll follow up manually.", true);
        });
    });
  }
  // ============================================
  // SCROLL FADE-UP ANIMATION (IntersectionObserver)
  // ============================================
  const fadeEls = document.querySelectorAll('.fade-up, .fade-up-stagger');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => fadeObs.observe(el));
  } else {
    // Fallback: show everything immediately
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // STAT COUNTER ANIMATION
  // ============================================
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = el.getAttribute('data-count-to');
          const suffix = el.getAttribute('data-count-suffix') || '';
          const prefix = el.getAttribute('data-count-prefix') || '';
          const isFloat = target.includes('.');
          const end = parseFloat(target);
          const duration = 2000;
          const start = performance.now();

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * end;
            el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));
  }});
