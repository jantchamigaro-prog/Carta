const envelope = document.getElementById("envelope");
const scene = document.getElementById("scene");
const seal = document.getElementById("seal");

const galleryImage = document.getElementById("galleryImage");
const counter = document.getElementById("counter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const images = ["img/foto1.png", "img/foto2.png", "img/foto3.png"];
let currentImage = 0;
let opened = false;

// Visor de imagen ampliada (si no existe en el HTML/CSS, se crea aquí)
let imageModal = document.getElementById("imageModal");
if (!imageModal) {
  imageModal = document.createElement("div");
  imageModal.id = "imageModal";
  imageModal.className = "image-modal";
  imageModal.setAttribute("role", "dialog");
  imageModal.setAttribute("aria-modal", "true");
  imageModal.setAttribute("aria-label", "Fotografía ampliada");
  imageModal.setAttribute("aria-hidden", "true");
  imageModal.innerHTML =
    '<button class="modal-close" id="modalClose" aria-label="Cerrar imagen">&times;</button>' +
    '<img id="modalImage" src="" alt="Fotografía ampliada">';
  document.body.appendChild(imageModal);
}
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
let previousFocus = null;

// Si los estilos del visor no están cargados, se inyectan
if (getComputedStyle(imageModal).position !== "fixed") {
  const st = document.createElement("style");
  st.textContent = `
    .gallery-photo::before { pointer-events: none; }
    .gallery-photo img { cursor: zoom-in; }
    .image-modal { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 50px 16px; background: rgba(7,3,8,.94); opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .35s ease, visibility .35s ease; }
    .image-modal.active { opacity: 1; visibility: visible; pointer-events: auto; }
    .image-modal img { display: block; width: auto; height: auto; max-width: 100%; max-height: 100%; object-fit: contain; cursor: zoom-out; border: 5px solid #eee0ce; border-radius: 3px; box-shadow: 0 20px 70px rgba(0,0,0,.7); transform: scale(.9); transition: transform .35s ease; }
    .image-modal.active img { transform: scale(1); }
    .modal-close { position: absolute; top: 14px; right: 24px; z-index: 2; background: none; border: 0; cursor: pointer; font-size: 42px; line-height: 1; color: #e8d9d0; }
  `;
  document.head.appendChild(st);
}

// Secuencia de apertura: sello -> solapa -> papel sube -> sobre se retira -> carta
seal.addEventListener("click", () => {
  if (opened) return;
  opened = true;
  const steps = [
    [0,    () => envelope.classList.add("breaking")],  // el sello se rompe y cae
    [550,  () => envelope.classList.add("opening")],   // la solapa se abre en 3D
    [1700, () => envelope.classList.add("rise")],      // el papel asoma
    [3000, () => envelope.classList.add("done")],      // el sobre se retira
    [3200, () => scene.classList.add("show-letter")]   // aparece la carta completa
  ];
  steps.forEach(([ms, fn]) => setTimeout(fn, ms));
});

function showImage(index) {
  galleryImage.style.opacity = "0";
  setTimeout(() => {
    galleryImage.src = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;
    galleryImage.style.opacity = "1";
  }, 200);
}

nextBtn.addEventListener("click", () => {
  currentImage = (currentImage + 1) % images.length;
  showImage(currentImage);
});

prevBtn.addEventListener("click", () => {
  currentImage = (currentImage - 1 + images.length) % images.length;
  showImage(currentImage);
});

document.addEventListener("keydown", (e) => {
  if (!scene.classList.contains("show-letter")) return;
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});


// =========================
// VISOR DE IMAGEN AMPLIADA
// =========================
function openModal() {
  previousFocus = document.activeElement;
  modalImage.src = images[currentImage];
  modalImage.alt = galleryImage.alt;
  imageModal.classList.add("active");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}

function closeModal() {
  imageModal.classList.remove("active");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previousFocus && previousFocus.focus) previousFocus.focus();
}

document.addEventListener("click", (e) => {
  if (e.target.closest && e.target.closest(".gallery-photo img")) openModal();
});
modalClose.addEventListener("click", closeModal);
// Cerrar pulsando en el fondo o en la propia imagen
imageModal.addEventListener("click", (e) => {
  if (e.target !== modalClose) closeModal();
});