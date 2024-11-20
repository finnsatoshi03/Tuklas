document.addEventListener("DOMContentLoaded", () => {
  const historySection = document.querySelector(".history");
  const historyItems = document.querySelector(".history-items");
  const items = document.querySelectorAll(".history-item");
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
});
