// Get the vision section and cloud elements
const visionSection = document.querySelector(".vision");
const visionLeftClouds = document.querySelectorAll(
  ".vision-element-6, .vision-element-7, .vision-element-8, .vision-element-9"
);
const visionRightClouds = document.querySelectorAll(
  ".vision-element-1, .vision-element-2, .vision-element-3, .vision-element-4, .vision-element-5"
);

// Define movement distances and delays for vision elements
const visionCloudConfig = {
  // Right side clouds (negative values move left)
  "vision-element-1": { distance: -120, delay: 0 },
  "vision-element-2": { distance: -180, delay: 0.2 },
  "vision-element-3": { distance: -140, delay: 0.4 },
  "vision-element-4": { distance: -160, delay: 0.6 },
  "vision-element-5": { distance: -200, delay: 0.8 },

  // Left side clouds (positive values move right)
  "vision-element-6": { distance: 200, delay: 0.1 },
  "vision-element-7": { distance: 180, delay: 0.3 },
  "vision-element-8": { distance: 220, delay: 0.5 },
  "vision-element-9": { distance: 190, delay: 0.7 },
};

// Function to calculate eased value
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Function to animate vision clouds
function animateVisionClouds() {
  const visionRect = visionSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Start animation when the section is entering the viewport
  if (visionRect.top <= windowHeight && visionRect.bottom >= 0) {
    // Calculate scroll progress relative to the vision section
    const sectionProgress =
      (windowHeight - visionRect.top) / (windowHeight + visionRect.height);
    // Clamp the progress between 0 and 1
    const baseProgress = Math.max(0, Math.min(1, sectionProgress));

    // Apply animations to all clouds
    [...visionLeftClouds, ...visionRightClouds].forEach((cloud) => {
      const className = Array.from(cloud.classList).find((name) =>
        name.startsWith("vision-element-")
      );
      if (className && visionCloudConfig[className]) {
        const { distance, delay } = visionCloudConfig[className];

        // Adjust progress based on delay
        let adjustedProgress = Math.max(0, baseProgress - delay);
        // Normalize the progress to 0-1 range
        adjustedProgress = Math.min(1, adjustedProgress / (1 - delay));

        // Apply easing to make movement smoother
        const easedProgress = easeInOutQuad(adjustedProgress);

        // Calculate and apply movement
        const moveDistance = easedProgress * distance;
        cloud.style.transform = `translateX(${moveDistance}px)`;
      }
    });
  }
}

// Add scroll event listener with throttling
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      animateVisionClouds();
      ticking = false;
    });
    ticking = true;
  }
});

// Initial check in case the section is already in view when page loads
document.addEventListener("DOMContentLoaded", () => {
  animateVisionClouds();
});
