const fortBonifacio = document.getElementById("fort-bonifacio");
const tooltip = document.getElementById("tooltip");

// Ensure the entire group is interactive
fortBonifacio.style.pointerEvents = "all";

// Debugging log to check if the event listener is working
fortBonifacio.addEventListener("mouseenter", () => {
  console.log("Mouse entered Fort Bonifacio area");
});

// Add hover interaction for Fort Bonifacio
fortBonifacio.addEventListener("mousemove", (e) => {
  const name = "Fort Bonifacio";
  const description =
    "A central business district and military area located in Taguig City, Metro Manila. Known for its modern urban development, high-rise buildings, and commercial centers.";

  tooltip.innerHTML = `
    <h3 style="margin: 0 0 5px 0; font-weight: bold; font-size: 16px;">${name}</h3>
    <p style="margin: 0; font-size: 14px;">${description}</p>
  `;

  tooltip.style.display = "block";
  tooltip.style.left = `${e.pageX + 10}px`;
  tooltip.style.top = `${e.pageY + 10}px`;
});

fortBonifacio.addEventListener("mouseout", () => {
  tooltip.style.display = "none";
});

// Add click interaction for Fort Bonifacio
fortBonifacio.addEventListener("click", () => {
  const name = "Fort Bonifacio";
  const description =
    "A central business district and military area located in Taguig City, Metro Manila. Known for its modern urban development, high-rise buildings, and commercial centers.";

  alert(`
Area: ${name}
Description: ${description}
Key Features:
- Home to Bonifacio Global City (BGC)
- Major financial and lifestyle hub
- Mix of residential, commercial, and office spaces
- Popular with young professionals and businesses
  `);
});

const svgElement = document.getElementById("base");
const svgContainer = svgElement.closest("div");

let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 3;

let isPanning = false;
let startX, startY;
let translateX = 0,
  translateY = 0;

// Zoom function
function zoom(delta, clientX, clientY) {
  const rect = svgElement.getBoundingClientRect();
  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  // Calculate new zoom
  const newZoom = Math.max(
    minZoom,
    Math.min(maxZoom, currentZoom * (delta > 0 ? 0.9 : 1.1))
  );
  const zoomFactor = newZoom / currentZoom;

  // Update translate to zoom towards mouse point
  translateX = mouseX - (mouseX - translateX) * zoomFactor;
  translateY = mouseY - (mouseY - translateY) * zoomFactor;

  // Apply transformation
  currentZoom = newZoom;
  updateTransform();
}

// Pan function
function pan(clientX, clientY) {
  const deltaX = clientX - startX;
  const deltaY = clientY - startY;

  translateX += deltaX;
  translateY += deltaY;

  startX = clientX;
  startY = clientY;

  updateTransform();
}

// Update SVG transform
function updateTransform() {
  // Get SVG dimensions
  const svgWidth = svgElement.clientWidth;
  const svgHeight = svgElement.clientHeight;

  // Calculate max translation based on zoom
  const maxTranslateX = (svgWidth * (currentZoom - 1)) / 2;
  const maxTranslateY = (svgHeight * (currentZoom - 1)) / 2;

  // Clamp translation
  translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX));
  translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));

  // Set transform origin to center
  svgElement.style.transformOrigin = "center center";

  // Apply transform with centered origin
  svgElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

// Mouse wheel zoom

svgElement.addEventListener("wheel", (e) => {
  e.preventDefault();

  zoom(e.deltaY, e.clientX, e.clientY);
});

// Mouse pan

svgElement.addEventListener("mousedown", (e) => {
  e.preventDefault();

  isPanning = true;

  startX = e.clientX;

  startY = e.clientY;

  svgElement.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (isPanning) {
    e.preventDefault();

    pan(e.clientX, e.clientY);
  }
});

document.addEventListener("mouseup", () => {
  if (isPanning) {
    isPanning = false;

    svgElement.style.cursor = "grab";
  }
});

// Touch support for mobile

let touchZoom = false;

svgElement.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    // Pinch zoom

    touchZoom = true;

    const touch1 = e.touches[0];

    const touch2 = e.touches[1];

    initialPinchDistance = Math.hypot(
      touch1.pageX - touch2.pageX,

      touch1.pageY - touch2.pageY
    );

    initialZoom = currentZoom;
  } else if (e.touches.length === 1 && !touchZoom) {
    // Pan

    startX = e.touches[0].clientX;

    startY = e.touches[0].clientY;

    isPanning = true;
  }
});

svgElement.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2) {
    // Pinch zoom

    const touch1 = e.touches[0];

    const touch2 = e.touches[1];

    const currentPinchDistance = Math.hypot(
      touch1.pageX - touch2.pageX,

      touch1.pageY - touch2.pageY
    );

    const pinchFactor = currentPinchDistance / initialPinchDistance;

    const newZoom = initialZoom * pinchFactor;

    currentZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));

    updateTransform();
  } else if (e.touches.length === 1 && !touchZoom) {
    // Pan

    pan(e.touches[0].clientX, e.touches[0].clientY);
  }
});

svgElement.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) {
    touchZoom = false;

    isPanning = false;
  }
});

// Reset zoom on double click/tap

svgElement.addEventListener("dblclick", () => {
  currentZoom = 1;

  translateX = 0;

  translateY = 0;

  updateTransform();
});

// Initial styling

svgElement.style.cursor = "grab";
svgElement.style.transformOrigin = "center center";
svgElement.style.transition = "transform 0.2s ease";

// Prevent default touch behaviors

svgElement.addEventListener(
  "touchstart",

  (e) => {
    e.preventDefault();
  },

  { passive: false }
);

svgElement.addEventListener(
  "touchmove",

  (e) => {
    e.preventDefault();
  },

  { passive: false }
);

// Make SVG responsive

function resizeSVG() {
  const container = svgElement.closest("div");

  const containerWidth = container.clientWidth;

  const containerHeight = container.clientHeight;

  svgElement.style.maxWidth = "100%";

  //   svgElement.style.maxHeight = "100vh";
}

// Resize on load and window resize

window.addEventListener("resize", resizeSVG);

resizeSVG();
