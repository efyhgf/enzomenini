// =========================
// MENU BURGER (mobile)
// =========================
const burger = document.getElementById("burger");
const navLinks = document.querySelector(".nav-links");

if (burger) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    burger.classList.toggle("active");
  });
}

// =========================
// SCROLL SMOOTH (ancres)
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// =========================
// ANIMATION SKILLS (barres)
// =========================
const skillFills = document.querySelectorAll(".sk-fill");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue("--w");
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(fill => {
  fill.style.width = "0";
  observer.observe(fill);
});

// =========================
// FORMULAIRE CONTACT
// =========================
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const status = document.getElementById("formStatus");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Veuillez remplir tous les champs.";
      status.style.color = "red";
      return;
    }

    // Simulation envoi (pas de backend ici)
    status.textContent = "Message envoyé ✔";
    status.style.color = "green";

    form.reset();
  });
}

// =========================
// PAGE PROJETS
// =========================
const viewProjects = document.getElementById("view-projects");
const viewCompetences = document.getElementById("view-competences");
const viewGallery = document.getElementById("view-gallery");

let currentProject = null;
let currentComp = null;

// ===== OUVRIR COMPÉTENCES =====
document.querySelectorAll(".proj-card").forEach(card => {
  card.addEventListener("click", () => {
    currentProject = card.dataset.project;

    const name = card.querySelector(".proj-name").textContent;
    document.getElementById("current-project-name").textContent = name;

    switchView(viewCompetences);
  });
});

// ===== RETOUR PROJETS =====
const backToProjects = document.getElementById("back-to-projects");
if (backToProjects) {
  backToProjects.addEventListener("click", () => {
    switchView(viewProjects);
  });
}

// ===== OUVRIR GALERIE =====
document.querySelectorAll(".comp-card").forEach(card => {
  card.addEventListener("click", () => {
    currentComp = card.dataset.comp;

    document.getElementById("current-comp-name").textContent =
      card.querySelector(".comp-name").textContent;

    document.getElementById("gallery-project-name").textContent =
      document.getElementById("current-project-name").textContent;

    loadGallery();
    switchView(viewGallery);
  });
});

// ===== RETOUR COMPÉTENCES =====
const backToCompetences = document.getElementById("back-to-competences");
if (backToCompetences) {
  backToCompetences.addEventListener("click", () => {
    switchView(viewCompetences);
  });
}

// =========================
// SWITCH VIEW
// =========================
function switchView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  view.classList.add("active");
}

// =========================
// GALERIE
// =========================
function loadGallery() {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");

  if (!grid || !window.PROJECT_DATA) return;

  grid.innerHTML = "";

  const images = PROJECT_DATA[currentProject]?.[currentComp] || [];

  if (images.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  images.forEach((img, index) => {
    const el = document.createElement("div");
    el.className = "gallery-item";

    el.innerHTML = `
      <img src="${img.src}" alt="${img.caption}" data-index="${index}">
    `;

    grid.appendChild(el);
  });

  initLightbox(images);
}

// =========================
// LIGHTBOX
// =========================
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");

let currentIndex = 0;
let currentImages = [];

function initLightbox(images) {
  currentImages = images;

  document.querySelectorAll(".gallery-item img").forEach(img => {
    img.addEventListener("click", () => {
      currentIndex = parseInt(img.dataset.index);
      openLightbox();
    });
  });
}

function openLightbox() {
  updateLightbox();
  lightbox.classList.add("open");
}

function updateLightbox() {
  const img = currentImages[currentIndex];
  lbImg.src = img.src;
  lbCaption.textContent = img.caption || "";
}

document.getElementById("lb-close")?.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

document.getElementById("lb-prev")?.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
});

document.getElementById("lb-next")?.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
});