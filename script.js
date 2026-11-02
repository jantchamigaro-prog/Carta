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