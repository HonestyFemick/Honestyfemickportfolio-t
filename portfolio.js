
document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = Array.from(
        document.querySelectorAll(".gallery-item")
    );

    const lightbox = document.getElementById("galleryLightbox");
    const mediaContainer = document.getElementById("lightboxMedia");
    const caption = document.getElementById("lightboxCaption");
    const counter = document.getElementById("lightboxCounter");

    const closeButton = document.getElementById("lightboxClose");
    const prevButton = document.getElementById("lightboxPrev");
    const nextButton = document.getElementById("lightboxNext");

    if (
        !lightbox || !mediaContainer || !caption || !counter ||
        !closeButton || !prevButton || !nextButton
    ) {
        console.error("Gallery lightbox elements are missing.");
        return;
    }

    let currentIndex = 0;
    let lastFocusedElement = null;

    function showItem(index, autoplay = false) {
        if (!galleryItems.length) return;

        // Keep navigation within the gallery.
        currentIndex =
            (index + galleryItems.length) % galleryItems.length;

        const item = galleryItems[currentIndex];
        const type = item.dataset.type;
        const src = item.dataset.src;
        const title = item.dataset.caption || `Gallery item ${currentIndex + 1}`;

        // Stop any previous video and remove previous media.
        mediaContainer.replaceChildren();

        if (!src) {
            caption.textContent = "Media source is missing.";
            counter.textContent = "";
            return;
        }

        if (type === "video") {
            const video = document.createElement("video");

            video.controls = true;
            video.preload = "metadata";
            video.playsInline = true;
            video.setAttribute("aria-label", title);

            if (item.dataset.poster) {
                video.poster = item.dataset.poster;
            }

            const source = document.createElement("source");
            source.src = src;
            source.type = src.toLowerCase().endsWith(".webm")
                ? "video/webm"
                : "video/mp4";

            video.appendChild(source);
            mediaContainer.appendChild(video);

            if (autoplay) {
                const playPromise = video.play();

                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(() => {
                        // Playback may require another click on some devices.
                    });
                }
            }
        } else {
            const image = document.createElement("img");

            image.src = src;
            image.alt = title;

            image.addEventListener("error", () => {
                caption.textContent = `${title} — image could not be loaded.`;
            }, { once: true });

            mediaContainer.appendChild(image);
        }

        caption.textContent = title;
        counter.textContent =
            `${currentIndex + 1} / ${galleryItems.length}`;

        prevButton.hidden = galleryItems.length < 2;
        nextButton.hidden = galleryItems.length < 2;
    }

    function openLightbox(index) {
        lastFocusedElement = document.activeElement;

        showItem(index, true);

        lightbox.inert = false;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");

        closeButton.focus();
    }

    function closeLightbox() {
        if (!lightbox.classList.contains("is-open")) return;

        // Remove the video to stop playback immediately.
        mediaContainer.replaceChildren();

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.inert = true;
        document.body.classList.remove("lightbox-open");

        if (lastFocusedElement && lastFocusedElement.isConnected) {
            lastFocusedElement.focus();
        }
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    closeButton.addEventListener("click", closeLightbox);

    prevButton.addEventListener("click", () => {
        showItem(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showItem(currentIndex + 1);
    });

    // Close when the dark backdrop is clicked.
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation.
    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            showItem(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showItem(currentIndex + 1);
        }
    });
});
