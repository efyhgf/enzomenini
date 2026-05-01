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

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.getPropertyValue("--w");
    }
  });
}, { threshold: 0.5 });

skillFills.forEach(fill => {
  fill.style.width = "0";
  skillObserver.observe(fill);
});

// =========================
// FORMULAIRE CONTACT
// =========================
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const status = document.getElementById("formStatus");
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Veuillez remplir tous les champs.";
      status.style.color = "red";
      return;
    }
    status.textContent = "Message envoyé ✔";
    status.style.color = "green";
    form.reset();
  });
}

// =========================
// PAGE PROJETS
// =========================
const viewProjects     = document.getElementById("view-projects");
const viewCompetences  = document.getElementById("view-competences");
const viewGallery      = document.getElementById("view-gallery");

let currentProject = null;
let currentComp    = null;

// ===== OUVRIR COMPÉTENCES depuis un projet =====
document.querySelectorAll(".proj-card").forEach(card => {
  card.addEventListener("click", () => {
    currentProject = card.dataset.project;
    document.getElementById("current-project-name").textContent =
      card.querySelector(".proj-name").textContent;
    switchView(viewCompetences);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ===== RETOUR → liste des projets =====
const backToProjects = document.getElementById("back-to-projects");
if (backToProjects) {
  backToProjects.addEventListener("click", () => {
    switchView(viewProjects);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== OUVRIR GALERIE depuis une compétence =====
document.querySelectorAll(".comp-card").forEach(card => {
  card.addEventListener("click", () => {
    currentComp = card.dataset.comp;

    // Récupère les images (tableau vide si la clé n'existe pas)
    const images = (PROJECT_DATA[currentProject] || {})[currentComp] || [];

    // Met à jour les titres
    document.getElementById("current-comp-name").textContent =
      card.querySelector(".comp-name").textContent;
    document.getElementById("gallery-project-name").textContent =
      document.getElementById("current-project-name").textContent;

    // Charge la galerie (même si vide → affiche le message)
    loadGallery(images);
    switchView(viewGallery);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ===== RETOUR → liste des compétences =====
const backToCompetences = document.getElementById("back-to-competences");
if (backToCompetences) {
  backToCompetences.addEventListener("click", () => {
    switchView(viewCompetences);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
function loadGallery(images) {
  const grid  = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");

  // Vide la grille à chaque ouverture
  grid.innerHTML = "";

  if (!images || images.length === 0) {
    empty.style.display = "block";
    grid.style.display  = "none";
    return;
  }

  empty.style.display = "none";
  grid.style.display  = "";

  images.forEach((img, index) => {
    const el = document.createElement("div");
    el.className = "gallery-item";

    const imgEl = document.createElement("img");
    imgEl.src            = img.src;
    imgEl.alt            = img.caption || "";
    imgEl.dataset.index  = index;

    // Affiche un fond gris si l'image est introuvable
    imgEl.onerror = () => {
      el.innerHTML = `
        <div class="gallery-item-placeholder">
          <span class="icon">🖼</span>
          <span>${img.caption || img.src}</span>
        </div>`;
    };

    el.appendChild(imgEl);
    grid.appendChild(el);
  });

  // Initialise la lightbox avec la liste à jour
  initLightbox(images);
}

// =========================
// LIGHTBOX
// =========================
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");

let currentIndex  = 0;
let currentImages = [];

function initLightbox(images) {
  currentImages = images;

  // Délégation sur la grille pour éviter les doublons d'écouteurs
  const grid = document.getElementById("gallery-grid");
  grid.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-index]");
    if (!img) return;
    currentIndex = parseInt(img.dataset.index);
    openLightbox();
  });
}

function openLightbox() {
  updateLightbox();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function updateLightbox() {
  const img = currentImages[currentIndex];
  lbImg.src = img.src;
  lbCaption.textContent = img.caption || "";
}

document.getElementById("lb-close")?.addEventListener("click", closeLightbox);

document.getElementById("lb-prev")?.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
});

document.getElementById("lb-next")?.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
});

// Fermer la lightbox en cliquant sur le fond
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Fermer avec Échap, naviguer avec les flèches clavier
document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("open")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")  { currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length; updateLightbox(); }
  if (e.key === "ArrowRight") { currentIndex = (currentIndex + 1) % currentImages.length; updateLightbox(); }
});