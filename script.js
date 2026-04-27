/* ===========================
   script.js — Portfolio
   =========================== */

// ── Burger menu mobile ──
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});

// Ferme le menu si on clique sur un lien
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  });
});

// ── Scroll reveal ──
const reveals = document.querySelectorAll(
  '.section-title, .text-body, .project-card, .about-meta, .skills-group, .contact-form, .contact-links, .meta-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ── Nav active au scroll ──
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Formulaire de contact ──
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';
  status.textContent = '';

  // Simulation d'envoi (remplace par un vrai fetch vers ton backend PHP)
  await new Promise(r => setTimeout(r, 1200));

  // Pour un vrai envoi PHP, décommente ci-dessous et adapte l'URL :
  /*
  const data = new FormData(form);
  const res = await fetch('send.php', { method: 'POST', body: data });
  const json = await res.json();
  if (!json.success) {
    status.textContent = 'Erreur lors de l\'envoi. Réessaie plus tard.';
    btn.disabled = false;
    btn.textContent = 'Envoyer le message';
    return;
  }
  */

  status.textContent = '✓ Message envoyé ! Je vous répondrai rapidement.';
  form.reset();
  btn.disabled = false;
  btn.textContent = 'Envoyer le message';
});
