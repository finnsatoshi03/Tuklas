// Get the vision section and cloud elements
const visionSection = document.querySelector(".history");
const visionLeftClouds = document.querySelectorAll(
  ".history-element-6, .history-element-7, .history-element-8, .history-element-9"
);
const visionRightClouds = document.querySelectorAll(
  ".history-element-1, .history-element-2, .history-element-3, .history-element-4, .history-element-5"
);

// Define movement distances and delays for vision elements
const visionCloudConfig = {
  "history-element-1": { distance: -150, delay: 0 },
  "history-element-2": { distance: -210, delay: 0.2 },
  "history-element-3": { distance: -170, delay: 0.4 },
  "history-element-4": { distance: -190, delay: 0.2 },
  "history-element-5": { distance: -230, delay: 0.5 },
  "history-element-6": { distance: 230, delay: 0.1 },
  "history-element-7": { distance: 210, delay: 0.3 },
  "history-element-8": { distance: 250, delay: 0.5 },
  "history-element-9": { distance: 220, delay: 0.3 },
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
        name.startsWith("history-element-")
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
