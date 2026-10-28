document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    siteNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", event => {
      if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("mediaLightbox");
  const mediaContainer = document.getElementById("lightboxMedia");
  const caption = document.getElementById("lightboxCaption");
  const counter = document.getElementById("lightboxCounter");
  const closeButton = document.getElementById("lightboxClose");
  const prevButton = document.getElementById("lightboxPrev");
  const nextButton = document.getElementById("lightboxNext");

  let currentItems = [];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function stopAndClearMedia() {
    const video = mediaContainer.querySelector("video");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
    mediaContainer.replaceChildren();
  }

  function showItem(index, autoplay = false) {
    if (!currentItems.length) return;
    currentIndex = (index + currentItems.length) % currentItems.length;
    const item = currentItems[currentIndex];
    const type = item.dataset.type;
    const src = item.dataset.src;
    const title = item.dataset.caption || `Portfolio item ${currentIndex + 1}`;

    stopAndClearMedia();
    caption.textContent = title;
    counter.textContent = `${currentIndex + 1} / ${currentItems.length}`;
    prevButton.hidden = currentItems.length < 2;
    nextButton.hidden = currentItems.length < 2;

    if (!src) {
      caption.textContent = `${title} — media source is missing.`;
      return;
    }

    if (type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;
      video.setAttribute("aria-label", title);
      video.setAttribute("controlsList", "nodownload");
      if (item.dataset.poster) video.poster = item.dataset.poster;
      const source = document.createElement("source");
      source.src = src;
      source.type = src.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4";
      video.appendChild(source);
      mediaContainer.appendChild(video);
      if (autoplay) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
      }
    } else {
      const image = document.createElement("img");
      image.src = src;
      image.alt = title;
      image.addEventListener("error", () => {
        caption.textContent = `${title} — image could not be loaded. Check the filename and folder.`;
      }, { once: true });
      mediaContainer.appendChild(image);
    }
  }

  function openLightbox(item) {
    const type = item.dataset.type;
    // Keep image browsing and video browsing separate.
    currentItems = galleryItems.filter(candidate => candidate.dataset.type === type);
    currentIndex = currentItems.indexOf(item);
    lastFocusedElement = document.activeElement;
    lightbox.inert = false;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    showItem(currentIndex, type === "video");
    closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("is-open")) return;
    stopAndClearMedia();
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.inert = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocusedElement && lastFocusedElement.isConnected) lastFocusedElement.focus();
  }

  galleryItems.forEach(item => item.addEventListener("click", () => openLightbox(item)));
  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", () => showItem(currentIndex - 1));
  nextButton.addEventListener("click", () => showItem(currentIndex + 1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showItem(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showItem(currentIndex + 1);
    }
  });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();
});
