/* ================================================================
   VAKITI SIDDU — PORTFOLIO JAVASCRIPT
   File: js/main.js
   Description: All interactivity for the portfolio website
   Dependencies: None (vanilla JS only)
================================================================ */

/* ----------------------------------------------------------------
   1. THEME TOGGLE (Dark / Light)
   - Reads saved preference from localStorage on load
   - Persists choice across sessions
---------------------------------------------------------------- */
const html       = document.documentElement;
const toggleBtn  = document.getElementById('themeToggle');
const themeIcon  = document.getElementById('themeIcon');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  themeIcon.className = t === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  localStorage.setItem('vs-theme', t);
}

toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Apply saved theme on page load
const savedTheme = localStorage.getItem('vs-theme');
if (savedTheme) setTheme(savedTheme);


/* ----------------------------------------------------------------
   2. MOBILE NAVIGATION MENU
   - Hamburger open/close toggle
   - Auto-closes when a nav link is clicked
---------------------------------------------------------------- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-nav').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});


/* ----------------------------------------------------------------
   3. ACTIVE NAV HIGHLIGHT ON SCROLL
   - Uses IntersectionObserver to detect which section is in view
   - Highlights the matching nav link
---------------------------------------------------------------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('[data-nav]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`[data-nav][href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));


/* ----------------------------------------------------------------
   4. SCROLL-TRIGGERED FADE-UP ANIMATIONS
   - Watches all .fade-up elements
   - Adds .visible class when they enter the viewport
   - Also triggers skill bar animations inside those elements
---------------------------------------------------------------- */
const fadeElements = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate any skill bars inside this element
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.dataset.pct + '%';
        }, 200);
      });
    }
  });
}, { threshold: 0.15 });

fadeElements.forEach(el => fadeObserver.observe(el));

// Immediately reveal hero section elements (no scroll needed)
setTimeout(() => {
  document.querySelectorAll('#home .fade-up').forEach(el => {
    el.classList.add('visible');
  });
}, 100);


/* ----------------------------------------------------------------
   5. SKILL CATEGORY TABS
   - Switches between Frontend / Backend / CS / Tools panels
   - Re-animates skill bars when a new tab is selected
   - Re-triggers fade-up for newly visible cards
---------------------------------------------------------------- */
const catButtons   = document.querySelectorAll('.skill-cat-btn');
const skillPanels  = document.querySelectorAll('.skills-panel');

catButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Reset all buttons and panels
    catButtons.forEach(b => b.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));

    // Activate selected
    btn.classList.add('active');
    const panel = document.getElementById('cat-' + btn.dataset.cat);

    if (panel) {
      panel.classList.add('active');

      // Re-animate skill bars in new panel
      panel.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.width = bar.dataset.pct + '%';
        }, 100);
      });

      // Re-trigger fade-up for cards in new panel
      panel.querySelectorAll('.fade-up').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 50);
      });
    }
  });
});


/* ----------------------------------------------------------------
   6. CONTACT FORM — VALIDATION + SUBMIT SIMULATION
   - Validates required fields (name, email, message)
   - Shows loading spinner on submit
   - Shows success message for 4 seconds then resets
   - Note: Wire up to a backend (EmailJS, Formspree, etc.) for
     real email delivery. Replace the setTimeout with your API call.
---------------------------------------------------------------- */
const sendBtn     = document.getElementById('sendBtn');
const formSuccess = document.getElementById('formSuccess');

sendBtn.addEventListener('click', () => {
  const fname = document.getElementById('fname').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg   = document.getElementById('msg').value.trim();

  // Basic validation
  if (!fname || !email || !msg) {
    alert('Please fill in your name, email, and message.');
    return;
  }

  // Loading state
  sendBtn.innerHTML  = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  sendBtn.disabled   = true;

  // Simulate network delay — replace with real API call
  setTimeout(() => {
    sendBtn.style.display = 'none';
    formSuccess.style.display = 'flex';

    // Auto-reset form after 4 seconds
    setTimeout(() => {
      formSuccess.style.display = 'none';
      sendBtn.style.display     = 'flex';
      sendBtn.innerHTML         = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      sendBtn.disabled          = false;

      // Clear all fields
      ['fname', 'lname', 'email', 'subject', 'msg'].forEach(id => {
        document.getElementById(id).value = '';
      });
    }, 4000);

  }, 1500);
});


/* ----------------------------------------------------------------
   7. INITIAL SKILL BAR ANIMATION ON PAGE LOAD
   - Animates bars in the default visible panel (Frontend)
   - Runs once after all assets have loaded
---------------------------------------------------------------- */
window.addEventListener('load', () => {
  document.querySelectorAll('.skills-panel.active .skill-fill').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.pct + '%';
    }, 600);
  });
});
