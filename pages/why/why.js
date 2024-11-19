// Select both About and Why sections
const aboutSection = document.querySelector(".about");
const whySection = document.querySelector(".why");
const leftClouds = document.querySelectorAll(
  ".why-element-4, .why-element-5, .why-element-6"
);
const rightClouds = document.querySelectorAll(
  ".why-element-1, .why-element-2, .why-element-3"
);

// Define unique movement distances for each element (adding 2rem increments)
const movementDistances = {
  "why-element-1": 64, // Base distance
  "why-element-2": 260, // Base + 2rem (32px)
  "why-element-3": 32, // Base + 4rem (64px)
  "why-element-4": -280, // Base distance
  "why-element-5": -128, // Base - 2rem (32px)
  "why-element-6": -64, // Base - 4rem (64px)
};

// Initialize starting positions for each cloud
const cloudInitialPositions = new Map();

// Store initial positions once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  [...leftClouds, ...rightClouds].forEach((cloud) => {
    cloudInitialPositions.set(cloud, {
      left: parseFloat(getComputedStyle(cloud).left),
      top: parseFloat(getComputedStyle(cloud).top),
    });
  });
});

// Create intersection observer for both sections
const observerOptions = {
  threshold: 0.2, // Start animation when 20% of the section is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Add scroll event listener when either section is in view
      window.addEventListener("scroll", animateClouds);
    } else {
      // Only remove listener and reset clouds if both sections are out of view
      const aboutRect = aboutSection.getBoundingClientRect();
      const whyRect = whySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (aboutRect.bottom < 0 && whyRect.top > windowHeight) {
        window.removeEventListener("scroll", animateClouds);
        resetCloudPositions();
      }
    }
  });
}, observerOptions);

// Observe both sections
observer.observe(aboutSection);
observer.observe(whySection);

// Function to animate clouds based on scroll position
function animateClouds() {
  const aboutRect = aboutSection.getBoundingClientRect();
  const whyRect = whySection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Calculate overall scroll progress across both sections
  const totalHeight = whyRect.bottom - aboutRect.top;
  const scrollProgress =
    (windowHeight - aboutRect.top) / (windowHeight + totalHeight);

  // Only animate when either section is in viewport
  if (aboutRect.bottom > 0 && whyRect.top < windowHeight) {
    // Animate all clouds with their unique distances
    [...leftClouds, ...rightClouds].forEach((cloud) => {
      // Get the unique movement distance for this cloud
      const baseDistance = movementDistances[cloud.className.split(" ")[0]];
      const moveDistance = scrollProgress * baseDistance;

      cloud.style.transform = `translateX(${moveDistance}px)`;
      // cloud.style.opacity = Math.max(0.1, Math.min(0.3, 0.1 + scrollProgress * 0.2));
    });
  }
}

// Function to reset cloud positions
function resetCloudPositions() {
  [...leftClouds, ...rightClouds].forEach((cloud) => {
    cloud.style.transform = "translateX(0)";
    // cloud.style.opacity = '0.1';
  });
}

// Add resize handler to update initial positions
window.addEventListener("resize", () => {
  [...leftClouds, ...rightClouds].forEach((cloud) => {
    cloudInitialPositions.set(cloud, {
      left: parseFloat(getComputedStyle(cloud).left),
      top: parseFloat(getComputedStyle(cloud).top),
    });
  });
});
