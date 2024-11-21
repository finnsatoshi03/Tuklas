document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const exploreBtn = document.querySelector(".explore-btn");
  const navItems = document.querySelector(".nav-items");
  const navItemsA = document.querySelectorAll(".nav-items a");

  // Check if current page is not index.html
  const isIndexPage =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/";

  // If not index page, add scrolled class immediately
  if (!isIndexPage) {
    header.classList.add("scrolled");
    exploreBtn.classList.add("scrolled");
    navItems.classList.add("scrolled");
  }

  // Add click event listener to each nav item
  navItemsA.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor behavior

      // Get the text of the clicked nav item
      const navText = item.textContent.toUpperCase();

      // If not on index page, redirect to index with appropriate section
      const sectionMapping = {
        "ABOUT US": "#about",
        DESTINATIONS: "#destinations",
        VISION: "#vision",
        HISTORY: "#history",
      };

      const sectionHash = sectionMapping[navText];
      if (sectionHash) {
        window.location.href = `../../../index.html${sectionHash}`;
      } else if (navText === "HOME") {
        window.location.href = "../../../index.html";
      }
    });
  });

  // Corrected class names from "destinaton" to "destination"
  const historySection = document.querySelector(".destination-page");
  const historyItems = document.querySelector(".destination-page-items");
  const items = document.querySelectorAll(".destination-page-item");

  let currentIndex = 0;
  let isScrolling = false;
  let isSectionInView = false;
  let lastWheelTime = Date.now();
  const scrollDebounceTime = 50;

  // Set the first item as active initially
  items[0].classList.add("active");

  // Check if history section is in viewport center
  const isInCenter = () => {
    const historySectionRect = historySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter =
      historySectionRect.top + historySectionRect.height / 2;
    const viewportCenter = windowHeight / 2;
    const centerThreshold = 200;

    return Math.abs(elementCenter - viewportCenter) < centerThreshold;
  };

  // Scroll to specific item with improved handling
  const scrollToItem = (index) => {
    if (index >= 0 && index < items.length) {
      items.forEach((item) => item.classList.remove("active"));
      items[index].classList.add("active");

      historyItems.scrollTo({
        left: items[index].offsetLeft,
        behavior: "smooth",
      });

      currentIndex = index;

      setTimeout(() => {
        isScrolling = false;
      }, 300);
    }
  };

  // Improved wheel event handler with proper boundary scrolling
  const handleScroll = (e) => {
    if (!isSectionInView || !isInCenter()) return;

    const currentTime = Date.now();
    const scrollingUp = e.deltaY < 0;
    const scrollingDown = e.deltaY > 0;

    // Allow general scroll at boundaries
    if (
      (scrollingUp && currentIndex === 0) ||
      (scrollingDown && currentIndex === items.length - 1)
    ) {
      return; // Don't prevent default, allow normal scroll
    }

    // Prevent default only for non-boundary conditions
    e.preventDefault();

    // Check debounce time
    if (currentTime - lastWheelTime < scrollDebounceTime) {
      return;
    }

    // Handle slider navigation
    if (scrollingDown && currentIndex < items.length - 1) {
      scrollToItem(currentIndex + 1);
    } else if (scrollingUp && currentIndex > 0) {
      scrollToItem(currentIndex - 1);
    }

    lastWheelTime = currentTime;
  };

  // Improved Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isSectionInView = entry.isIntersecting;

        if (entry.isIntersecting) {
          historySection.classList.add("scrolling-active");
          window.addEventListener("wheel", handleScroll, { passive: false });
        } else {
          historySection.classList.remove("scrolling-active");
          window.removeEventListener("wheel", handleScroll);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  observer.observe(historySection);

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (isSectionInView && isInCenter()) {
      if (
        (e.key === "ArrowRight" || e.key === "ArrowDown") &&
        currentIndex < items.length - 1
      ) {
        e.preventDefault();
        scrollToItem(currentIndex + 1);
      } else if (
        (e.key === "ArrowLeft" || e.key === "ArrowUp") &&
        currentIndex > 0
      ) {
        e.preventDefault();
        scrollToItem(currentIndex - 1);
      }
    }
  });

  // Touch handling
  let touchStartX = 0;
  let touchStartY = 0;
  const touchThreshold = 30;

  historySection.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  });

  historySection.addEventListener("touchend", (e) => {
    if (!isSectionInView || !isInCenter()) return;

    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const differenceX = touchStartX - touchEndX;
    const differenceY = touchStartY - touchEndY;

    if (
      Math.abs(differenceX) > Math.abs(differenceY) &&
      Math.abs(differenceX) > touchThreshold
    ) {
      if (differenceX > 0 && currentIndex < items.length - 1) {
        scrollToItem(currentIndex + 1);
      } else if (differenceX < 0 && currentIndex > 0) {
        scrollToItem(currentIndex - 1);
      }
    }
  });

  const destinationPageItems = document.querySelectorAll(
    ".destination-page-item"
  );

  destinationPageItems.forEach((item) => {
    const mainImage = item.querySelector("img:first-of-type");
    const subImages = item.querySelectorAll(".destination-page-sub-images img");

    if (subImages.length > 0 && mainImage) {
      // Find and highlight the sub-image that matches the main image
      const matchingSubImage = Array.from(subImages).find(
        (subImg) => subImg.src === mainImage.src
      );

      if (matchingSubImage) {
        // Highlight the matching sub-image
        matchingSubImage.style.filter = "grayscale(0%)";
        matchingSubImage.style.opacity = "1";
      }

      subImages.forEach((subImage) => {
        subImage.addEventListener("click", () => {
          // Reset all sub-images
          subImages.forEach((img) => {
            img.style.filter = "grayscale(100%)";
            img.style.opacity = "0.5";
          });

          // If clicking the current main image, revert to original
          if (mainImage.src === subImage.src) {
            // Reset all sub-images completely
            subImages.forEach((img) => {
              img.style.filter = "grayscale(100%)";
              img.style.opacity = "0.5";
            });

            // Find and highlight the original image's sub-image
            const originalSubImage = Array.from(subImages).find(
              (subImg) => subImg.src === mainImage.src
            );

            if (originalSubImage) {
              originalSubImage.style.filter = "grayscale(0%)";
              originalSubImage.style.opacity = "1";
            }
          } else {
            // Highlight clicked sub-image
            subImage.style.filter = "grayscale(0%)";
            subImage.style.opacity = "1";

            // Replace main image with clicked sub-image
            mainImage.src = subImage.src;
          }
        });
      });
    }
  });
});
