document.addEventListener('DOMContentLoaded', () => {
  try {
    if (window.emailjs && window.emailjs.init) {
      window.emailjs.init("XW2oPn7x9b6e_Brkl");
    }
  } catch (e) {
    console.warn("EmailJS init skipped:", e);
  }

  // Mobile Menu Toggle Function
  window.toggleMobileMenu = function() {
    const nav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-icon');
    
    if (nav) {
      nav.classList.toggle('active');
      
      // Change icon between hamburger and X
      if (menuIcon) {
        menuIcon.textContent = nav.classList.contains('active') ? '✕' : '☰';
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
      }
    });
  });

  // Mobile dropdown toggle
  const dropdowns = document.querySelectorAll('.nav-dropdown > a');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        dropdown.parentElement.classList.toggle('open');
      }
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
      console.log('Tawk hiding error:', e);
    }
  }

  // Initial runs with delays
  const delays = [100, 300, 500, 1000, 1500, 2000, 3000, 5000, 7000];
  delays.forEach(delay => setTimeout(hideTawkBranding, delay));
  
  // Continuous checking with interval
  setInterval(hideTawkBranding, 2000);
  
  // MutationObserver for dynamic changes
  setTimeout(() => {
    const observer = new MutationObserver(hideTawkBranding);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }, 500);

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
    document.querySelector('form#contact') ||
    null;

  if (contactForm && !contactForm.dataset.bound) {
    contactForm.dataset.bound = "1";
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (getVal(['hp_site','website','hp','botfield'])) return;

      const name    = getVal(['name','c_name','contact-name'], '');
      const email   = getVal(['email','c_email','contact-email'], '');
      const subject = getVal(['subject','c_subject','contact-subject'], 'Website Contact');
      const message = getVal(['user_message','message','c_message','contact-message'], '');
      const now     = new Date().toLocaleString();

      if (!window.emailjs) {
        showToast("Email service not loaded. Please try again.", true);
        return;
      }

      const params = {
        to_email: "nextbelt@next-belt.com",
        title: subject,
        name,
        time: now,
        email,
        user_message: message,
        reply_to: email
      };

      window.emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, params)
        .then(() => {
          try { contactForm.reset(); } catch {}
          showToast("Thanks! We’ve received your message and emailed a confirmation.");
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          showToast("Message sent to NextBelt. If no confirmation arrives, we’ll follow up manually.", true);
        });
    });
  }
});
